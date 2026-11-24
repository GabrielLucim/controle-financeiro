package br.edu.ifpr.fincontrol.backend.security;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


public class AuthRateLimitFilter extends OncePerRequestFilter {

    private static final Duration DEFAULT_WINDOW = Duration.ofMinutes(15);

    private static final Map<String, RateLimitRule> RULES = Map.of(
            "/auth/login", new RateLimitRule(10, DEFAULT_WINDOW),
            "/auth/register", new RateLimitRule(5, DEFAULT_WINDOW),
            "/auth/forgot-password", new RateLimitRule(3, DEFAULT_WINDOW),
            "/auth/start-reset", new RateLimitRule(5, DEFAULT_WINDOW),
            "/auth/reset-password", new RateLimitRule(5, DEFAULT_WINDOW));

    private static final long CLEANUP_INTERVAL = 100;

    private final ConcurrentMap<String, AttemptWindow> attempts = new ConcurrentHashMap<>();
    private final AtomicLong processedRequests = new AtomicLong();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request)
            throws ServletException {

        return !"POST".equalsIgnoreCase(request.getMethod())
                || !RULES.containsKey(request.getServletPath());
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        RateLimitRule rule = RULES.get(path);

        String remoteAddress = request.getRemoteAddr();
        if (remoteAddress == null || remoteAddress.isBlank()) {
            remoteAddress = "unknown";
        }

        Instant now = Instant.now();
        String key = remoteAddress + ":" + path;

        AtomicLong retryAfterHolder = new AtomicLong();

        attempts.compute(key, (ignored, currentWindow) -> {
            AttemptWindow activeWindow = currentWindow;

            if (activeWindow == null || activeWindow.isExpired(now)) {
                activeWindow = new AttemptWindow(now, rule.window());
            }

            retryAfterHolder.set(
                    activeWindow.tryRegister(now, rule.maxRequests()));

            return activeWindow;
        });

        long retryAfter = retryAfterHolder.get();

        cleanExpiredWindows(now);

        if (retryAfter > 0) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setHeader("Retry-After", String.valueOf(retryAfter));
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(
                    "{\"message\":\"Muitas tentativas. Aguarde antes de tentar novamente.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void cleanExpiredWindows(Instant now) {

        long currentRequest = processedRequests.incrementAndGet();

        if (currentRequest % CLEANUP_INTERVAL == 0) {
            attempts.forEach((key, window) -> attempts.computeIfPresent(
                    key,
                    (ignored, currentWindow) -> currentWindow == window
                            && currentWindow.isExpired(now)
                                    ? null
                                    : currentWindow));
        }
    }

    private record RateLimitRule(int maxRequests, Duration window) {
    }

    private static class AttemptWindow {

        private Instant startedAt;
        private final Duration duration;
        private int requestCount;

        private AttemptWindow(Instant startedAt, Duration duration) {
            this.startedAt = startedAt;
            this.duration = duration;
        }

        private synchronized long tryRegister(Instant now, int maxRequests) {

            Instant expiresAt = startedAt.plus(duration);

            if (!now.isBefore(expiresAt)) {
                startedAt = now;
                requestCount = 0;
                expiresAt = startedAt.plus(duration);
            }

            if (requestCount >= maxRequests) {
                long millisecondsRemaining = Duration.between(now, expiresAt).toMillis();
                return Math.max(1, (millisecondsRemaining + 999) / 1000);
            }

            requestCount++;
            return 0;
        }

        private synchronized boolean isExpired(Instant now) {
            return !now.isBefore(startedAt.plus(duration));
        }
    }
}
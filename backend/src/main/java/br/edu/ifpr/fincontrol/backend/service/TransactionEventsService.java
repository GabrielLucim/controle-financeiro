package br.edu.ifpr.fincontrol.backend.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class TransactionEventsService {

    private static final long TIMEOUT_MS = 30 * 60 * 1000L;
    private static final Duration TICKET_TTL = Duration.ofSeconds(60);

    private final Map<Long, CopyOnWriteArrayList<SseEmitter>> emittersByUser = new ConcurrentHashMap<>();
    private final Map<String, StreamTicket> tickets = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();

    public String createTicket(Long userId) {

        removeExpiredTickets();

        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);

        String ticket = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);

        String ticketHash = hashTicket(ticket);

        tickets.put(
                ticketHash,
                new StreamTicket(userId, Instant.now().plus(TICKET_TTL)));

        return ticket;
    }

    public Long consumeTicket(String ticket) {

        if (ticket == null || ticket.isBlank()) {
            throw invalidTicketException();
        }

        String ticketHash = hashTicket(ticket);
        StreamTicket storedTicket = tickets.remove(ticketHash);

        if (storedTicket == null || !storedTicket.expiresAt().isAfter(Instant.now())) {
            throw invalidTicketException();
        }

        return storedTicket.userId();
    }

    public SseEmitter register(Long userId) {

        SseEmitter emitter = new SseEmitter(TIMEOUT_MS);

        emittersByUser
                .computeIfAbsent(userId, key -> new CopyOnWriteArrayList<>())
                .add(emitter);

        Runnable removeEmitter = () -> removeEmitter(userId, emitter);

        emitter.onCompletion(removeEmitter);
        emitter.onTimeout(removeEmitter);
        emitter.onError(error -> removeEmitter.run());

        try {
            emitter.send(
                    SseEmitter.event()
                            .name("connected")
                            .data("ok"));
        } catch (IOException | IllegalStateException exception) {
            removeEmitter.run();
            emitter.completeWithError(exception);
        }

        return emitter;
    }

    public void notifyUser(Long userId, String action) {

        List<SseEmitter> userEmitters = emittersByUser.get(userId);

        if (userEmitters == null) {
            return;
        }

        for (SseEmitter emitter : userEmitters) {
            try {
                emitter.send(
                        SseEmitter.event()
                                .name("transaction-changed")
                                .data(action));
            } catch (IOException | IllegalStateException exception) {
                removeEmitter(userId, emitter);
                emitter.completeWithError(exception);
            }
        }
    }

    private void removeEmitter(Long userId, SseEmitter emitter) {

        emittersByUser.computeIfPresent(userId, (key, userEmitters) -> {
            userEmitters.remove(emitter);
            return userEmitters.isEmpty() ? null : userEmitters;
        });
    }

    private void removeExpiredTickets() {

        Instant now = Instant.now();

        tickets.entrySet().removeIf(
                entry -> !entry.getValue().expiresAt().isAfter(now));

    }

    private String hashTicket(String ticket) {

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(ticket.getBytes(StandardCharsets.UTF_8));

            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(hash);

        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                    "Não foi possível processar o ticket de conexão.",
                    exception);
        }
    }

    private ResponseStatusException invalidTicketException() {

        return new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Ticket de conexão inválido, expirado ou já utilizado.");

    }

    private record StreamTicket(Long userId, Instant expiresAt) {
    }
}
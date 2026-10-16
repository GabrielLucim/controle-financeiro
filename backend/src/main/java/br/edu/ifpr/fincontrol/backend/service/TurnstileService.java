package br.edu.ifpr.fincontrol.backend.service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class TurnstileService {

    private static final String VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    private final String secretKey;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public TurnstileService(
            @Value("${turnstile.secret-key:}") String secretKey,
            ObjectMapper objectMapper) {
        this.secretKey = secretKey;
        this.objectMapper = objectMapper;
    }

    public boolean isValid(String token) {

        if (secretKey == null || secretKey.isBlank()
                || token == null || token.isBlank()) {
            return false;
        }

        try {
            String body = "secret=" + encode(secretKey)
                    + "&response=" + encode(token);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(VERIFY_URL))
                    .header(
                            "Content-Type",
                            "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                return false;
            }

            JsonNode json = objectMapper.readTree(response.body());

            return json.path("success").asBoolean(false);

        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            return false;
        } catch (Exception ex) {
            return false;
        }
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
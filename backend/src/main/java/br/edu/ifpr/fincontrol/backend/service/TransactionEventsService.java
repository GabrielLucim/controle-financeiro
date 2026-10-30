package br.edu.ifpr.fincontrol.backend.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class TransactionEventsService {

    private static final long TIMEOUT_MS = 30 * 60 * 1000L;

    private final Map<Long, CopyOnWriteArrayList<SseEmitter>> emittersByUser = new ConcurrentHashMap<>();

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
}
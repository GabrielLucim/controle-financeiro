package br.edu.ifpr.fincontrol.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import br.edu.ifpr.fincontrol.backend.dto.request.TransactionRequest;
import br.edu.ifpr.fincontrol.backend.dto.response.TransactionResponse;
import br.edu.ifpr.fincontrol.backend.security.UserDetailsImpl;
import br.edu.ifpr.fincontrol.backend.service.TransactionEventsService;
import br.edu.ifpr.fincontrol.backend.service.TransactionService;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
@Validated
public class TransactionController {

    private final TransactionService service;
    private final TransactionEventsService eventsService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TransactionResponse create(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody @Valid TransactionRequest request) {

        return service.create(request, userDetails.getUser().getId());

    }

    @GetMapping
    public List<TransactionResponse> findAll(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        return service.findAllByUserId(userDetails.getUser().getId());

    }

    @PostMapping("/stream-ticket")
    public ResponseEntity<Map<String, String>> createStreamTicket(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        String ticket = eventsService.createTicket(userDetails.getUser().getId());

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(Map.of("ticket", ticket));

    }

    @GetMapping(path = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(
            @RequestParam("ticket") String ticket,
            HttpServletResponse response) {

        response.setHeader("Cache-Control", "no-store");

        Long userId = eventsService.consumeTicket(ticket);

        return eventsService.register(userId);

    }

    @GetMapping("/{id}")
    public TransactionResponse findById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        return service.findById(id, userDetails.getUser().getId());

    }

    @PutMapping("/{id}")
    public TransactionResponse update(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody @Valid TransactionRequest request) {

        return service.update(id, request, userDetails.getUser().getId());

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        service.delete(id, userDetails.getUser().getId());

    }

}
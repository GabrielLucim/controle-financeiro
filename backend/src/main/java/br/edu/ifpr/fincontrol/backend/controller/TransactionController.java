package br.edu.ifpr.fincontrol.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import br.edu.ifpr.fincontrol.backend.dto.request.TransactionRequest;
import br.edu.ifpr.fincontrol.backend.dto.response.TransactionResponse;
import br.edu.ifpr.fincontrol.backend.security.UserDetailsImpl;
import br.edu.ifpr.fincontrol.backend.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
@Validated
public class TransactionController {

    private final TransactionService service;

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
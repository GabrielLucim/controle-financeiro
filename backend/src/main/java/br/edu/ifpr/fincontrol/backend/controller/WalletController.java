package br.edu.ifpr.fincontrol.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import br.edu.ifpr.fincontrol.backend.dto.request.WalletRequest;
import br.edu.ifpr.fincontrol.backend.dto.response.WalletResponse;
import br.edu.ifpr.fincontrol.backend.security.UserDetailsImpl;
import br.edu.ifpr.fincontrol.backend.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/wallets")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @PostMapping
    public ResponseEntity<WalletResponse> create(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody WalletRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(walletService.create(request, userDetails.getUser().getId()));
    }

    @GetMapping
    public ResponseEntity<List<WalletResponse>> findAll(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        return ResponseEntity.ok(walletService.findAllByUserId(userDetails.getUser().getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WalletResponse> findById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        return ResponseEntity.ok(walletService.findById(id, userDetails.getUser().getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WalletResponse> update(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody WalletRequest request) {

        return ResponseEntity.ok(walletService.update(id, request, userDetails.getUser().getId()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        walletService.delete(id, userDetails.getUser().getId());
    }
}
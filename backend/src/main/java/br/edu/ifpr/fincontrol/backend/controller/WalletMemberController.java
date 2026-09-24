package br.edu.ifpr.fincontrol.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import br.edu.ifpr.fincontrol.backend.dto.request.AddWalletMemberRequest;
import br.edu.ifpr.fincontrol.backend.dto.request.UpdateWalletMemberRequest;
import br.edu.ifpr.fincontrol.backend.dto.response.WalletMemberResponse;
import br.edu.ifpr.fincontrol.backend.security.UserDetailsImpl;
import br.edu.ifpr.fincontrol.backend.service.WalletMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/wallets/{walletId}/members")
@RequiredArgsConstructor
public class WalletMemberController {

    private final WalletMemberService walletMemberService;

    @GetMapping
    public ResponseEntity<List<WalletMemberResponse>> findAll(
            @PathVariable Long walletId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        return ResponseEntity.ok(
                walletMemberService.findAll(
                        walletId,
                        userDetails.getUser().getId()));
    }

    @PostMapping
    public ResponseEntity<WalletMemberResponse> add(
            @PathVariable Long walletId,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody AddWalletMemberRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED).body(
                walletMemberService.add(
                        walletId,
                        request,
                        userDetails.getUser().getId()));
    }

    @PatchMapping("/{userId}")
    public ResponseEntity<WalletMemberResponse> update(
            @PathVariable Long walletId,
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody UpdateWalletMemberRequest request) {

        return ResponseEntity.ok(
                walletMemberService.update(
                        walletId,
                        userId,
                        request,
                        userDetails.getUser().getId()));
    }

    @DeleteMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(
            @PathVariable Long walletId,
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        walletMemberService.remove(
                walletId,
                userId,
                userDetails.getUser().getId());
    }
}
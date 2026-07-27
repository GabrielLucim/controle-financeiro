package br.edu.ifpr.fincontrol.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifpr.fincontrol.backend.dto.request.WalletRequest;
import br.edu.ifpr.fincontrol.backend.dto.response.WalletResponse;
import br.edu.ifpr.fincontrol.backend.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/wallets")
@RequiredArgsConstructor
@Validated
public class WalletController {

    private final WalletService service;

    @PostMapping
    public ResponseEntity<WalletResponse> create(
            @Valid @RequestBody WalletRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(request));

    }

    @GetMapping
    public ResponseEntity<List<WalletResponse>> findAll() {

        return ResponseEntity.ok(service.findAll());

    }

    @GetMapping("/{id}")
    public ResponseEntity<WalletResponse> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(service.findById(id));

    }

    @PutMapping("/{id}")
    public ResponseEntity<WalletResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody WalletRequest request) {

        return ResponseEntity.ok(service.update(id, request));

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.noContent().build();

    }

}

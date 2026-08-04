package br.edu.ifpr.fincontrol.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import br.edu.ifpr.fincontrol.backend.dto.request.CategoryRequest;
import br.edu.ifpr.fincontrol.backend.dto.response.CategoryResponse;
import br.edu.ifpr.fincontrol.backend.security.UserDetailsImpl;
import br.edu.ifpr.fincontrol.backend.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Validated
public class CategoryController {

    private final CategoryService service;

    @PostMapping
    public ResponseEntity<CategoryResponse> create(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CategoryRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request, userDetails.getUser().getId()));

    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> findAll(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        return ResponseEntity.ok(service.findAllByUserId(userDetails.getUser().getId()));

    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> findById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        return ResponseEntity.ok(service.findById(id, userDetails.getUser().getId()));

    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> update(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CategoryRequest request) {

        return ResponseEntity.ok(service.update(id, request, userDetails.getUser().getId()));

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        service.delete(id, userDetails.getUser().getId());

        return ResponseEntity.noContent().build();

    }

}
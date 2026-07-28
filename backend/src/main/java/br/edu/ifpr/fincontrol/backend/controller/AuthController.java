package br.edu.ifpr.fincontrol.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import br.edu.ifpr.fincontrol.backend.dto.request.RegisterRequest;
import br.edu.ifpr.fincontrol.backend.dto.response.UserResponse;
import br.edu.ifpr.fincontrol.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {

        return authService.register(request);

    }

}
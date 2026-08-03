package br.edu.ifpr.fincontrol.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import br.edu.ifpr.fincontrol.backend.dto.request.ForgotPasswordRequest;
import br.edu.ifpr.fincontrol.backend.dto.request.LoginRequest;
import br.edu.ifpr.fincontrol.backend.dto.request.RegisterRequest;
import br.edu.ifpr.fincontrol.backend.dto.request.ResetPasswordRequest;
import br.edu.ifpr.fincontrol.backend.dto.response.LoginResponse;
import br.edu.ifpr.fincontrol.backend.dto.response.UserResponse;
import br.edu.ifpr.fincontrol.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {

        return authService.register(request);

    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {

        return authService.login(request);

    }

    @PostMapping("/forgot-password")
    @ResponseStatus(HttpStatus.OK)
    public void forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {

        authService.forgotPassword(request);

    }

    @PostMapping("/reset-password")
    @ResponseStatus(HttpStatus.OK)
    public void resetPassword(@Valid @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(request);

    }

}
package br.edu.ifpr.fincontrol.backend.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ifpr.fincontrol.backend.dto.request.ForgotPasswordRequest;
import br.edu.ifpr.fincontrol.backend.dto.request.LoginRequest;
import br.edu.ifpr.fincontrol.backend.dto.request.RegisterRequest;
import br.edu.ifpr.fincontrol.backend.dto.request.ResetPasswordRequest;
import br.edu.ifpr.fincontrol.backend.dto.response.LoginResponse;
import br.edu.ifpr.fincontrol.backend.dto.response.UserResponse;
import br.edu.ifpr.fincontrol.backend.entity.PasswordResetToken;
import br.edu.ifpr.fincontrol.backend.entity.User;
import br.edu.ifpr.fincontrol.backend.exception.BusinessException;
import br.edu.ifpr.fincontrol.backend.repository.PasswordResetTokenRepository;
import br.edu.ifpr.fincontrol.backend.repository.UserRepository;
import br.edu.ifpr.fincontrol.backend.security.JwtService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final EmailService emailService;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    public UserResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(
                    "Já existe um usuário cadastrado com este e-mail.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        user = userRepository.save(user);

        return toResponse(user);
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException(
                        "E-mail ou senha inválidos."));

        PasswordResetToken activeReset = resetTokenRepository
                .findByUserIdAndUsedFalse(user.getId())
                .orElse(null);

        if (activeReset != null
                && activeReset.isResetStarted()
                && activeReset.getExpiresAt().isAfter(LocalDateTime.now())) {

            throw new BusinessException(
                    "Existe uma recuperação de senha em andamento. "
                            + "Defina uma nova senha antes de fazer login.");
        }

        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {

            throw new BusinessException(
                    "E-mail ou senha inválidos.");
        }

        String token = jwtService.generateToken(user);

        return LoginResponse.builder()
                .accessToken(token)
                .user(toResponse(user))
                .build();
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {

        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {

            resetTokenRepository.deleteByUserId(user.getId());

            String token = UUID.randomUUID().toString();
            String tokenHash = hashToken(token);

            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .token(tokenHash)
                    .user(user)
                    .expiresAt(LocalDateTime.now().plusHours(1))
                    .used(false)
                    .resetStarted(false)
                    .build();

            resetTokenRepository.save(resetToken);

            String baseUrl = frontendUrl.replaceAll("/+$", "");
            String resetLink = baseUrl + "/redefinir-senha/" + token;

            emailService.sendPasswordResetEmail(
                    user.getEmail(),
                    user.getName(),
                    resetLink);
        });
    }

    @Transactional
    public void startPasswordReset(String token) {

        PasswordResetToken resetToken = findValidResetToken(token);

        resetToken.setResetStarted(true);

        resetTokenRepository.save(resetToken);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {

        PasswordResetToken resetToken = findValidResetToken(request.getToken());

        User user = resetToken.getUser();

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        resetTokenRepository.delete(resetToken);
    }

    private PasswordResetToken findValidResetToken(String token) {

        if (token == null || token.isBlank()) {
            throw new BusinessException(
                    "Token inválido ou expirado.");
        }

        // A busca utiliza o hash, nunca o token original.
        PasswordResetToken resetToken = resetTokenRepository
                .findByToken(hashToken(token))
                .orElseThrow(() -> new BusinessException(
                        "Token inválido ou expirado."));

        if (resetToken.isUsed()
                || !resetToken.getExpiresAt().isAfter(LocalDateTime.now())) {

            throw new BusinessException(
                    "Token inválido ou expirado.");
        }

        return resetToken;
    }

    private String hashToken(String token) {

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8));

            return HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException(
                    "Não foi possível processar o token de recuperação.",
                    ex);
        }
    }

    private UserResponse toResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
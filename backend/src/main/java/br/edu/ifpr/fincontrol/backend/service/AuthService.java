package br.edu.ifpr.fincontrol.backend.service;

import java.time.LocalDateTime;

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

    public UserResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Já existe um usuário cadastrado com este e-mail.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        return toResponse(user);
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException("E-mail ou senha inválidos."));

        PasswordResetToken activeReset = resetTokenRepository
                .findByUserIdAndUsedFalse(user.getId())
                .orElse(null);

        if (activeReset != null
                && activeReset.isResetStarted()
                && activeReset.getExpiresAt().isAfter(LocalDateTime.now())) {

            throw new BusinessException(
                    "Existe uma recuperação de senha em andamento. Defina uma nova senha antes de fazer login.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException("E-mail ou senha inválidos.");
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

            String token = java.util.UUID.randomUUID().toString();

            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .token(token)
                    .user(user)
                    .expiresAt(LocalDateTime.now().plusHours(1))
                    .used(false)
                    .resetStarted(false)
                    .build();

            resetTokenRepository.save(resetToken);

            String resetLink = "http://localhost:5173/redefinir-senha/" + token;

            emailService.sendPasswordResetEmail(
                    user.getEmail(),
                    user.getName(),
                    resetLink);
        });
    }

    public void startPasswordReset(String token) {

        PasswordResetToken resetToken = resetTokenRepository
                .findByToken(token)
                .orElseThrow(() -> new BusinessException("Token inválido ou expirado."));

        if (resetToken.isUsed() || resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {

            throw new BusinessException("Token inválido ou expirado.");
        }

        resetToken.setResetStarted(true);
        resetTokenRepository.save(resetToken);

    }

    public void resetPassword(ResetPasswordRequest request) {

        PasswordResetToken resetToken = resetTokenRepository
            .findByToken(request.getToken())
            .orElseThrow(() -> new BusinessException("Token inválido ou expirado."));

        if (resetToken.isUsed() || resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {

            throw new BusinessException("Token inválido ou expirado.");
        }

        User user = resetToken.getUser();

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        resetTokenRepository.delete(resetToken);
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
package br.edu.ifpr.fincontrol.backend.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.edu.ifpr.fincontrol.backend.dto.request.ChangePasswordRequest;
import br.edu.ifpr.fincontrol.backend.dto.request.UserRequest;
import br.edu.ifpr.fincontrol.backend.dto.response.UserResponse;
import br.edu.ifpr.fincontrol.backend.entity.User;
import br.edu.ifpr.fincontrol.backend.exception.BusinessException;
import br.edu.ifpr.fincontrol.backend.exception.ResourceNotFoundException;
import br.edu.ifpr.fincontrol.backend.repository.PasswordResetTokenRepository;
import br.edu.ifpr.fincontrol.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public UserResponse create(UserRequest request) {

        User user = toEntity(request);

        user = repository.save(user);

        return toResponse(user);

    }

    public List<UserResponse> findAll() {

        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();

    }

    public UserResponse findById(Long id) {

        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        return toResponse(user);

    }

    public UserResponse update(Long id, UserRequest request) {

        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user = repository.save(user);

        return toResponse(user);

    }

    public void delete(Long id) {

        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        passwordResetTokenRepository.deleteByUserId(id);

        repository.delete(user);

    }

    public void changePassword(Long userId, ChangePasswordRequest request) {

        User user = repository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException("A senha atual está incorreta.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        repository.save(user);

    }

    private User toEntity(UserRequest request) {

        return User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

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
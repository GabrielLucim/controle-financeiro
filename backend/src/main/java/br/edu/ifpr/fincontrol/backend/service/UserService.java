package br.edu.ifpr.fincontrol.backend.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ifpr.fincontrol.backend.dto.request.ChangePasswordRequest;
import br.edu.ifpr.fincontrol.backend.dto.request.UpdateUserRequest;
import br.edu.ifpr.fincontrol.backend.dto.request.UserRequest;
import br.edu.ifpr.fincontrol.backend.dto.response.UserResponse;
import br.edu.ifpr.fincontrol.backend.entity.User;
import br.edu.ifpr.fincontrol.backend.exception.BusinessException;
import br.edu.ifpr.fincontrol.backend.exception.ForbiddenException;
import br.edu.ifpr.fincontrol.backend.exception.ResourceNotFoundException;
import br.edu.ifpr.fincontrol.backend.repository.PasswordResetTokenRepository;
import br.edu.ifpr.fincontrol.backend.repository.UserRepository;
import br.edu.ifpr.fincontrol.backend.repository.WalletRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final WalletRepository walletRepository;

    @Transactional
    public UserResponse create(UserRequest request) {

        if (repository.existsByEmail(request.getEmail())) {
            throw new BusinessException(
                    "Já existe um usuário cadastrado com este e-mail.");
        }

        User user = toEntity(request);

        user = repository.save(user);

        return toResponse(user);
    }

    public List<UserResponse> findAll() {

        throw new ForbiddenException(
                "A listagem global de usuários não está disponível.");
    }

    @Transactional(readOnly = true)
    public UserResponse findById(Long id, Long requesterId) {

        ensureOwnAccount(id, requesterId);

        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuário não encontrado."));

        return toResponse(user);
    }

    @Transactional
    public UserResponse update(
            Long id,
            Long requesterId,
            UpdateUserRequest request) {

        ensureOwnAccount(id, requesterId);

        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuário não encontrado."));

        String newEmail = request.getEmail().trim();

        boolean emailChanged = !user.getEmail().equalsIgnoreCase(newEmail);

        if (emailChanged && repository.existsByEmail(newEmail)) {
            throw new BusinessException(
                    "Já existe um usuário cadastrado com este e-mail.");
        }

        user.setName(request.getName().trim());
        user.setEmail(newEmail);

        user = repository.save(user);

        return toResponse(user);
    }

    @Transactional
    public void delete(Long id, Long requesterId) {

        ensureOwnAccount(id, requesterId);

        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuário não encontrado."));

        if (walletRepository.existsByOwnerId(id)) {
            throw new BusinessException(
                    "Não é possível excluir a conta enquanto ela possuir carteiras. "
                            + "Exclua ou transfira as carteiras antes de continuar.");
        }

        passwordResetTokenRepository.deleteByUserId(id);

        repository.delete(user);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {

        User user = repository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuário não encontrado."));

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new BusinessException("A senha atual está incorreta.");
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        repository.save(user);
    }

    private void ensureOwnAccount(Long requestedUserId, Long requesterId) {

        if (requesterId == null || !requesterId.equals(requestedUserId)) {
            throw new ResourceNotFoundException("Usuário não encontrado.");
        }
    }

    private User toEntity(UserRequest request) {

        return User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim())
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
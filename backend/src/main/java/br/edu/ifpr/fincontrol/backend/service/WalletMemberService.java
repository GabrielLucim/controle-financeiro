package br.edu.ifpr.fincontrol.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ifpr.fincontrol.backend.dto.request.AddWalletMemberRequest;
import br.edu.ifpr.fincontrol.backend.dto.request.UpdateWalletMemberRequest;
import br.edu.ifpr.fincontrol.backend.dto.response.WalletMemberResponse;
import br.edu.ifpr.fincontrol.backend.entity.User;
import br.edu.ifpr.fincontrol.backend.entity.Wallet;
import br.edu.ifpr.fincontrol.backend.entity.WalletMember;
import br.edu.ifpr.fincontrol.backend.entity.enums.WalletRole;
import br.edu.ifpr.fincontrol.backend.exception.BusinessException;
import br.edu.ifpr.fincontrol.backend.exception.ResourceNotFoundException;
import br.edu.ifpr.fincontrol.backend.repository.UserRepository;
import br.edu.ifpr.fincontrol.backend.repository.WalletMemberRepository;
import br.edu.ifpr.fincontrol.backend.repository.WalletRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WalletMemberService {

    private final WalletMemberRepository walletMemberRepository;
    private final WalletRepository walletRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<WalletMemberResponse> findAll(Long walletId, Long currentUserId) {

        Wallet wallet = findWallet(walletId);

        ensureMember(wallet, currentUserId);

        List<WalletMemberResponse> members = walletMemberRepository.findByWalletId(wallet.getId())
                .stream()
                .map(this::toResponse)
                .collect(java.util.stream.Collectors.toList());

        boolean ownerAlreadyListed = members.stream()
                .anyMatch(member -> member.getUserId().equals(wallet.getOwner().getId()));

        if (!ownerAlreadyListed) {

            User owner = wallet.getOwner();

            members.add(
                    0,
                    WalletMemberResponse.builder()
                            .userId(owner.getId())
                            .name(owner.getName())
                            .email(owner.getEmail())
                            .role(WalletRole.DONO)
                            .build());
        }

        return members;
    }

    @Transactional
    public WalletMemberResponse add(
            Long walletId,
            AddWalletMemberRequest request,
            Long currentUserId) {

        Wallet wallet = findWallet(walletId);

        ensureOwner(wallet, currentUserId);

        if (request.getRole() == WalletRole.DONO) {
            throw new BusinessException(
                    "Não é possível adicionar outro dono à carteira.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuário não encontrado."));

        if (walletMemberRepository.existsByWalletIdAndUserId(
                walletId,
                user.getId())) {

            throw new BusinessException(
                    "O usuário já participa desta carteira.");
        }

        WalletMember member = WalletMember.builder()
                .wallet(wallet)
                .user(user)
                .role(request.getRole())
                .build();

        return toResponse(walletMemberRepository.save(member));
    }

    @Transactional
    public WalletMemberResponse update(
            Long walletId,
            Long userId,
            UpdateWalletMemberRequest request,
            Long currentUserId) {

        Wallet wallet = findWallet(walletId);

        ensureOwner(wallet, currentUserId);

        if (userId.equals(wallet.getOwner().getId())) {
            throw new BusinessException(
                    "O dono da carteira não pode ter o papel alterado.");
        }

        if (request.getRole() == WalletRole.DONO) {
            throw new BusinessException(
                    "Não é possível transferir o papel de dono por esta operação.");
        }

        WalletMember member = walletMemberRepository
                .findByWalletIdAndUserId(walletId, userId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Membro não encontrado na carteira."));

        member.setRole(request.getRole());

        return toResponse(walletMemberRepository.save(member));
    }

    @Transactional
    public void remove(
            Long walletId,
            Long userId,
            Long currentUserId) {

        Wallet wallet = findWallet(walletId);

        ensureOwner(wallet, currentUserId);

        if (userId.equals(wallet.getOwner().getId())) {
            throw new BusinessException(
                    "O dono da carteira não pode ser removido.");
        }

        WalletMember member = walletMemberRepository
                .findByWalletIdAndUserId(walletId, userId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Membro não encontrado na carteira."));

        walletMemberRepository.delete(member);
    }

    @Transactional(readOnly = true)
    public WalletRole getUserRole(Long walletId, Long userId) {

        Wallet wallet = findWallet(walletId);

        if (wallet.getOwner().getId().equals(userId)) {
            return WalletRole.DONO;
        }

        return walletMemberRepository
                .findByWalletIdAndUserId(walletId, userId)
                .map(WalletMember::getRole)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Carteira não encontrada."));
    }

    private Wallet findWallet(Long walletId) {

        return walletRepository.findById(walletId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Carteira não encontrada."));
    }

    private void ensureOwner(Wallet wallet, Long userId) {

        if (!wallet.getOwner().getId().equals(userId)) {
            throw new ResourceNotFoundException(
                    "Carteira não encontrada.");
        }
    }

    private void ensureMember(Wallet wallet, Long userId) {

        boolean isOwner = wallet.getOwner().getId().equals(userId);

        boolean isMember = walletMemberRepository.existsByWalletIdAndUserId(
                wallet.getId(),
                userId);

        if (!isOwner && !isMember) {
            throw new ResourceNotFoundException(
                    "Carteira não encontrada.");
        }
    }

    private WalletMemberResponse toResponse(WalletMember member) {

        return WalletMemberResponse.builder()
                .userId(member.getUser().getId())
                .name(member.getUser().getName())
                .email(member.getUser().getEmail())
                .role(member.getRole())
                .build();
    }
}
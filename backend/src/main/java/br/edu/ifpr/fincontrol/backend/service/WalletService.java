package br.edu.ifpr.fincontrol.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import br.edu.ifpr.fincontrol.backend.dto.request.WalletRequest;
import br.edu.ifpr.fincontrol.backend.dto.response.WalletResponse;
import br.edu.ifpr.fincontrol.backend.entity.User;
import br.edu.ifpr.fincontrol.backend.entity.Wallet;
import br.edu.ifpr.fincontrol.backend.exception.ResourceNotFoundException;
import br.edu.ifpr.fincontrol.backend.repository.UserRepository;
import br.edu.ifpr.fincontrol.backend.repository.WalletRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final UserRepository userRepository;

    public WalletResponse create(WalletRequest request, Long userId) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        Wallet wallet = Wallet.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(owner)
                .build();

        walletRepository.save(wallet);

        return toResponse(wallet);
    }

    public List<WalletResponse> findAllByUserId(Long userId) {
        List<Wallet> wallets = walletRepository.findByOwnerId(userId);
        return wallets.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public WalletResponse findById(Long id, Long userId) {
        Wallet wallet = walletRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carteira não encontrada."));

        if (!wallet.getOwner().getId().equals(userId)) {
            throw new ResourceNotFoundException("Carteira não encontrada.");
        }

        return toResponse(wallet);
    }

    public WalletResponse update(Long id, WalletRequest request, Long userId) {
        Wallet wallet = walletRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carteira não encontrada."));

        if (!wallet.getOwner().getId().equals(userId)) {
            throw new ResourceNotFoundException("Carteira não encontrada.");
        }

        wallet.setName(request.getName());
        wallet.setDescription(request.getDescription());

        walletRepository.save(wallet);

        return toResponse(wallet);
    }

    public void delete(Long id, Long userId) {
        Wallet wallet = walletRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carteira não encontrada."));

        if (!wallet.getOwner().getId().equals(userId)) {
            throw new ResourceNotFoundException("Carteira não encontrada.");
        }

        walletRepository.delete(wallet);
    }

    private WalletResponse toResponse(Wallet wallet) {
        return WalletResponse.builder()
                .id(wallet.getId())
                .name(wallet.getName())
                .description(wallet.getDescription())
                .build();
    }
}
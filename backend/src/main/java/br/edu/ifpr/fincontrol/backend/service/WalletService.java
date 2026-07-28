package br.edu.ifpr.fincontrol.backend.service;

import java.util.List;

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

    private final WalletRepository repository;
    private final UserRepository userRepository;

    public WalletResponse create(WalletRequest request) {

        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        Wallet wallet = Wallet.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(owner)
                .build();

        repository.save(wallet);

        return toResponse(wallet);

    }

    public List<WalletResponse> findAll() {

        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();

    }

    public WalletResponse findById(Long id) {

        Wallet wallet = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carteira não encontrada."));

        return toResponse(wallet);

    }

    public WalletResponse update(Long id, WalletRequest request) {

        Wallet wallet = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carteira não encontrada."));

        wallet.setName(request.getName());
        wallet.setDescription(request.getDescription());

        repository.save(wallet);

        return toResponse(wallet);

    }

    public void delete(Long id) {

        Wallet wallet = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carteira não encontrada."));

        repository.delete(wallet);

    }

    private WalletResponse toResponse(Wallet wallet) {

        return WalletResponse.builder()
                .id(wallet.getId())
                .name(wallet.getName())
                .description(wallet.getDescription())
                .ownerId(wallet.getOwner().getId())
                .ownerName(wallet.getOwner().getName())
                .createdAt(wallet.getCreatedAt())
                .updatedAt(wallet.getUpdatedAt())
                .build();

    }

}
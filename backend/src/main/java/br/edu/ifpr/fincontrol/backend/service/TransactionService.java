package br.edu.ifpr.fincontrol.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ifpr.fincontrol.backend.dto.request.TransactionRequest;
import br.edu.ifpr.fincontrol.backend.dto.response.TransactionResponse;
import br.edu.ifpr.fincontrol.backend.entity.Category;
import br.edu.ifpr.fincontrol.backend.entity.Transaction;
import br.edu.ifpr.fincontrol.backend.entity.Wallet;
import br.edu.ifpr.fincontrol.backend.exception.ResourceNotFoundException;
import br.edu.ifpr.fincontrol.backend.repository.CategoryRepository;
import br.edu.ifpr.fincontrol.backend.repository.TransactionRepository;
import br.edu.ifpr.fincontrol.backend.repository.WalletRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository repository;
    private final WalletRepository walletRepository;
    private final CategoryRepository categoryRepository;

    public TransactionResponse create(TransactionRequest request) {

        Wallet wallet = walletRepository.findById(request.getWalletId())
                .orElseThrow(() -> new ResourceNotFoundException("Carteira não encontrada."));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));

        Transaction transaction = Transaction.builder()
                .description(request.getDescription())
                .amount(request.getAmount())
                .date(request.getDate())
                .type(request.getType())
                .wallet(wallet)
                .category(category)
                .build();

        repository.save(transaction);

        return toResponse(transaction);

    }

    public List<TransactionResponse> findAll() {

        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();

    }

    public TransactionResponse findById(Long id) {

        Transaction transaction = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transação não encontrada."));

        return toResponse(transaction);

    }

    public TransactionResponse update(Long id, TransactionRequest request) {

        Transaction transaction = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transação não encontrada."));

        Wallet wallet = walletRepository.findById(request.getWalletId())
                .orElseThrow(() -> new ResourceNotFoundException("Carteira não encontrada."));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));

        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setDate(request.getDate());
        transaction.setType(request.getType());
        transaction.setWallet(wallet);
        transaction.setCategory(category);

        repository.save(transaction);

        return toResponse(transaction);

    }

    public void delete(Long id) {

        Transaction transaction = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transação não encontrada."));

        repository.delete(transaction);

    }

    private TransactionResponse toResponse(Transaction transaction) {

        return TransactionResponse.builder()
                .id(transaction.getId())
                .description(transaction.getDescription())
                .amount(transaction.getAmount())
                .date(transaction.getDate())
                .type(transaction.getType())
                .walletId(transaction.getWallet().getId())
                .walletName(transaction.getWallet().getName())
                .categoryId(transaction.getCategory().getId())
                .categoryName(transaction.getCategory().getName())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();

    }

}
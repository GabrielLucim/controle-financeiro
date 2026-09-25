package br.edu.ifpr.fincontrol.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ifpr.fincontrol.backend.dto.request.TransactionRequest;
import br.edu.ifpr.fincontrol.backend.dto.response.TransactionResponse;
import br.edu.ifpr.fincontrol.backend.entity.Category;
import br.edu.ifpr.fincontrol.backend.entity.Transaction;
import br.edu.ifpr.fincontrol.backend.entity.Wallet;
import br.edu.ifpr.fincontrol.backend.entity.enums.WalletRole;
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
        private final WalletMemberService walletMemberService;

        public TransactionResponse create(TransactionRequest request, Long userId) {

                Wallet wallet = walletRepository.findById(request.getWalletId())
                                .orElseThrow(() -> new ResourceNotFoundException("Carteira não encontrada."));

                WalletRole role = walletMemberService.getUserRole(wallet.getId(), userId);

                if (role == WalletRole.VISUALIZADOR) {
                        throw new IllegalStateException(
                                        "Usuário sem permissão para criar transações nesta carteira.");
                }

                Category category = categoryRepository.findById(request.getCategoryId())
                                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));

                if (!category.getOwner().getId().equals(userId)) {
                        throw new ResourceNotFoundException("Categoria não encontrada.");
                }

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

        public List<TransactionResponse> findAllByUserId(Long userId) {

                return repository.findDistinctByWalletOwnerIdOrWalletMembersUserId(userId, userId)
                                .stream()
                                .map(this::toResponse)
                                .toList();
        }

        public TransactionResponse findById(Long id, Long userId) {

                Transaction transaction = repository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Transação não encontrada."));

                walletMemberService.getUserRole(
                                transaction.getWallet().getId(),
                                userId);

                return toResponse(transaction);
        }

        public TransactionResponse update(
                        Long id,
                        TransactionRequest request,
                        Long userId) {

                Transaction transaction = repository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Transação não encontrada."));

                WalletRole role = walletMemberService.getUserRole(
                                transaction.getWallet().getId(),
                                userId);

                if (role == WalletRole.VISUALIZADOR) {
                        throw new IllegalStateException(
                                        "Usuário sem permissão para editar transações nesta carteira.");
                }

                Wallet wallet = walletRepository.findById(request.getWalletId())
                                .orElseThrow(() -> new ResourceNotFoundException("Carteira não encontrada."));

                WalletRole newWalletRole = walletMemberService.getUserRole(
                                wallet.getId(),
                                userId);

                if (newWalletRole == WalletRole.VISUALIZADOR) {
                        throw new IllegalStateException(
                                        "Usuário sem permissão para utilizar esta carteira.");
                }

                Category category = categoryRepository.findById(request.getCategoryId())
                                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));

                if (!category.getOwner().getId().equals(userId)) {
                        throw new ResourceNotFoundException("Categoria não encontrada.");
                }

                transaction.setDescription(request.getDescription());
                transaction.setAmount(request.getAmount());
                transaction.setDate(request.getDate());
                transaction.setType(request.getType());
                transaction.setWallet(wallet);
                transaction.setCategory(category);

                repository.save(transaction);

                return toResponse(transaction);
        }

        public void delete(Long id, Long userId) {

                Transaction transaction = repository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Transação não encontrada."));

                WalletRole role = walletMemberService.getUserRole(
                                transaction.getWallet().getId(),
                                userId);

                if (role != WalletRole.DONO) {
                        throw new IllegalStateException(
                                        "Apenas o dono da carteira pode excluir transações.");
                }

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
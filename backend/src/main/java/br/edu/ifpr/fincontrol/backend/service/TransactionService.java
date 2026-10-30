package br.edu.ifpr.fincontrol.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ifpr.fincontrol.backend.dto.request.TransactionRequest;
import br.edu.ifpr.fincontrol.backend.dto.response.TransactionResponse;
import br.edu.ifpr.fincontrol.backend.entity.Category;
import br.edu.ifpr.fincontrol.backend.entity.Transaction;
import br.edu.ifpr.fincontrol.backend.entity.Wallet;
import br.edu.ifpr.fincontrol.backend.entity.enums.WalletRole;
import br.edu.ifpr.fincontrol.backend.exception.ForbiddenException;
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
        private final TransactionEventsService transactionEventsService;

        public TransactionResponse create(TransactionRequest request, Long userId) {

                Wallet wallet = walletRepository.findById(request.getWalletId())
                                .orElseThrow(
                                                () -> new ResourceNotFoundException("Carteira não encontrada."));

                WalletRole role = walletMemberService.getUserRole(wallet.getId(), userId);

                if (role == WalletRole.VISUALIZADOR) {
                        throw new ForbiddenException(
                                        "Usuário sem permissão para criar transações nesta carteira.");
                }

                Category category = findCategoryForWallet(
                                request.getCategoryId(),
                                wallet,
                                null,
                                false);

                Transaction transaction = Transaction.builder()
                                .description(request.getDescription())
                                .amount(request.getAmount())
                                .date(request.getDate())
                                .type(request.getType())
                                .wallet(wallet)
                                .category(category)
                                .build();

                repository.save(transaction);

                notifyWalletMembers(wallet.getId(), userId, "created");

                return toResponse(transaction);
        }

        public List<TransactionResponse> findAllByUserId(Long userId) {

                return repository
                                .findDistinctByWalletOwnerIdOrWalletMembersUserId(userId, userId)
                                .stream()
                                .map(this::toResponse)
                                .toList();
        }

        public TransactionResponse findById(Long id, Long userId) {

                Transaction transaction = repository.findById(id)
                                .orElseThrow(
                                                () -> new ResourceNotFoundException("Transação não encontrada."));

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
                                .orElseThrow(
                                                () -> new ResourceNotFoundException("Transação não encontrada."));

                Wallet oldWallet = transaction.getWallet();

                WalletRole role = walletMemberService.getUserRole(
                                oldWallet.getId(),
                                userId);

                if (role == WalletRole.VISUALIZADOR) {
                        throw new ForbiddenException(
                                        "Usuário sem permissão para editar transações nesta carteira.");
                }

                Wallet wallet = walletRepository.findById(request.getWalletId())
                                .orElseThrow(
                                                () -> new ResourceNotFoundException("Carteira não encontrada."));

                WalletRole newWalletRole = walletMemberService.getUserRole(
                                wallet.getId(),
                                userId);

                if (newWalletRole == WalletRole.VISUALIZADOR) {
                        throw new ForbiddenException(
                                        "Usuário sem permissão para utilizar esta carteira.");
                }

                boolean sameWallet = oldWallet.getId().equals(wallet.getId());

                Category category = findCategoryForWallet(
                                request.getCategoryId(),
                                wallet,
                                transaction.getCategory().getId(),
                                sameWallet);

                transaction.setDescription(request.getDescription());
                transaction.setAmount(request.getAmount());
                transaction.setDate(request.getDate());
                transaction.setType(request.getType());
                transaction.setWallet(wallet);
                transaction.setCategory(category);

                repository.save(transaction);

                notifyWalletMembers(oldWallet.getId(), userId, "updated");

                if (!sameWallet) {
                        notifyWalletMembers(wallet.getId(), userId, "updated");
                }

                return toResponse(transaction);
        }

        public void delete(Long id, Long userId) {

                Transaction transaction = repository.findById(id)
                                .orElseThrow(
                                                () -> new ResourceNotFoundException("Transação não encontrada."));

                Long walletId = transaction.getWallet().getId();

                WalletRole role = walletMemberService.getUserRole(
                                walletId,
                                userId);

                if (role != WalletRole.DONO) {
                        throw new ForbiddenException(
                                        "Apenas o dono da carteira pode excluir transações.");
                }

                repository.delete(transaction);

                notifyWalletMembers(walletId, userId, "deleted");
        }

        private void notifyWalletMembers(Long walletId, Long currentUserId, String action) {

                walletMemberService.findAll(walletId, currentUserId)
                                .forEach(member -> transactionEventsService.notifyUser(
                                                member.getUserId(),
                                                action));
        }

        private Category findCategoryForWallet(
                        Long categoryId,
                        Wallet wallet,
                        Long existingCategoryId,
                        boolean allowKeepingExistingCategory) {

                Category category = categoryRepository.findById(categoryId)
                                .orElseThrow(
                                                () -> new ResourceNotFoundException("Categoria não encontrada."));

                try {
                        walletMemberService.getUserRole(
                                        wallet.getId(),
                                        category.getOwner().getId());
                } catch (ResourceNotFoundException exception) {

                        boolean keepingExistingCategory = allowKeepingExistingCategory
                                        && existingCategoryId != null
                                        && existingCategoryId.equals(category.getId());

                        if (!keepingExistingCategory) {
                                throw new ResourceNotFoundException("Categoria não encontrada.");
                        }
                }

                return category;
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
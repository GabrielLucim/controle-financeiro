package br.edu.ifpr.fincontrol.backend.service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ifpr.fincontrol.backend.dto.request.CategoryRequest;
import br.edu.ifpr.fincontrol.backend.dto.response.CategoryResponse;
import br.edu.ifpr.fincontrol.backend.entity.Category;
import br.edu.ifpr.fincontrol.backend.entity.User;
import br.edu.ifpr.fincontrol.backend.entity.Wallet;
import br.edu.ifpr.fincontrol.backend.exception.ResourceNotFoundException;
import br.edu.ifpr.fincontrol.backend.repository.CategoryRepository;
import br.edu.ifpr.fincontrol.backend.repository.UserRepository;
import br.edu.ifpr.fincontrol.backend.repository.WalletMemberRepository;
import br.edu.ifpr.fincontrol.backend.repository.WalletRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository repository;
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final WalletMemberRepository walletMemberRepository;
    private final WalletMemberService walletMemberService;

    public CategoryResponse create(CategoryRequest request, Long userId) {

        User owner = userRepository.findById(userId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Usuário não encontrado."));

        Category category = Category.builder()
                .name(request.getName())
                .owner(owner)
                .build();

        category = repository.save(category);

        return toResponse(category);
    }

    public List<CategoryResponse> findAllByUserId(Long userId) {

        return repository.findByOwnerId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> findAllByWalletId(Long walletId, Long userId) {

        walletMemberService.getUserRole(walletId, userId);

        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Carteira não encontrada."));

        Set<Long> ownerIds = new LinkedHashSet<>();

        ownerIds.add(wallet.getOwner().getId());

        walletMemberRepository.findByWalletId(walletId)
                .stream()
                .map(member -> member.getUser().getId())
                .forEach(ownerIds::add);

        return repository.findByOwnerIdIn(new ArrayList<>(ownerIds))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponse findById(Long id, Long userId) {

        Category category = repository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Categoria não encontrada."));

        if (!category.getOwner().getId().equals(userId)) {
            throw new ResourceNotFoundException("Categoria não encontrada.");
        }

        return toResponse(category);
    }

    public CategoryResponse update(
            Long id,
            CategoryRequest request,
            Long userId) {

        Category category = repository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Categoria não encontrada."));

        if (!category.getOwner().getId().equals(userId)) {
            throw new ResourceNotFoundException("Categoria não encontrada.");
        }

        category.setName(request.getName());

        category = repository.save(category);

        return toResponse(category);
    }

    public void delete(Long id, Long userId) {

        Category category = repository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Categoria não encontrada."));

        if (!category.getOwner().getId().equals(userId)) {
            throw new ResourceNotFoundException("Categoria não encontrada.");
        }

        repository.delete(category);
    }

    private CategoryResponse toResponse(Category category) {

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}
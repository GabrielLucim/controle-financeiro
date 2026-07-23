package br.edu.ifpr.fincontrol.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ifpr.fincontrol.backend.dto.request.CategoryRequest;
import br.edu.ifpr.fincontrol.backend.dto.response.CategoryResponse;
import br.edu.ifpr.fincontrol.backend.entity.Category;
import br.edu.ifpr.fincontrol.backend.exception.ResourceNotFoundException;
import br.edu.ifpr.fincontrol.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository repository;

    public CategoryResponse create(CategoryRequest request) {

        Category category = toEntity(request);

        category = repository.save(category);

        return toResponse(category);

    }

    public List<CategoryResponse> findAll() {

        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();

    }

    public CategoryResponse findById(Long id) {

        Category category = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));

        return toResponse(category);

    }

    public CategoryResponse update(Long id, CategoryRequest request) {

        Category category = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));

        category.setName(request.getName());
        category.setType(request.getType());

        category = repository.save(category);

        return toResponse(category);

    }

    public void delete(Long id) {

        Category category = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));

        repository.delete(category);

    }

    private Category toEntity(CategoryRequest request) {

        return Category.builder()
                .name(request.getName())
                .type(request.getType())
                .build();

    }

    private CategoryResponse toResponse(Category category) {

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .type(category.getType())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();

    }

}
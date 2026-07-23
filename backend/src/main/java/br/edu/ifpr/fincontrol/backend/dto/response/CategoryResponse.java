package br.edu.ifpr.fincontrol.backend.dto.response;

import java.time.LocalDateTime;

import br.edu.ifpr.fincontrol.backend.entity.enums.CategoryType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {

    private Long id;

    private String name;

    private CategoryType type;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
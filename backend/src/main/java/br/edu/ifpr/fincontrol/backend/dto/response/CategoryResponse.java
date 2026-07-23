package br.edu.ifpr.fincontrol.backend.dto.response;

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

}
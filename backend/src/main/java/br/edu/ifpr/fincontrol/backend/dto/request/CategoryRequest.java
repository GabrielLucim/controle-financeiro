package br.edu.ifpr.fincontrol.backend.dto.request;

import br.edu.ifpr.fincontrol.backend.entity.enums.CategoryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryRequest {

    @NotBlank(message = "O nome da categoria é obrigatório.")
    @Size(max = 80, message = "O nome deve possuir no máximo 80 caracteres.")
    private String name;

    @NotNull(message = "O tipo da categoria é obrigatório.")
    private CategoryType type;

}
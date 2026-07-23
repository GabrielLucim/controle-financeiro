package br.edu.ifpr.fincontrol.backend.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletRequest {

    @NotBlank(message = "O nome da carteira é obrigatório.")
    @Size(max = 100, message = "O nome deve possuir no máximo 100 caracteres.")
    private String name;

    @Size(max = 255, message = "A descrição deve possuir no máximo 255 caracteres.")
    private String description;

    @Min(value = 1, message = "A carteira deve possuir pelo menos 1 membro.")
    @Max(value = 99, message = "Número máximo de membros excedido.")
    private Integer members;

}
package br.edu.ifpr.fincontrol.backend.dto.request.ai;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinancialAnalysisRequest {

    @NotNull(message = "A carteira é obrigatória.")
    @Positive(message = "A carteira informada é inválida.")
    private Long walletId;

    @NotNull(message = "O ano é obrigatório.")
    @Min(value = 1, message = "O ano deve ser maior que zero.")
    @Max(value = 9999, message = "O ano informado é inválido.")
    private Integer year;

    @NotNull(message = "O mês é obrigatório.")
    @Min(value = 1, message = "O mês deve estar entre 1 e 12.")
    @Max(value = 12, message = "O mês deve estar entre 1 e 12.")
    private Integer month;

}

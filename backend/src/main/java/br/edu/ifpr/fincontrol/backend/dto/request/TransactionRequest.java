package br.edu.ifpr.fincontrol.backend.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

import br.edu.ifpr.fincontrol.backend.entity.enums.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionRequest {

    @NotBlank(message = "A descrição é obrigatória.")
    @Size(max = 150, message = "A descrição deve possuir no máximo 150 caracteres.")
    private String description;

    @NotNull(message = "O valor é obrigatório.")
    @DecimalMin(value = "0.01", message = "O valor deve ser maior que zero.")
    private BigDecimal amount;

    @NotNull(message = "A data é obrigatória.")
    @PastOrPresent(message = "A data não pode ser futura.")
    private LocalDate date;

    @NotNull(message = "O tipo da transação é obrigatório.")
    private TransactionType type;

    @NotNull(message = "A carteira é obrigatória.")
    private Long walletId;

    @NotNull(message = "A categoria é obrigatória.")
    private Long categoryId;

}
package br.edu.ifpr.fincontrol.backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import br.edu.ifpr.fincontrol.backend.entity.enums.TransactionType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {

    private Long id;

    private String description;

    private BigDecimal amount;

    private LocalDate date;

    private TransactionType type;

    private Long walletId;

    private String walletName;

    private Long categoryId;

    private String categoryName;

    private LocalDateTime createdAt;

}
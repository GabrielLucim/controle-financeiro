package br.edu.ifpr.fincontrol.backend.dto.response.dashboard;

import java.math.BigDecimal;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SummaryResponse {

    private BigDecimal balance;

    private BigDecimal income;

    private BigDecimal expense;

}
package br.edu.ifpr.fincontrol.backend.dto.response.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinancialAnalysisResponse {

    private Long walletId;

    private String walletName;

    private Integer year;

    private Integer month;

    private String analysis;

}

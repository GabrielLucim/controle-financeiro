
package br.edu.ifpr.fincontrol.backend.dto.response.report;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import br.edu.ifpr.fincontrol.backend.dto.response.TransactionResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyReportResponse {

    private Long walletId;

    private String walletName;

    private Integer year;

    private Integer month;

    private LocalDate periodStart;

    private LocalDate periodEnd;

    private BigDecimal totalIncome;

    private BigDecimal totalExpense;

    private BigDecimal balance;

    private Integer transactionCount;

    private List<CategoryReportResponse> categoryTotals;

    private List<TransactionResponse> transactions;

}


package br.edu.ifpr.fincontrol.backend.dto.response.report;

import java.math.BigDecimal;

import br.edu.ifpr.fincontrol.backend.entity.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryReportResponse {

    private Long categoryId;

    private String categoryName;

    private TransactionType type;

    private BigDecimal totalAmount;

    private Integer transactionCount;

}

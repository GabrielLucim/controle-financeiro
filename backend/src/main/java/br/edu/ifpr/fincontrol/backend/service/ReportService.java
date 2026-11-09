
package br.edu.ifpr.fincontrol.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ifpr.fincontrol.backend.dto.response.TransactionResponse;
import br.edu.ifpr.fincontrol.backend.dto.response.WalletResponse;
import br.edu.ifpr.fincontrol.backend.dto.response.report.CategoryReportResponse;
import br.edu.ifpr.fincontrol.backend.dto.response.report.MonthlyReportResponse;
import br.edu.ifpr.fincontrol.backend.entity.Transaction;
import br.edu.ifpr.fincontrol.backend.entity.enums.TransactionType;
import br.edu.ifpr.fincontrol.backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final TransactionRepository transactionRepository;
    private final WalletService walletService;

    @Transactional(readOnly = true)
    public MonthlyReportResponse getMonthlyReport(
            Long walletId,
            Integer year,
            Integer month,
            Long userId) {

        WalletResponse wallet = walletService.findById(walletId, userId);

        YearMonth referenceMonth = YearMonth.of(year, month);

        LocalDate periodStart = referenceMonth.atDay(1);
        LocalDate periodEnd = referenceMonth.atEndOfMonth();

        List<Transaction> transactions = transactionRepository
                .findByWalletIdAndDateBetweenOrderByDateDesc(
                        walletId,
                        periodStart,
                        periodEnd);

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        Map<CategoryKey, CategoryAccumulator> categories = new LinkedHashMap<>();

        for (Transaction transaction : transactions) {

            BigDecimal amount = transaction.getAmount();

            if (transaction.getType() == TransactionType.INCOME) {
                totalIncome = totalIncome.add(amount);
            } else {
                totalExpense = totalExpense.add(amount);
            }

            CategoryKey key = new CategoryKey(
                    transaction.getCategory().getId(),
                    transaction.getType());

            CategoryAccumulator accumulator = categories.computeIfAbsent(
                    key,
                    ignored -> new CategoryAccumulator(
                            transaction.getCategory().getId(),
                            transaction.getCategory().getName(),
                            transaction.getType()));

            accumulator.add(amount);
        }

        List<CategoryReportResponse> categoryTotals = categories.values()
                .stream()
                .map(CategoryAccumulator::toResponse)
                .sorted(
                        Comparator.comparing(
                                CategoryReportResponse::getTotalAmount)
                                .reversed())
                .toList();

        List<TransactionResponse> transactionResponses = transactions
                .stream()
                .map(this::toResponse)
                .toList();

        return MonthlyReportResponse.builder()
                .walletId(wallet.getId())
                .walletName(wallet.getName())
                .year(year)
                .month(month)
                .periodStart(periodStart)
                .periodEnd(periodEnd)
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .balance(totalIncome.subtract(totalExpense))
                .transactionCount(transactions.size())
                .categoryTotals(categoryTotals)
                .transactions(transactionResponses)
                .build();
    }

    private TransactionResponse toResponse(Transaction transaction) {

        return TransactionResponse.builder()
                .id(transaction.getId())
                .description(transaction.getDescription())
                .amount(transaction.getAmount())
                .date(transaction.getDate())
                .type(transaction.getType())
                .walletId(transaction.getWallet().getId())
                .walletName(transaction.getWallet().getName())
                .categoryId(transaction.getCategory().getId())
                .categoryName(transaction.getCategory().getName())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }

    private record CategoryKey(
            Long categoryId,
            TransactionType type) {
    }

    private static class CategoryAccumulator {

        private final Long categoryId;

        private final String categoryName;

        private final TransactionType type;

        private BigDecimal totalAmount = BigDecimal.ZERO;

        private Integer transactionCount = 0;

        private CategoryAccumulator(
                Long categoryId,
                String categoryName,
                TransactionType type) {

            this.categoryId = categoryId;
            this.categoryName = categoryName;
            this.type = type;
        }

        private void add(BigDecimal amount) {

            totalAmount = totalAmount.add(amount);
            transactionCount++;
        }

        private CategoryReportResponse toResponse() {

            return CategoryReportResponse.builder()
                    .categoryId(categoryId)
                    .categoryName(categoryName)
                    .type(type)
                    .totalAmount(totalAmount)
                    .transactionCount(transactionCount)
                    .build();
        }
    }
}

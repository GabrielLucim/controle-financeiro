package br.edu.ifpr.fincontrol.backend.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import br.edu.ifpr.fincontrol.backend.dto.response.dashboard.DashboardResponse;
import br.edu.ifpr.fincontrol.backend.dto.response.dashboard.SummaryResponse;
import br.edu.ifpr.fincontrol.backend.dto.response.dashboard.WalletDashboardResponse;
import br.edu.ifpr.fincontrol.backend.entity.Transaction;
import br.edu.ifpr.fincontrol.backend.entity.Wallet;
import br.edu.ifpr.fincontrol.backend.entity.enums.TransactionType;
import br.edu.ifpr.fincontrol.backend.repository.TransactionRepository;
import br.edu.ifpr.fincontrol.backend.repository.WalletRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    public DashboardResponse getDashboard() {

        List<Wallet> wallets = walletRepository.findAll();

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        List<WalletDashboardResponse> walletResponses = new ArrayList<>();

        for (Wallet wallet : wallets) {

            List<Transaction> transactions = transactionRepository.findByWalletId(wallet.getId());

            BigDecimal income = BigDecimal.ZERO;
            BigDecimal expense = BigDecimal.ZERO;

            for (Transaction transaction : transactions) {

                if (transaction.getType() == TransactionType.INCOME) {

                    income = income.add(transaction.getAmount());

                } else {

                    expense = expense.add(transaction.getAmount());

                }

            }

            BigDecimal balance = income.subtract(expense);

            totalIncome = totalIncome.add(income);
            totalExpense = totalExpense.add(expense);

            walletResponses.add(

                    WalletDashboardResponse.builder()
                            .id(wallet.getId())
                            .name(wallet.getName())
                            .description(wallet.getDescription())
                            .balance(balance)
                            .build()

            );

        }

        SummaryResponse summary = SummaryResponse.builder()
                .income(totalIncome)
                .expense(totalExpense)
                .balance(totalIncome.subtract(totalExpense))
                .build();

        return DashboardResponse.builder()
                .summary(summary)
                .wallets(walletResponses)
                .build();

    }

}
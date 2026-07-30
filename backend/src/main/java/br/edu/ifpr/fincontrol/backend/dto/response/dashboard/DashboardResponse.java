package br.edu.ifpr.fincontrol.backend.dto.response.dashboard;

import java.util.List;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private SummaryResponse summary;

    private List<WalletDashboardResponse> wallets;

}
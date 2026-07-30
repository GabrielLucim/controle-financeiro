package br.edu.ifpr.fincontrol.backend.dto.response.dashboard;

import java.math.BigDecimal;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletDashboardResponse {

    private Long id;

    private String name;

    private String description;

    private BigDecimal balance;

}
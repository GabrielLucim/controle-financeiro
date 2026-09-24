package br.edu.ifpr.fincontrol.backend.dto.response;

import br.edu.ifpr.fincontrol.backend.entity.enums.WalletRole;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletMemberResponse {

    private Long userId;

    private String name;

    private String email;

    private WalletRole role;
}
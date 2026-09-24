package br.edu.ifpr.fincontrol.backend.dto.request;

import br.edu.ifpr.fincontrol.backend.entity.enums.WalletRole;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateWalletMemberRequest {

    @NotNull(message = "O papel do membro é obrigatório.")
    private WalletRole role;
}
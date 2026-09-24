package br.edu.ifpr.fincontrol.backend.dto.request;

import br.edu.ifpr.fincontrol.backend.entity.enums.WalletRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddWalletMemberRequest {

    @NotBlank(message = "O e-mail do usuário é obrigatório.")
    @Email(message = "Informe um e-mail válido.")
    private String email;

    @NotNull(message = "O papel do membro é obrigatório.")
    private WalletRole role;
}
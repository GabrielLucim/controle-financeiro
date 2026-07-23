package br.edu.ifpr.fincontrol.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequest {

    @NotBlank(message = "O nome é obrigatório.")
    @Size(min = 2, max = 100, message = "O nome deve possuir entre 2 e 100 caracteres.")
    private String name;

    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "Informe um e-mail válido.")
    private String email;

    @NotBlank(message = "A senha é obrigatória.")
    @Size(min = 8, max = 100, message = "A senha deve possuir entre 8 e 100 caracteres.")
    private String password;

}
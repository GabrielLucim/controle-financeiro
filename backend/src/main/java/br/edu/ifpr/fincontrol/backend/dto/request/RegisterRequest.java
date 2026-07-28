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
public class RegisterRequest {

    @NotBlank(message = "O nome é obrigatório.")
    @Size(min = 2, max = 100)
    private String name;

    @NotBlank(message = "O e-mail é obrigatório.")
    @Email
    private String email;

    @NotBlank(message = "A senha é obrigatória.")
    @Size(min = 8, max = 100)
    private String password;

}
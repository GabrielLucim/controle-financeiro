package br.edu.ifpr.fincontrol.backend.repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import br.edu.ifpr.fincontrol.backend.entity.PasswordResetToken;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    void deleteByUserId(Long userId);

    Optional<PasswordResetToken> findByUserIdAndUsedFalse(Long userId);

}
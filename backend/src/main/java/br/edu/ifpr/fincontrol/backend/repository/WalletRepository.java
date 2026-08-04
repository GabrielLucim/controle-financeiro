package br.edu.ifpr.fincontrol.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import br.edu.ifpr.fincontrol.backend.entity.Wallet;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
    List<Wallet> findByOwnerId(Long ownerId);
}
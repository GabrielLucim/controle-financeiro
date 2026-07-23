package br.edu.ifpr.fincontrol.backend.repository;

import br.edu.ifpr.fincontrol.backend.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletRepository extends JpaRepository<Wallet, Long> {

}
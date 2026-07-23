package br.edu.ifpr.fincontrol.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifpr.fincontrol.backend.entity.Wallet;

public interface WalletRepository extends JpaRepository<Wallet, Long> {

}
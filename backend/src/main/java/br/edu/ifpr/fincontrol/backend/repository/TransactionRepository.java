package br.edu.ifpr.fincontrol.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifpr.fincontrol.backend.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByWalletId(Long walletId);

    List<Transaction> findByWalletOwnerId(Long ownerId);

}
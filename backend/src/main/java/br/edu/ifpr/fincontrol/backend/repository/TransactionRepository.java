package br.edu.ifpr.fincontrol.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifpr.fincontrol.backend.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

}
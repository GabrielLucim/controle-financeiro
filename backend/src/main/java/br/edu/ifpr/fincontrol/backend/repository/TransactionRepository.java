package br.edu.ifpr.fincontrol.backend.repository;

import br.edu.ifpr.fincontrol.backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

}
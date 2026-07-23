package br.edu.ifpr.fincontrol.backend.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    private String category;

    private String type;

    private Double value;

    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "wallet_id")
    private Wallet wallet;

}
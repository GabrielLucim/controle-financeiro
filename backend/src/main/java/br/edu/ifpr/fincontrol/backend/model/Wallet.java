package br.edu.ifpr.fincontrol.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wallets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    private Double balance;

    private Integer members;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

}
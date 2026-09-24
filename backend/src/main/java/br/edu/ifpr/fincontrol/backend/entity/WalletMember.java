package br.edu.ifpr.fincontrol.backend.entity;

import br.edu.ifpr.fincontrol.backend.entity.enums.WalletRole;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wallet_members", uniqueConstraints = @UniqueConstraint(columnNames = { "wallet_id", "user_id" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WalletRole role;
}
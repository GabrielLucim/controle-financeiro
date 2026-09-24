package br.edu.ifpr.fincontrol.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifpr.fincontrol.backend.entity.WalletMember;

public interface WalletMemberRepository extends JpaRepository<WalletMember, Long> {

    List<WalletMember> findByWalletId(Long walletId);

    Optional<WalletMember> findByWalletIdAndUserId(Long walletId, Long userId);

    boolean existsByWalletIdAndUserId(Long walletId, Long userId);
}
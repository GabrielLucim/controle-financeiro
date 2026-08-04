package br.edu.ifpr.fincontrol.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import br.edu.ifpr.fincontrol.backend.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByOwnerId(Long ownerId);

}
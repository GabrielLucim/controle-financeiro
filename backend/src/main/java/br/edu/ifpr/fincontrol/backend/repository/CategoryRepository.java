package br.edu.ifpr.fincontrol.backend.repository;

import br.edu.ifpr.fincontrol.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}
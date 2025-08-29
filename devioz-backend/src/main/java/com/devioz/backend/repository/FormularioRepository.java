package com.devioz.backend.repository;

import com.devioz.backend.model.FormularioDevioz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormularioRepository extends JpaRepository<FormularioDevioz, Long> {
}

package com.devioz.backend.repository;

import com.devioz.backend.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findByUsuarioId(Long usuarioId);
    List<Venta> findByUsuarioEmail(String email);
}

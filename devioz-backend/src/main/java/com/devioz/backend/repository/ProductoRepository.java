package com.devioz.backend.repository;

import com.devioz.backend.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
        
    List<Producto> findByCreadoPorIdAndActivoTrue(Long usuarioId);
    List<Producto> findAllByActivoTrue();

}
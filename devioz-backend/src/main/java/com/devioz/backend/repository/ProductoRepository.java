package com.devioz.backend.repository;

import com.devioz.backend.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    // --- 👇 AÑADE ESTA LÍNEA 👇 ---
    // Busca productos donde la columna 'creado_por' coincida con el ID del usuario
    List<Producto> findByCreadoPorId(Long usuarioId);
}
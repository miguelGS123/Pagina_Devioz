package com.devioz.backend.repository;

import com.devioz.backend.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VentaRepository extends JpaRepository<Venta, Long> {

 // --- MÉTODOS ORIGINALES ---
// Renombrados para que Spring Data JPA ordene automáticamente
List<Venta> findByUsuarioIdOrderByFechaDesc(Long usuarioId);
List<Venta> findByUsuarioEmailOrderByFechaDesc(String email);


// --- MÉTODOS OPTIMIZADOS (SOLUCIÓN N+1) --
 /**
     * Trae TODAS las ventas (para el Admin), ordenadas por fecha descendente.
     */
 @Query("SELECT v FROM Venta v LEFT JOIN FETCH v.usuario u LEFT JOIN FETCH v.producto p ORDER BY v.fecha DESC")
 List<Venta> findAllWithDetails();

/**
     * Trae las ventas de un USUARIO ID (para el historial), ordenadas por fecha descendente.
     */
 @Query("SELECT v FROM Venta v LEFT JOIN FETCH v.usuario u LEFT JOIN FETCH v.producto p WHERE u.id = :usuarioId ORDER BY v.fecha DESC")
List<Venta> findByUsuarioIdWithDetails(@Param("usuarioId") Long usuarioId);

/**
     * Trae las ventas de un USUARIO EMAIL, ordenadas por fecha descendente.
     */
@Query("SELECT v FROM Venta v LEFT JOIN FETCH v.usuario u LEFT JOIN FETCH v.producto p WHERE u.email = :email ORDER BY v.fecha DESC")
List<Venta> findByUsuarioEmailWithDetails(@Param("email") String email);
}
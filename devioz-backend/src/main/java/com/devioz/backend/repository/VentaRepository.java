package com.devioz.backend.repository;

import com.devioz.backend.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VentaRepository extends JpaRepository<Venta, Long> {

    // --- MÉTODOS ORIGINALES ---
    // Los dejamos por si los usas para lógicas que no requieran DTOs
    List<Venta> findByUsuarioId(Long usuarioId);
    List<Venta> findByUsuarioEmail(String email);


    // --- MÉTODOS OPTIMIZADOS (SOLUCIÓN N+1) ---
    
    /**
     * Trae TODAS las ventas, incluyendo sus relaciones 'usuario' y 'producto' 
     * en una sola consulta para evitar N+1.
     * Usa LEFT JOIN para incluir ventas incluso si el usuario o producto son nulos.
     */
    @Query("SELECT v FROM Venta v LEFT JOIN FETCH v.usuario u LEFT JOIN FETCH v.producto p")
    List<Venta> findAllWithDetails();

    /**
     * Trae las ventas de un USUARIO ID, incluyendo sus relaciones 'producto'
     * en una sola consulta para evitar N+1.
     */
    @Query("SELECT v FROM Venta v LEFT JOIN FETCH v.usuario u LEFT JOIN FETCH v.producto p WHERE u.id = :usuarioId")
    List<Venta> findByUsuarioIdWithDetails(@Param("usuarioId") Long usuarioId);

    /**
     * Trae las ventas de un USUARIO EMAIL, incluyendo sus relaciones 'producto'
     * en una sola consulta para evitar N+1.
     */
    @Query("SELECT v FROM Venta v LEFT JOIN FETCH v.usuario u LEFT JOIN FETCH v.producto p WHERE u.email = :email")
    List<Venta> findByUsuarioEmailWithDetails(@Param("email") String email);
}
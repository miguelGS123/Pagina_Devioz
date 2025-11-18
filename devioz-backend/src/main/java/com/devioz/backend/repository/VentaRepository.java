package com.devioz.backend.repository;

import com.devioz.backend.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Importante
import org.springframework.data.repository.query.Param; // Importante
import java.util.List;

public interface VentaRepository extends JpaRepository<Venta, Long> {

    // Tus métodos originales (opcional mantenerlos)
    List<Venta> findByUsuarioId(Long usuarioId);
    List<Venta> findByUsuarioEmail(String email);
    
    // -------------------------------------------------------
    // 👇 AQUÍ ESTÁN LOS MÉTODOS QUE FALTAN Y CAUSAN EL ERROR
    // -------------------------------------------------------

    /**
     * Consulta personalizada para traer Ventas + Usuario + Producto en una sola query.
     * Usa LEFT JOIN para evitar problemas si el usuario o producto son nulos.
     * Ordena por fecha descendente.
     */
    @Query("SELECT v FROM Venta v LEFT JOIN FETCH v.usuario u LEFT JOIN FETCH v.producto p ORDER BY v.fecha DESC")
    List<Venta> findAllWithDetails();

    /**
     * Consulta personalizada para traer Ventas de un usuario específico + detalles.
     */
    @Query("SELECT v FROM Venta v LEFT JOIN FETCH v.usuario u LEFT JOIN FETCH v.producto p WHERE u.id = :usuarioId ORDER BY v.fecha DESC")
    List<Venta> findByUsuarioIdWithDetails(@Param("usuarioId") Long usuarioId);
    
    /**
     * Consulta para el vendedor (por email)
     */
    @Query("SELECT v FROM Venta v " +
           "JOIN FETCH v.producto p " +
           "JOIN FETCH v.usuario u " +
           "WHERE p.creadoPor.email = :emailVendedor " +
           "ORDER BY v.fecha DESC")
    List<Venta> findVentasByVendedorEmail(@Param("emailVendedor") String emailVendedor);
}
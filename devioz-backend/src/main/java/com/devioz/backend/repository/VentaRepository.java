package com.devioz.backend.repository;

import com.devioz.backend.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface VentaRepository extends JpaRepository<Venta, Long> {

    // Tus métodos existentes para Admin/Usuario...
    List<Venta> findByUsuarioIdOrderByFechaDesc(Long usuarioId);
    
    @Query("SELECT v FROM Venta v LEFT JOIN FETCH v.usuario u LEFT JOIN FETCH v.producto p ORDER BY v.fecha DESC")
    List<Venta> findAllWithDetails();

    @Query("SELECT v FROM Venta v LEFT JOIN FETCH v.usuario u LEFT JOIN FETCH v.producto p WHERE u.id = :usuarioId ORDER BY v.fecha DESC")
    List<Venta> findByUsuarioIdWithDetails(@Param("usuarioId") Long usuarioId);

    // --- 👇 NUEVO: Buscar ventas donde el producto pertenece al vendedor ---
    @Query("SELECT v FROM Venta v " +
           "JOIN FETCH v.producto p " +
           "JOIN FETCH v.usuario u " +
           "WHERE p.creadoPor.email = :emailVendedor " +
           "ORDER BY v.fecha DESC")
    List<Venta> findVentasByVendedorEmail(@Param("emailVendedor") String emailVendedor);
}
package com.devioz.backend.repository;

import com.devioz.backend.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface VentaRepository extends JpaRepository<Venta, Long> {

    // 1. Optimizado para listar todas las ventas (Admin)
    @Query("SELECT v FROM Venta v LEFT JOIN FETCH v.usuario u LEFT JOIN FETCH v.producto p ORDER BY v.fecha DESC")
    List<Venta> findAllWithDetails();

    // 2. Optimizado para listar ventas por cliente (User Dashboard)
    @Query("SELECT v FROM Venta v LEFT JOIN FETCH v.usuario u LEFT JOIN FETCH v.producto p WHERE u.id = :usuarioId ORDER BY v.fecha DESC")
    List<Venta> findByUsuarioIdWithDetails(@Param("usuarioId") Long usuarioId);
    
    // 3. Optimizado para buscar una venta por ID (para agendamiento)
    @Query("SELECT v FROM Venta v LEFT JOIN FETCH v.usuario u LEFT JOIN FETCH v.producto p WHERE v.id = :id")
    Optional<Venta> findByIdWithDetails(@Param("id") Long id);

    // 4. Optimizado para listar ventas para el vendedor
    @Query("SELECT v FROM Venta v " +
           "JOIN FETCH v.producto p " +
           "JOIN FETCH p.creadoPor cp " + 
           "JOIN FETCH v.usuario u " + 
           "WHERE cp.email = :emailVendedor " +
           "ORDER BY v.fecha DESC")
    List<Venta> findVentasByVendedorEmail(@Param("emailVendedor") String emailVendedor);
}
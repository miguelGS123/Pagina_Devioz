package com.devioz.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ventas_devioz")
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario; // El cliente/comprador

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto; // El producto vendido

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column(nullable = false)
    private LocalDateTime fecha = LocalDateTime.now();

    // --- CAMPOS DE LOGÍSTICA ---
    
    @Column(length = 20)
    private String estado = "PENDIENTE"; // "PENDIENTE" o "AGENDADO"

    @Column(length = 255) 
    private String direccionEnvio; 
    
    private String fechaEnvioProgramada; // Usado para agendamiento (Ej: "26/11/2025")
    
    // --- CAMPOS AÑADIDOS PARA EL NUEVO FLUJO ---
    
    // 1. Teléfono para contacto directo con el cliente (no dependemos de la tabla Usuario)
    private String telefonoCliente; 
    
    // 2. Hora de envío (Ej: "14:00 - 15:00" o "14:00")
    private String horaEnvioProgramada; 

    // --- GETTERS Y SETTERS COMPLETOS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getDireccionEnvio() { return direccionEnvio; }
    public void setDireccionEnvio(String direccionEnvio) { this.direccionEnvio = direccionEnvio; }

    public String getFechaEnvioProgramada() { return fechaEnvioProgramada; }
    public void setFechaEnvioProgramada(String fechaEnvioProgramada) { this.fechaEnvioProgramada = fechaEnvioProgramada; }
    
    // Getters y Setters de los campos nuevos
    public String getTelefonoCliente() { return telefonoCliente; }
    public void setTelefonoCliente(String telefonoCliente) { this.telefonoCliente = telefonoCliente; }
    
    public String getHoraEnvioProgramada() { return horaEnvioProgramada; }
    public void setHoraEnvioProgramada(String horaEnvioProgramada) { this.horaEnvioProgramada = horaEnvioProgramada; }
}
package com.devioz.backend.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VentaRequestDTO {

    // Identificador del producto que se está comprando
    @NotNull(message = "El ID del producto es obligatorio")
    private Long productoId;
    
    // Cantidad a comprar
    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer cantidad;
    
    // Precio total calculado en el frontend o validado en backend.
    // Aunque se recalcula, es bueno enviarlo para validación rápida.
    @NotNull(message = "El total de la venta es obligatorio")
    @Min(value = 0, message = "El total no puede ser negativo")
    private BigDecimal total;
    
    // --- Información de Logística (para el agendamiento futuro) ---
    
    // Dirección de envío (corresponde a direccionEnvio en Venta.java)
    @NotBlank(message = "La dirección de envío es obligatoria")
    private String direccionEnvio;
    
    // Teléfono del cliente para contacto (corresponde a telefonoCliente en Venta.java)
    @NotBlank(message = "El teléfono del cliente es obligatorio")
    private String telefonoCliente;

    // Nota: El ID del Usuario (Cliente) no se pide aquí, se obtiene del token JWT.

    // ======================
    // Getters y Setters
    // ======================

    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getDireccionEnvio() { return direccionEnvio; }
    public void setDireccionEnvio(String direccionEnvio) { this.direccionEnvio = direccionEnvio; }

    public String getTelefonoCliente() { return telefonoCliente; }
    public void setTelefonoCliente(String telefonoCliente) { this.telefonoCliente = telefonoCliente; }
}
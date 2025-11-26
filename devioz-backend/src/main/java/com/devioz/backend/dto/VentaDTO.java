package com.devioz.backend.dto;

import com.devioz.backend.model.Producto;
import com.devioz.backend.model.Usuario;
import com.devioz.backend.model.Venta;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class VentaDTO {

    private Long id;
    private UsuarioDTO usuario;
    private ProductoDTO producto;
    private Integer cantidad;
    private BigDecimal total;
    private LocalDateTime fecha;
    private String estado;
    private String direccionEnvio;
    private String telefonoCliente; 
    private String fechaEnvioProgramada;
    private String horaEnvioProgramada;

    public VentaDTO(Venta venta) {
        this.id = venta.getId();
        this.cantidad = venta.getCantidad();
        this.total = venta.getTotal();
        this.fecha = venta.getFecha();
        this.estado = venta.getEstado();
        this.direccionEnvio = venta.getDireccionEnvio();
        this.telefonoCliente = venta.getTelefonoCliente();
        this.fechaEnvioProgramada = venta.getFechaEnvioProgramada();
        this.horaEnvioProgramada = venta.getHoraEnvioProgramada();

        // Mapeo de Usuario
        this.usuario = venta.getUsuario() != null ? new UsuarioDTO(venta.getUsuario()) : null;

        // Mapeo de Producto
        this.producto = venta.getProducto() != null ? new ProductoDTO(venta.getProducto()) : null;
    }

    // --- Getters ---
    public Long getId() { return id; }
    public UsuarioDTO getUsuario() { return usuario; }
    public ProductoDTO getProducto() { return producto; }
    public Integer getCantidad() { return cantidad; }
    public BigDecimal getTotal() { return total; }
    public LocalDateTime getFecha() { return fecha; }
    public String getEstado() { return estado; }
    public String getDireccionEnvio() { return direccionEnvio; }
    public String getTelefonoCliente() { return telefonoCliente; }
    public String getFechaEnvioProgramada() { return fechaEnvioProgramada; }
    public String getHoraEnvioProgramada() { return horaEnvioProgramada; }

    
    // --- DTO Interno de Producto ---
    public static class ProductoDTO {
        private Long id;
        private String nombre;
        private BigDecimal precio;
        private String categoria;

        public ProductoDTO(Producto producto) {
            this.id = producto.getId();
            this.nombre = producto.getNombre();
            this.precio = producto.getPrecio();
            this.categoria = producto.getCategoria();
        }

        public Long getId() { return id; }
        public String getNombre() { return nombre; }
        public BigDecimal getPrecio() { return precio; }
        public String getCategoria() { return categoria; }
    }

    // --- DTO Interno de Usuario (AQUÍ ESTÁ LA CORRECCIÓN) ---
    public static class UsuarioDTO {
        private Long id;
        private String nombre;
        private String email;
        private String telefono; // 👈 1. AÑADIDO: Campo para guardar el teléfono

        public UsuarioDTO(Usuario usuario) {
            this.id = usuario.getId();
            this.nombre = usuario.getNombre(); 
            this.email = usuario.getEmail();
            this.telefono = usuario.getTelefono(); // 👈 2. AÑADIDO: Asignamos el valor de la entidad al DTO
        }

        public Long getId() { return id; }
        public String getNombre() { return nombre; }
        public String getEmail() { return email; }
        public String getTelefono() { return telefono; } // 👈 3. AÑADIDO: Getter para que se envíe en el JSON
    }
}
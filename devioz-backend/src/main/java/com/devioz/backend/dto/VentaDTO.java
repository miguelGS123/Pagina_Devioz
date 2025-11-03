package com.devioz.backend.dto;

import com.devioz.backend.model.Producto;
import com.devioz.backend.model.Usuario; // <-- 1. IMPORTAR USUARIO
import com.devioz.backend.model.Venta;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class VentaDTO {

    private Long id;
    // private String usuarioNombre; // <-- 2. ELIMINAR ESTA LÍNEA
    private UsuarioDTO usuario;       // <-- 3. AÑADIR ESTA LÍNEA (EL OBJETO)
    private ProductoDTO producto;
    private Integer cantidad;
    private BigDecimal total;
    private LocalDateTime fecha;

    public VentaDTO(Venta venta) {
        this.id = venta.getId();
        this.cantidad = venta.getCantidad();
        this.total = venta.getTotal();
        this.fecha = venta.getFecha();

        // --- 👇 SOLUCIÓN A "USUARIO ELIMINADO" ---
        if (venta.getUsuario() != null) {
            // 4. CREAR EL NUEVO OBJETO DTO DE USUARIO
            this.usuario = new UsuarioDTO(venta.getUsuario()); 
        } else {
            this.usuario = null;
        }

        // Esto ya estaba correcto
        if (venta.getProducto() != null) {
            this.producto = new ProductoDTO(venta.getProducto());
        } else {
            this.producto = null; 
        }
    }

    // --- Getters (Actualizados) ---
    public Long getId() { return id; }
    public UsuarioDTO getUsuario() { return usuario; } // <-- 5. ACTUALIZAR GETTER
    public ProductoDTO getProducto() { return producto; }
    public Integer getCantidad() { return cantidad; }
    public BigDecimal getTotal() { return total; }
    public LocalDateTime getFecha() { return fecha; }

    
    // --- DTO Interno de Producto (sin cambios) ---
    public static class ProductoDTO {
        private Long id;
        private String nombre;
        private String descripcion;
        private BigDecimal precio;
        private Integer stock;
        private String categoria;

        public ProductoDTO(Producto producto) {
            this.id = producto.getId();
            this.nombre = producto.getNombre(); // Tu entidad Producto usa getNombre()
            this.descripcion = producto.getDescripcion();
            this.precio = producto.getPrecio();
            this.stock = producto.getStock();
            this.categoria = producto.getCategoria();
        }

        // Getters del ProductoDTO
        public Long getId() { return id; }
        public String getNombre() { return nombre; }
        public String getDescripcion() { return descripcion; }
        public BigDecimal getPrecio() { return precio; }
        public Integer getStock() { return stock; }
        public String getCategoria() { return categoria; }
    }

    // --- 6. AÑADIR EL DTO INTERNO DE USUARIO (NUEVO) ---
    public static class UsuarioDTO {
        private Long id;
        private String nombre;
        private String email;

        public UsuarioDTO(Usuario usuario) {
            this.id = usuario.getId();
            // Asumimos que tu entidad Usuario también usa getNombre()
            this.nombre = usuario.getNombre(); 
            this.email = usuario.getEmail();
        }

        public Long getId() { return id; }
        public String getNombre() { return nombre; }
        public String getEmail() { return email; }
    }
}
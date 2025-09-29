package com.devioz.backend.dto;

import com.devioz.backend.model.Producto;
import com.devioz.backend.model.Venta;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class VentaDTO {

    private Long id;
    private String usuarioNombre;
    private ProductoDTO producto;
    private Integer cantidad;
    private BigDecimal total;
    private LocalDateTime fecha;

    public VentaDTO(Venta venta) {
        this.id = venta.getId();
        this.usuarioNombre = venta.getUsuario().getNombre();
        this.producto = new ProductoDTO(venta.getProducto());
        this.cantidad = venta.getCantidad();
        this.total = venta.getTotal();
        this.fecha = venta.getFecha();
    }

    public Long getId() { return id; }
    public String getUsuarioNombre() { return usuarioNombre; }
    public ProductoDTO getProducto() { return producto; }
    public Integer getCantidad() { return cantidad; }
    public BigDecimal getTotal() { return total; }
    public LocalDateTime getFecha() { return fecha; }

    // ✅ DTO interno para el Producto
    public static class ProductoDTO {
        private Long id;
        private String nombre;
        private String descripcion;
        private BigDecimal precio;
        private Integer stock;
        private String categoria;   // 🟩 NUEVO CAMPO

        public ProductoDTO(Producto producto) {
            this.id = producto.getId();
            this.nombre = producto.getNombre();
            this.descripcion = producto.getDescripcion();
            this.precio = producto.getPrecio();
            this.stock = producto.getStock();
            this.categoria = producto.getCategoria(); // 🟩 NUEVA ASIGNACIÓN
        }

        public Long getId() { return id; }
        public String getNombre() { return nombre; }
        public String getDescripcion() { return descripcion; }
        public BigDecimal getPrecio() { return precio; }
        public Integer getStock() { return stock; }
        public String getCategoria() { return categoria; } // 🟩 NUEVO GETTER
    }
}

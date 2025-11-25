package com.devioz.backend.dto;

import java.util.List;

/**
 * DTO utilizado para recibir los datos de la solicitud de compra (checkout) 
 * desde el Front-end (React/Axios). Contiene la información del cliente, 
 * los detalles de envío y los productos a comprar.
 */
public class VentaRequestDTO {

    // --- DATOS DEL CLIENTE / ENVÍO ---
    private String nombreCliente;
    private String telefonoCliente; 
    private String tipoEntrega;     // 'ESTACION_TREN' o 'OTRA_DIRECCION'
    private String direccionEntrega;
    
    // --- DATOS DEL CARRITO ---
    private List<ItemVentaRequestDTO> items; 

    // --- DTO INTERNO PARA CADA ÍTEM DEL CARRITO (PRODUCTO Y CANTIDAD) ---
    public static class ItemVentaRequestDTO {
        private Long productoId;
        private Integer cantidad;

        // Getters y Setters
        public Long getProductoId() { return productoId; }
        public void setProductoId(Long productoId) { this.productoId = productoId; }
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    }
    
    // --- GETTERS Y SETTERS DE LA CLASE PRINCIPAL ---
    
    public String getNombreCliente() { return nombreCliente; }
    public void setNombreCliente(String nombreCliente) { this.nombreCliente = nombreCliente; }
    public String getTelefonoCliente() { return telefonoCliente; }
    public void setTelefonoCliente(String telefonoCliente) { this.telefonoCliente = telefonoCliente; }
    public String getTipoEntrega() { return tipoEntrega; }
    public void setTipoEntrega(String tipoEntrega) { this.tipoEntrega = tipoEntrega; }
    public String getDireccionEntrega() { return direccionEntrega; }
    public void setDireccionEntrega(String direccionEntrega) { this.direccionEntrega = direccionEntrega; }
    public List<ItemVentaRequestDTO> getItems() { return items; }
    public void setItems(List<ItemVentaRequestDTO> items) { this.items = items; }
}
package com.devioz.backend.service;

import com.devioz.backend.dto.VentaRequestDTO;
import com.devioz.backend.model.Producto;
import com.devioz.backend.model.Usuario;
import com.devioz.backend.model.Venta;
import com.devioz.backend.repository.ProductoRepository;
import com.devioz.backend.repository.VentaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException; // Usado para recursos no encontrados

@Service
@Transactional
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository; 

    public VentaService(VentaRepository ventaRepository, ProductoRepository productoRepository) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
    }
    
    // Métodos para el VentaController
    @Transactional(readOnly = true)
    public List<Venta> getAllVentas() {
        return ventaRepository.findAllWithDetails();
    }
    @Transactional(readOnly = true)
    public List<Venta> getVentasByUsuarioId(@NonNull Long usuarioId) {
        return ventaRepository.findByUsuarioIdWithDetails(usuarioId); 
    }
    @Transactional(readOnly = true)
    public Optional<Venta> getVentaById(@NonNull Long id) { // Sin detalles, para operaciones simples
        return ventaRepository.findById(id);
    }
    @Transactional(readOnly = true)
    public Optional<Venta> getVentaByIdWithDetails(@NonNull Long id) { // Con detalles, para N+1
        return ventaRepository.findByIdWithDetails(id); 
    }
    public Venta saveVenta(@NonNull Venta venta) {
        return ventaRepository.save(venta);
    }
    public void deleteVenta(@NonNull Long id) {
        ventaRepository.deleteById(id);
    }
    @Transactional(readOnly = true)
    public List<Venta> getVentasByVendedorEmail(@NonNull String emailVendedor) {
        return ventaRepository.findVentasByVendedorEmail(emailVendedor);
    }


    /**
     * ✅ PROCESAR CHECKOUT
     */
    public Venta procesarVentaCheckout(@NonNull VentaRequestDTO requestDTO, @NonNull Usuario comprador) {
        
        // 1. OBTENER Y VALIDAR PRODUCTO
        Producto producto = productoRepository.findById(requestDTO.getProductoId())
            .orElseThrow(() -> new NoSuchElementException("Producto no encontrado con ID: " + requestDTO.getProductoId()));

        // 2. VALIDAR STOCK
        if (producto.getStock() < requestDTO.getCantidad()) {
            throw new IllegalStateException("Stock insuficiente para el producto: " + producto.getNombre());
        }

        // 3. VALIDAR PRECIO (Seguridad)
        BigDecimal precioUnitario = producto.getPrecio();
        BigDecimal cantidadDecimal = new BigDecimal(requestDTO.getCantidad());
        BigDecimal totalEsperado = precioUnitario.multiply(cantidadDecimal);
        
        if (totalEsperado.compareTo(requestDTO.getTotal()) != 0) {
             throw new IllegalStateException("Error de validación: El total enviado no coincide con el precio calculado.");
        }
        
        // 4. CREAR LA ENTIDAD VENTA
        Venta nuevaVenta = new Venta();
        nuevaVenta.setUsuario(comprador); 
        nuevaVenta.setProducto(producto);
        nuevaVenta.setCantidad(requestDTO.getCantidad());
        nuevaVenta.setTotal(requestDTO.getTotal());
        nuevaVenta.setEstado("PENDIENTE");
        
        // Campos de logística
        nuevaVenta.setDireccionEnvio(requestDTO.getDireccionEnvio());
        nuevaVenta.setTelefonoCliente(requestDTO.getTelefonoCliente());

        // 5. ACTUALIZAR STOCK DEL PRODUCTO
        producto.setStock(producto.getStock() - requestDTO.getCantidad());
        productoRepository.save(producto);

        // 6. GUARDAR LA VENTA
        return ventaRepository.save(nuevaVenta);
    }
    
    /**
     * ✅ AGENDAR VENTA
     */
    public Venta agendarVenta(@NonNull Long ventaId, @NonNull String fechaProgramada, @NonNull String horaProgramada) {
        
        Venta venta = ventaRepository.findById(ventaId)
            .orElseThrow(() -> new NoSuchElementException("Venta no encontrada con ID: " + ventaId));
            
        venta.setFechaEnvioProgramada(fechaProgramada);
        venta.setHoraEnvioProgramada(horaProgramada);
        venta.setEstado("AGENDADO");
        
        return ventaRepository.save(venta);
    }
}
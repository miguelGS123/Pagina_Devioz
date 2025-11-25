package com.devioz.backend.service;

import com.devioz.backend.dto.VentaRequestDTO; 
import com.devioz.backend.dto.VentaRequestDTO.ItemVentaRequestDTO;
import com.devioz.backend.model.Producto;
import com.devioz.backend.model.Usuario;
import com.devioz.backend.model.Venta;
import com.devioz.backend.repository.ProductoRepository;
import com.devioz.backend.repository.VentaRepository; // Ya existente
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository; 

    // Constructor que inyecta ambos repositorios
    public VentaService(VentaRepository ventaRepository, ProductoRepository productoRepository) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
    }

    // =================================================================
    // 📌 MÉTODOS DE LECTURA (Corregidos para usar los métodos existentes del Repository)
    // =================================================================
    
    /**
     * Soluciona el error de getAllVentas() - Usa findAllWithDetails() del Repository.
     */
    @Transactional(readOnly = true) 
    public List<Venta> getAllVentas() {
        return ventaRepository.findAllWithDetails(); 
    }

    /**
     * Soluciona el error de getVentasByUsuarioId(Long) - Usa findByUsuarioIdWithDetails() del Repository.
     */
    @Transactional(readOnly = true)
    public List<Venta> getVentasByUsuarioId(@NonNull Long usuarioId) { 
        return ventaRepository.findByUsuarioIdWithDetails(usuarioId); // <-- CORREGIDO
    }

    @Transactional(readOnly = true)
    public Optional<Venta> getVentaById(@NonNull Long id) { 
        return ventaRepository.findById(id);
    }
    
    // =================================================================
    // 📌 MÉTODOS DE ESCRITURA Y CHECKOUT FORMAL
    // =================================================================

    public Venta saveVenta(@NonNull Venta venta) { 
        return ventaRepository.save(venta);
    }

    public void deleteVenta(@NonNull Long id) { 
        ventaRepository.deleteById(id);
    }
    
    /**
     * Lógica del Checkout Formal: Procesa el carrito y los datos de envío.
     */
    @Transactional
    public List<Venta> procesarVentaCheckout(VentaRequestDTO ventaRequest, Usuario usuario) throws Exception {
        
        List<Venta> nuevasVentas = new ArrayList<>();
        
        for (ItemVentaRequestDTO item : ventaRequest.getItems()) {
            
            Optional<Producto> productoOpt = productoRepository.findById(item.getProductoId());
            
            if (productoOpt.isEmpty()) {
                throw new Exception("Producto no encontrado con ID: " + item.getProductoId());
            }

            Producto producto = productoOpt.get();
            Integer cantidad = item.getCantidad();

            if (producto.getStock() < cantidad) {
                throw new Exception("Stock insuficiente para el producto: " + producto.getNombre());
            }

            // Crear Venta y calcular Total
            BigDecimal totalItem = producto.getPrecio().multiply(BigDecimal.valueOf(cantidad));

            Venta venta = new Venta();
            venta.setUsuario(usuario);
            venta.setProducto(producto);
            venta.setCantidad(cantidad);
            venta.setTotal(totalItem);
            venta.setFecha(LocalDateTime.now());
            venta.setEstado("PENDIENTE");
            
            // Guardar la información de Entrega del DTO (Requiere que Venta.java tenga los setters)
            venta.setDireccionEnvio(ventaRequest.getDireccionEntrega()); 
            
            // Actualizar Stock
            producto.setStock(producto.getStock() - cantidad);
            productoRepository.save(producto);

            nuevasVentas.add(ventaRepository.save(venta));
        }

        return nuevasVentas;
    }
}
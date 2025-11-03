package com.devioz.backend.service;

import com.devioz.backend.model.Venta;
import com.devioz.backend.repository.VentaRepository;
import org.springframework.lang.NonNull; // Importado para Null Safety
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Importado para transacciones

import java.util.List;
import java.util.Optional;

@Service
// Es una buena práctica hacer toda la clase Transaccional
// y luego anularla con (readOnly = true) para los métodos GET.
@Transactional
public class VentaService {

    private final VentaRepository ventaRepository;

    public VentaService(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }

    /**
     * Obtiene todas las ventas con sus detalles (Usuario y Producto).
     * Soluciona el problema N+1.
     */
    @Transactional(readOnly = true) // Métodos de lectura son más eficientes
    public List<Venta> getAllVentas() {
        return ventaRepository.findAllWithDetails(); // CAMBIO
    }

    /**
     * Obtiene las ventas de un usuario con sus detalles (Producto).
     * Soluciona el problema N+1.
     * Arregla el warning de Null Safety con @NonNull.
     */
    @Transactional(readOnly = true)
    public List<Venta> getVentasByUsuarioId(@NonNull Long usuarioId) { // CAMBIO: @NonNull
        return ventaRepository.findByUsuarioIdWithDetails(usuarioId); // CAMBIO
    }

    @Transactional(readOnly = true)
    public Optional<Venta> getVentaById(@NonNull Long id) { // CAMBIO: @NonNull
        return ventaRepository.findById(id);
    }

    // Los métodos de escritura no llevan readOnly
    public Venta saveVenta(@NonNull Venta venta) { // CAMBIO: @NonNull
        return ventaRepository.save(venta);
    }

    public void deleteVenta(@NonNull Long id) { // CAMBIO: @NonNull
        ventaRepository.deleteById(id);
    }
}
package com.devioz.backend.service;

import com.devioz.backend.model.Venta;
import com.devioz.backend.repository.VentaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;

    public VentaService(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }

    public List<Venta> getAllVentas() {
        return ventaRepository.findAll();
    }

    public List<Venta> getVentasByUsuarioId(Long usuarioId) {
        return ventaRepository.findByUsuarioId(usuarioId);
    }

    public Optional<Venta> getVentaById(Long id) {
        return ventaRepository.findById(id);
    }

    public Venta saveVenta(Venta venta) {
        return ventaRepository.save(venta);
    }

    public void deleteVenta(Long id) {
        ventaRepository.deleteById(id);
    }
}

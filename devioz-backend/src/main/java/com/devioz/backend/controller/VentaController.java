package com.devioz.backend.controller;

import com.devioz.backend.dto.VentaDTO;
import com.devioz.backend.dto.VentaRequestDTO;
import com.devioz.backend.model.Usuario;
import com.devioz.backend.model.Venta;
import com.devioz.backend.repository.UsuarioRepository;
import com.devioz.backend.service.EmailService;
import com.devioz.backend.service.VentaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    private final VentaService ventaService;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;

    public VentaController(VentaService ventaService,
                           UsuarioRepository usuarioRepository,
                           EmailService emailService) {
        this.ventaService = ventaService;
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
    }

    @GetMapping
    public List<VentaDTO> getAllVentas() {
        return ventaService.getAllVentas().stream()
                .map(VentaDTO::new)
                .toList();
    }

    @GetMapping("/mis-ventas")
    public ResponseEntity<List<VentaDTO>> getMisVentas(Authentication auth) {
        String email = auth.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow();

        List<VentaDTO> ventas = ventaService.getVentasByUsuarioId(usuario.getId()).stream()
                .map(VentaDTO::new)
                .toList();

        return ResponseEntity.ok(ventas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VentaDTO> getVentaById(@PathVariable Long id) {
        return ventaService.getVentaByIdWithDetails(id)
                .map(v -> ResponseEntity.ok(new VentaDTO(v)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> procesarVentaCheckout(
            @Valid @RequestBody VentaRequestDTO requestDTO,
            Authentication auth) {

        String email = auth.getName();
        Usuario comprador = usuarioRepository.findByEmail(email)
                .orElseThrow();

        try {
            Venta savedVenta = ventaService.procesarVentaCheckout(requestDTO, comprador);

            CompletableFuture.runAsync(() ->
                    emailService.enviarConfirmacionCompra(comprador, savedVenta));

            return ResponseEntity.status(HttpStatus.CREATED).body(new VentaDTO(savedVenta));

        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVenta(@PathVariable Long id) {
        ventaService.deleteVenta(id);
        return ResponseEntity.ok("Venta eliminada correctamente");
    }

    @GetMapping("/vendedor")
    public List<VentaDTO> getVentasVendedor() {
        return ventaService.getAllVentas().stream()
                .map(VentaDTO::new)
                .toList();
    }

    @PutMapping("/{id}/agendar")
    public ResponseEntity<?> agendarEnvio(
            @PathVariable Long id,
            @RequestBody Map<String, String> datos) {

        String fecha = datos.get("fecha");
        String hora = datos.get("hora");

        if (fecha == null || hora == null) {
            return ResponseEntity.badRequest().body("Faltan datos");
        }

        try {
            Venta venta = ventaService.agendarVenta(id, fecha, hora);
            return ResponseEntity.ok(new VentaDTO(venta));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

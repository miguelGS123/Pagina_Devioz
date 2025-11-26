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

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.util.NoSuchElementException; 

@RestController
@RequestMapping("/api/ventas")
// ✅ CAMBIO: Permitir acceso desde Hostinger (y cualquier otro origen)
@CrossOrigin(origins = "*")
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

    // 📌 Obtener todas las ventas (Admin)
    @GetMapping
    public List<VentaDTO> getAllVentas() {
        return ventaService.getAllVentas() 
                .stream()
                .map(VentaDTO::new)
                .collect(Collectors.toList());
    }

    // 📌 Obtener ventas del usuario autenticado (Cliente)
    @GetMapping("/mis-ventas")
    public ResponseEntity<List<VentaDTO>> getMisVentas(Authentication authentication) {
        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));
        
        List<VentaDTO> ventas = ventaService.getVentasByUsuarioId(usuario.getId())
                .stream()
                .map(VentaDTO::new)
                .toList();

        return ResponseEntity.ok(ventas);
    }
    
    // 📌 Obtener una venta por ID
    @GetMapping("/{id}")
    public ResponseEntity<VentaDTO> getVentaById(@PathVariable Long id) {
        return ventaService.getVentaByIdWithDetails(id) 
                .map(venta -> ResponseEntity.ok(new VentaDTO(venta)))
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ ENDPOINT: PROCESAR CHECKOUT
    @PostMapping("/checkout") 
    public ResponseEntity<?> procesarVentaCheckout(
            @Valid @RequestBody VentaRequestDTO requestDTO, 
            Authentication authentication) {

        String email = authentication.getName();
        Usuario comprador = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Usuario autenticado no encontrado"));

        try {
            Venta savedVenta = ventaService.procesarVentaCheckout(requestDTO, comprador);

            CompletableFuture.runAsync(() -> {
                emailService.enviarConfirmacionCompra(comprador, savedVenta);
            });

            return ResponseEntity.status(HttpStatus.CREATED).body(new VentaDTO(savedVenta));

        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NoSuchElementException e) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    // 📌 Eliminar venta 
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVenta(@PathVariable Long id, Authentication authentication) {
        Optional<Venta> ventaOpt = ventaService.getVentaById(id);

        if (ventaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        // Lógica de validación de permisos

        ventaService.deleteVenta(id);
        return ResponseEntity.ok("Venta eliminada correctamente");
    }

    // 📌 Obtener ventas por VENDEDOR (ACTUALIZADO: Ver TODO)
    @GetMapping("/vendedor")
    public List<VentaDTO> getVentasVendedor(Authentication authentication) {
        // CAMBIO REALIZADO: Ahora llamamos a getAllVentas() para traer TODAS las ventas del sistema
        // sin filtrar por el email del vendedor, permitiendo ver pedidos globales.
        List<Venta> ventas = ventaService.getAllVentas();

        return ventas.stream()
            .map(VentaDTO::new)
            .collect(Collectors.toList());
    }

    // ✅ ENDPOINT: AGENDAR ENVÍO
    @PutMapping("/{id}/agendar")
    public ResponseEntity<?> agendarEnvio(
            @PathVariable Long id, 
            @RequestBody Map<String, String> datos) {
        
        String fecha = datos.get("fecha");
        String hora = datos.get("hora");

        if (fecha == null || hora == null) {
            return ResponseEntity.badRequest().body("Faltan datos requeridos: fecha y hora.");
        }
        
        try {
            Venta ventaActualizada = ventaService.agendarVenta(id, fecha, hora);
            
            return ResponseEntity.ok(new VentaDTO(ventaActualizada));
            
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
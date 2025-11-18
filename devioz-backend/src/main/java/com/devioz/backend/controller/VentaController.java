package com.devioz.backend.controller;

import com.devioz.backend.dto.VentaDTO;
import com.devioz.backend.model.Producto;
import com.devioz.backend.model.Usuario;
import com.devioz.backend.model.Venta;
import com.devioz.backend.repository.ProductoRepository;
import com.devioz.backend.repository.UsuarioRepository;
import com.devioz.backend.repository.VentaRepository;
import com.devioz.backend.service.EmailService;
import com.devioz.backend.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "http://localhost:5173")
public class VentaController {

    private final VentaService ventaService;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final EmailService emailService;
    
    @Autowired
    private VentaRepository ventaRepository;

    public VentaController(VentaService ventaService,
                           UsuarioRepository usuarioRepository,
                           ProductoRepository productoRepository,
                           EmailService emailService,
                           VentaRepository ventaRepository) {
        this.ventaService = ventaService;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
        this.emailService = emailService;
        this.ventaRepository = ventaRepository;
    }

    // 📌 Obtener todas las ventas (Para Admin y Vendedor)
    // --- 👇 CAMBIO: Permitimos ADMIN y VENDEDOR ---
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')") 
    @GetMapping
    public List<VentaDTO> getAllVentas() {
        return ventaService.getAllVentas()
                .stream()
                .map(VentaDTO::new)
                .collect(Collectors.toList());
    }
    // --- 👆 ---

    // ... (El resto de métodos: getMisVentas, crearVenta, etc. se quedan IGUAL) ...
    @GetMapping("/mis-ventas")
    public ResponseEntity<?> getMisVentas(Authentication authentication) {
        String email = authentication.getName();
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isEmpty()) return ResponseEntity.badRequest().body("Usuario no encontrado");
        List<VentaDTO> ventas = ventaService.getVentasByUsuarioId(usuarioOpt.get().getId())
                .stream().map(VentaDTO::new).toList();
        return ResponseEntity.ok(ventas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVentaById(@PathVariable Long id) {
        return ventaService.getVentaById(id)
                .map(venta -> ResponseEntity.ok(new VentaDTO(venta)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crearVenta(@RequestParam Long productoId, @RequestParam Integer cantidad, Authentication authentication) {
        // (Tu lógica de crear venta existente... sin cambios)
        String email = authentication.getName();
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        Optional<Producto> productoOpt = productoRepository.findById(productoId);
        if (usuarioOpt.isEmpty() || productoOpt.isEmpty()) return ResponseEntity.badRequest().body("Datos incorrectos");

        Usuario usuario = usuarioOpt.get();
        Producto producto = productoOpt.get();
        if (producto.getStock() < cantidad) return ResponseEntity.badRequest().body("Stock insuficiente");

        BigDecimal total = producto.getPrecio().multiply(BigDecimal.valueOf(cantidad));
        producto.setStock(producto.getStock() - cantidad);
        productoRepository.save(producto);

        Venta venta = new Venta();
        venta.setUsuario(usuario);
        venta.setProducto(producto);
        venta.setCantidad(cantidad);
        venta.setTotal(total);
        venta.setFecha(LocalDateTime.now());
        venta.setEstado("PENDIENTE");

        Venta savedVenta = ventaService.saveVenta(venta);
        CompletableFuture.runAsync(() -> emailService.enviarConfirmacionCompra(usuario, savedVenta));
        return ResponseEntity.ok(new VentaDTO(savedVenta));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVenta(@PathVariable Long id, Authentication authentication) {
        // (Tu lógica de borrar existente... sin cambios)
        Optional<Venta> ventaOpt = ventaService.getVentaById(id);
        if (ventaOpt.isEmpty()) return ResponseEntity.notFound().build();
        // Solo borra si es dueño o Admin.
        Venta venta = ventaOpt.get();
        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        
        if (!venta.getUsuario().getId().equals(usuario.getId()) && !"ROL_ADMIN".equals(usuario.getRol().name())) {
            return ResponseEntity.status(403).body("No tienes permiso");
        }
        ventaService.deleteVenta(id);
        return ResponseEntity.ok("Eliminado");
    }

    // 📌 Agendar Envío (Esto lo usa el Vendedor)
    @PutMapping("/{id}/agendar")
    public ResponseEntity<?> agendarEnvio(@PathVariable Long id, @RequestBody Map<String, String> datos) {
        return ventaRepository.findById(id).map(venta -> {
            venta.setEstado("AGENDADO");
            venta.setDireccionEnvio(datos.get("direccion"));
            venta.setFechaEnvioProgramada(datos.get("fecha"));
            ventaRepository.save(venta);
            return ResponseEntity.ok("Envío agendado correctamente");
        }).orElse(ResponseEntity.notFound().build());
    }
}
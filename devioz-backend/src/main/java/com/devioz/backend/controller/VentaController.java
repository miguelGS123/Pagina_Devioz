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

    // ... (MANTÉN TUS MÉTODOS ANTIGUOS AQUÍ: getAllVentas, getMisVentas, crearVenta, deleteVenta) ...
    // ... (Estoy resumiendo para no copiar código repetido, pero NO los borres) ...

    // 📌 Crear una venta (Asegúrate de añadir el estado inicial)
    @PostMapping
    public ResponseEntity<?> crearVenta(@RequestParam Long productoId,
                                        @RequestParam Integer cantidad,
                                        Authentication authentication) {
        // ... (validaciones anteriores) ...
        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        Producto producto = productoRepository.findById(productoId).orElseThrow();

        // ... (lógica de stock y precio) ...
        BigDecimal total = producto.getPrecio().multiply(BigDecimal.valueOf(cantidad));
        producto.setStock(producto.getStock() - cantidad);
        productoRepository.save(producto);

        Venta venta = new Venta();
        venta.setUsuario(usuario);
        venta.setProducto(producto);
        venta.setCantidad(cantidad);
        venta.setTotal(total);
        venta.setFecha(LocalDateTime.now());
        
        // ✅ ESTADO INICIAL
        venta.setEstado("PENDIENTE");

        Venta savedVenta = ventaService.saveVenta(venta);
        CompletableFuture.runAsync(() -> emailService.enviarConfirmacionCompra(usuario, savedVenta));

        return ResponseEntity.ok(new VentaDTO(savedVenta));
    }

    // ==========================================
    // 👇 MÉTODOS NUEVOS PARA EL VENDEDOR 👇
    // ==========================================

    // 📌 Obtener ventas (pedidos) para el Vendedor autenticado
    @GetMapping("/vendedor")
    public List<Venta> getVentasVendedor(Authentication authentication) {
        String email = authentication.getName();
        return ventaRepository.findVentasByVendedorEmail(email);
    }

    // 📌 Agendar Envío (Actualizar estado de la venta)
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
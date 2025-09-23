package com.devioz.backend.controller;

import com.devioz.backend.dto.VentaDTO;
import com.devioz.backend.model.Producto;
import com.devioz.backend.model.Usuario;
import com.devioz.backend.model.Venta;
import com.devioz.backend.repository.ProductoRepository;
import com.devioz.backend.repository.UsuarioRepository;
import com.devioz.backend.service.VentaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    private final VentaService ventaService;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    public VentaController(VentaService ventaService,
                           UsuarioRepository usuarioRepository,
                           ProductoRepository productoRepository) {
        this.ventaService = ventaService;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
    }

    // 📌 Obtener todas las ventas (solo admins)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<VentaDTO> getAllVentas() {
        return ventaService.getAllVentas()
                .stream()
                .map(VentaDTO::new)
                .collect(Collectors.toList());
    }

    // 📌 Obtener ventas del usuario autenticado
    @GetMapping("/mis-ventas")
    public ResponseEntity<?> getMisVentas(Authentication authentication) {
        String email = authentication.getName();
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        List<VentaDTO> ventas = ventaService.getVentasByUsuarioId(usuarioOpt.get().getId())
                                            .stream()
                                            .map(VentaDTO::new)
                                            .toList();

        return ResponseEntity.ok(ventas);
    }

    // 📌 Obtener una venta por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getVentaById(@PathVariable Long id) {
        return ventaService.getVentaById(id)
                .map(venta -> ResponseEntity.ok(new VentaDTO(venta)))
                .orElse(ResponseEntity.notFound().build());
    }

    // 📌 Crear una venta (compra) usando el usuario del token - ✅ ACTUALIZADO CON STOCK
    @PostMapping
    public ResponseEntity<?> crearVenta(@RequestParam Long productoId,
                                        @RequestParam Integer cantidad,
                                        Authentication authentication) {

        // 1. Validar cantidad
        if (cantidad == null || cantidad <= 0) {
            return ResponseEntity.badRequest().body("La cantidad debe ser mayor a 0");
        }

        // 2. Buscar usuario autenticado y producto
        String email = authentication.getName();
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        Optional<Producto> productoOpt = productoRepository.findById(productoId);

        if (usuarioOpt.isEmpty() || productoOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario o Producto no encontrado");
        }

        Usuario usuario = usuarioOpt.get();
        Producto producto = productoOpt.get();

        // ✅✅✅ NUEVA VALIDACIÓN: Verificar stock disponible
        if (producto.getStock() < cantidad) {
            return ResponseEntity.badRequest()
                    .body("Stock insuficiente. Stock disponible: " + producto.getStock() + ", solicitado: " + cantidad);
        }

        // 3. Calcular total
        BigDecimal total = producto.getPrecio().multiply(BigDecimal.valueOf(cantidad));

        // ✅✅✅ ACTUALIZAR STOCK (Disminuir) - PARTE CRÍTICA
        producto.setStock(producto.getStock() - cantidad);
        productoRepository.save(producto); // Guardar el nuevo stock

        // 4. Crear venta
        Venta venta = new Venta();
        venta.setUsuario(usuario);
        venta.setProducto(producto);
        venta.setCantidad(cantidad);
        venta.setTotal(total);
        venta.setFecha(LocalDateTime.now());

        Venta savedVenta = ventaService.saveVenta(venta);

        return ResponseEntity.ok(new VentaDTO(savedVenta));
    }

    // 📌 Eliminar una venta (usuario dueño o admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVenta(@PathVariable Long id, Authentication authentication) {
        Optional<Venta> ventaOpt = ventaService.getVentaById(id);

        if (ventaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Venta venta = ventaOpt.get();
        String email = authentication.getName();
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        Usuario usuario = usuarioOpt.get();
        if (!venta.getUsuario().getId().equals(usuario.getId()) && !"ADMIN".equals(usuario.getRol())) {
            return ResponseEntity.status(403).body("No tienes permiso para eliminar esta venta");
        }

        ventaService.deleteVenta(id);
        return ResponseEntity.ok("Venta eliminada correctamente");
    }
}
package com.devioz.backend.controller;

import com.devioz.backend.dto.VentaDTO;
import com.devioz.backend.dto.VentaRequestDTO; // <-- DTO DE ENTRADA (NUEVO)
import com.devioz.backend.model.Producto;
import com.devioz.backend.model.Usuario;
import com.devioz.backend.model.Venta;
import com.devioz.backend.repository.ProductoRepository;
import com.devioz.backend.repository.UsuarioRepository;
import com.devioz.backend.repository.VentaRepository;
import com.devioz.backend.service.EmailService;
import com.devioz.backend.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    private final VentaRepository ventaRepository;

    @Autowired
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

    // 📌 Obtener todas las ventas (Historial General)
    @GetMapping
    public List<VentaDTO> getAllVentas() {
        return ventaService.getAllVentas()
                .stream()
                .map(VentaDTO::new)
                .collect(Collectors.toList());
    }

    // 📌 Obtener ventas del usuario autenticado ("Mis Compras")
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

    // =======================================================================
    // 👇 NUEVO ENDPOINT: CHECKOUT FORMAL (Múltiples ítems y Envío) 👇
    // =======================================================================
    @PostMapping("/crear-checkout")
    public ResponseEntity<?> crearVentaCheckout(
            @RequestBody VentaRequestDTO ventaRequest,
            Authentication authentication) {

        if (ventaRequest.getItems() == null || ventaRequest.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("El carrito está vacío.");
        }
        
        String email = authentication.getName();
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado o no encontrado.");
        }
        
        Usuario usuario = usuarioOpt.get(); // Obtenemos el usuario aquí

        try {
            // 1. Procesar la venta y generar la lista de registros de venta
            List<Venta> nuevasVentas = ventaService.procesarVentaCheckout(ventaRequest, usuario);

            // 2. Enviar confirmación al cliente (CORRECCIÓN FINAL)
            // Se usan los 3 argumentos: el usuario, los datos del DTO y la lista de ventas guardadas
            CompletableFuture.runAsync(() -> {
                 emailService.enviarConfirmacionCompra(usuario, ventaRequest, nuevasVentas); 
            });

            return ResponseEntity.ok("Compra procesada exitosamente. Se generaron " + nuevasVentas.size() + " registros de venta.");
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al procesar la compra: " + e.getMessage());
        }
    }
    // =======================================================================


    // 📌 Crear una venta (Endpoint ANTIGUO para un solo producto)
    @PostMapping
    public ResponseEntity<?> crearVenta(@RequestParam Long productoId,
                                        @RequestParam Integer cantidad,
                                        Authentication authentication) {

        if (cantidad == null || cantidad <= 0) {
            return ResponseEntity.badRequest().body("La cantidad debe ser mayor a 0");
        }

        String email = authentication.getName();
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        Optional<Producto> productoOpt = productoRepository.findById(productoId);

        if (usuarioOpt.isEmpty() || productoOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario o Producto no encontrado");
        }

        Usuario usuario = usuarioOpt.get();
        Producto producto = productoOpt.get();

        if (producto.getStock() < cantidad) {
            return ResponseEntity.badRequest()
                    .body("Stock insuficiente.");
        }

        BigDecimal total = producto.getPrecio().multiply(BigDecimal.valueOf(cantidad));

        producto.setStock(producto.getStock() - cantidad);
        productoRepository.save(producto);

        Venta venta = new Venta();
        venta.setUsuario(usuario);
        venta.setProducto(producto);
        venta.setCantidad(cantidad);
        venta.setTotal(total);
        venta.setFecha(LocalDateTime.now());
        venta.setEstado("PENDIENTE"); // Estado inicial

        Venta savedVenta = ventaService.saveVenta(venta);

        CompletableFuture.runAsync(() -> {
             // Mantiene la llamada antigua que usa el objeto Venta individual
             emailService.enviarConfirmacionCompra(usuario, savedVenta); 
        });

        return ResponseEntity.ok(new VentaDTO(savedVenta));
    }

    // 📌 Eliminar venta (Solo Admin o Dueño)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVenta(@PathVariable Long id, Authentication authentication) {
        Optional<Venta> ventaOpt = ventaService.getVentaById(id);

        if (ventaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Venta venta = ventaOpt.get();
        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        
        if (!venta.getUsuario().getId().equals(usuario.getId()) && !"ROL_ADMIN".equals(usuario.getRol().name())) {
            return ResponseEntity.status(403).body("No tienes permiso para eliminar esta venta");
        }

        ventaService.deleteVenta(id);
        return ResponseEntity.ok("Venta eliminada correctamente");
    }

    // 📌 Obtener TODAS las ventas para gestión (Vendedor Logístico)
    @GetMapping("/vendedor")
    public List<Venta> getVentasVendedor(Authentication authentication) {
        return ventaRepository.findAll(Sort.by(Sort.Direction.DESC, "fecha"));
    }

    // 📌 Agendar Envío (Actualizar estado de la venta)
    @PutMapping("/{id}/agendar")
    public ResponseEntity<?> agendarEnvio(@PathVariable Long id, @RequestBody Map<String, String> datos) {
        return ventaRepository.findById(id).map(venta -> {
            venta.setEstado("AGENDADO");
            // Estos setters funcionan porque verificamos que Venta.java ya los tiene
            venta.setDireccionEnvio(datos.get("direccion")); 
            venta.setFechaEnvioProgramada(datos.get("fecha"));
            ventaRepository.save(venta);
            return ResponseEntity.ok("Envío agendado correctamente");
        }).orElse(ResponseEntity.notFound().build());
    }
}
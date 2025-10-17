package com.devioz.backend.controller;

import com.devioz.backend.model.Producto;
import com.devioz.backend.model.Usuario;
import com.devioz.backend.repository.UsuarioRepository;
import com.devioz.backend.service.ProductoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;
    private final UsuarioRepository usuarioRepository;

    public ProductoController(ProductoService productoService, UsuarioRepository usuarioRepository) {
        this.productoService = productoService;
        this.usuarioRepository = usuarioRepository;
    }

    // ✅ Listar todos los productos
    @GetMapping
    public List<Producto> getAllProductos() {
        return productoService.getAllProductos();
    }

    // ✅ Obtener producto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        Optional<Producto> producto = productoService.getProductoById(id);
        return producto.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Crear nuevo producto (asigna automáticamente el usuario autenticado)
    @PostMapping
    public ResponseEntity<Producto> createProducto(@RequestBody Producto producto,
                                                   Authentication authentication) {

        // Obtener el email del usuario autenticado
        String email = authentication.getName();

        // Buscar el usuario en la base de datos
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + email));

        // Asignar el usuario autenticado como creador
        producto.setCreadoPor(usuario);

        Producto savedProducto = productoService.saveProducto(producto);
        return ResponseEntity.ok(savedProducto);
    }

    // ✅ Actualizar producto existente (corrige problema del stock)
    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable Long id,
                                                   @RequestBody Producto productoDetails) {

        Optional<Producto> producto = productoService.getProductoById(id);

        if (producto.isPresent()) {
            Producto existingProducto = producto.get();

            existingProducto.setNombre(productoDetails.getNombre());
            existingProducto.setDescripcion(productoDetails.getDescripcion());
            existingProducto.setImagen(productoDetails.getImagen());
            existingProducto.setPrecio(productoDetails.getPrecio());
            existingProducto.setStock(productoDetails.getStock()); // ✅ Actualiza stock
            existingProducto.setCategoria(productoDetails.getCategoria()); // ✅ Actualiza categoría
            // ❌ No actualizamos creadoPor — se mantiene el creador original

            Producto updatedProducto = productoService.saveProducto(existingProducto);
            return ResponseEntity.ok(updatedProducto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Eliminar producto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        Optional<Producto> producto = productoService.getProductoById(id);

        if (producto.isPresent()) {
            productoService.deleteProducto(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

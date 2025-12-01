package com.devioz.backend.controller;

import com.devioz.backend.model.Producto;
import com.devioz.backend.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public List<Producto> getAllProductos() {
        return productoService.getAllProductos();
    }

    @GetMapping("/mis-productos")
    public List<Producto> getMisProductos(Authentication authentication) {
        String email = authentication.getName();
        return productoService.getProductosByVendedor(email);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        return productoService.getProductoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Producto> createProducto(@RequestBody Producto producto,
                                                   Authentication authentication) {
        producto.setId(null);
        String email = authentication.getName();
        Producto savedProducto = productoService.saveProducto(producto, email);
        return ResponseEntity.ok(savedProducto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable Long id,
                                                   @RequestBody Producto productoDetails) {

        Optional<Producto> productoData = productoService.getProductoById(id);

        if (productoData.isPresent()) {
            Producto existing = productoData.get();
            existing.setNombre(productoDetails.getNombre());
            existing.setDescripcion(productoDetails.getDescripcion());
            existing.setImagen(productoDetails.getImagen());
            existing.setPrecio(productoDetails.getPrecio());
            existing.setStock(productoDetails.getStock());
            existing.setCategoria(productoDetails.getCategoria());

            Producto updated = productoService.saveProducto(existing, null);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        if (productoService.getProductoById(id).isPresent()) {
            productoService.deleteProducto(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get("uploads");

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String publicUrl = "/uploads/" + fileName;
            return ResponseEntity.ok(publicUrl);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error al subir imagen");
        }
    }
}

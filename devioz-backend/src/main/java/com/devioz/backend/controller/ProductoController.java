package com.devioz.backend.controller;

import com.devioz.backend.model.Producto;
import com.devioz.backend.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    // 🔥 DOMINIO PÚBLICO DE LA API (CLAVE PARA IMÁGENES)
    private static final String PUBLIC_API_URL = "https://api.devioz.com";

    // ================================
    //  GET TODOS LOS PRODUCTOS (PÚBLICO)
    // ================================
    @GetMapping
    public List<Producto> getAllProductos() {
        return productoService.getAllProductos();
    }

    // ================================
    //  GET MIS PRODUCTOS
    // ================================
    @GetMapping("/mis-productos")
    public List<Producto> getMisProductos(Authentication authentication) {

        String email = authentication.getName();
        String rol = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        if (rol.equals("ROL_ADMIN") || rol.equals("ROL_VENDEDOR")) {
            return productoService.getAllProductos();
        }

        return productoService.getProductosByVendedor(email);
    }

    // ================================
    //  GET PRODUCTO POR ID
    // ================================
    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        return productoService.getProductoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ================================
    //  CREAR PRODUCTO
    // ================================
    @PostMapping
    public ResponseEntity<Producto> createProducto(
            @RequestBody Producto producto,
            Authentication authentication
    ) {

        producto.setId(null);
        String email = authentication.getName();

        Producto savedProducto = productoService.saveProducto(producto, email);
        return ResponseEntity.ok(savedProducto);
    }

    // ================================
    //  ACTUALIZAR PRODUCTO
    // ================================
    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(
            @PathVariable Long id,
            @RequestBody Producto productoDetails
    ) {

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

    // ================================
    //  ELIMINAR PRODUCTO
    // ================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        if (productoService.getProductoById(id).isPresent()) {
            productoService.deleteProducto(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ================================
    //  SUBIR IMAGEN (🔥 CORREGIDO)
    // ================================
    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file
    ) {
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            // 📁 carpeta montada por Docker + Nginx
            Path uploadPath = Paths.get("uploads");

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            // 🔥 URL ABSOLUTA (LA CLAVE)
            String publicUrl = PUBLIC_API_URL + "/uploads/" + fileName;

            return ResponseEntity.ok(publicUrl);

        } catch (IOException e) {
            return ResponseEntity
                    .status(500)
                    .body("Error al subir imagen");
        }
    }
}

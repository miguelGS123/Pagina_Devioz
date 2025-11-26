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
// ✅ CAMBIO: Permitir acceso desde Hostinger (y cualquier otro origen)
@CrossOrigin(origins = "*") 
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // ✅ Listar todos los productos (Público/Admin)
    @GetMapping
    public List<Producto> getAllProductos() {
        return productoService.getAllProductos();
    }

    // ✅ NUEVO: Listar SOLO productos del vendedor autenticado
    @GetMapping("/mis-productos")
    public List<Producto> getMisProductos(Authentication authentication) {
        String email = authentication.getName();
        return productoService.getProductosByVendedor(email);
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
        // El ID debe ser null para que sea un nuevo registro
        producto.setId(null);
        
        // Delegamos al servicio la asignación del creador
        String email = authentication.getName();
        Producto savedProducto = productoService.saveProducto(producto, email);
        
        return ResponseEntity.ok(savedProducto);
    }

    // ✅ Actualizar producto existente
    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable Long id,
                                                   @RequestBody Producto productoDetails) {
        Optional<Producto> productoData = productoService.getProductoById(id);

        if (productoData.isPresent()) {
            Producto existingProducto = productoData.get();
            existingProducto.setNombre(productoDetails.getNombre());
            existingProducto.setDescripcion(productoDetails.getDescripcion());
            existingProducto.setImagen(productoDetails.getImagen());
            existingProducto.setPrecio(productoDetails.getPrecio());
            existingProducto.setStock(productoDetails.getStock());
            existingProducto.setCategoria(productoDetails.getCategoria());
            
            // Pasamos 'null' como email para indicar que NO queremos cambiar el creador
            Producto updatedProducto = productoService.saveProducto(existingProducto, null);
            return ResponseEntity.ok(updatedProducto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Eliminar producto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        if (productoService.getProductoById(id).isPresent()) {
            productoService.deleteProducto(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Subir imagen y devolver URL pública
    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
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
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al subir la imagen: " + e.getMessage());
        }
    }
}
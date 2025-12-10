package com.devioz.backend.service;

import com.devioz.backend.model.Producto;
import com.devioz.backend.model.Usuario; 
import com.devioz.backend.repository.ProductoRepository;
import com.devioz.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    // 🚀 CAMBIO CRÍTICO 1: Usar el filtro Activo=true para la lista pública
    public List<Producto> getAllProductos() {
        return productoRepository.findAllByActivoTrue();
    }

    // --- 👇 MÉTODO: OBTENER PRODUCTOS DE UN VENDEDOR (Activo=true) ---
    public List<Producto> getProductosByVendedor(String email) {
        // Buscamos al usuario por su email (que viene del Token)
        Usuario vendedor = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));
        
        // 🚀 CAMBIO CRÍTICO 2: Usar el nuevo método filtrado por activo
        return productoRepository.findByCreadoPorIdAndActivoTrue(vendedor.getId());
    }

    public Optional<Producto> getProductoById(Long id) {
        // Aunque no es estrictamente necesario, filtramos por activo=true para consistencia
        return productoRepository.findById(id).filter(Producto::isActivo);
    }

    // --- 👇 MÉTODO ACTUALIZADO: GUARDAR PRODUCTO CON DUEÑO ---
    public Producto saveProducto(Producto producto, String emailCreador) {
        // Si es nuevo (no tiene ID), asignamos el creador
        if (producto.getId() == null && emailCreador != null) {
             Usuario creador = usuarioRepository.findByEmail(emailCreador)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
             producto.setCreadoPor(creador);
        }
        // Si ya existe, JPA mantiene el creador original a menos que lo cambiemos explícitamente
        return productoRepository.save(producto);
    }

    // 🚀 CAMBIO CRÍTICO 3: Implementación del Borrado Lógico (Soft Delete)
    public void deleteProducto(Long id) {
        Producto producto = productoRepository.findById(id)
                // Utilizamos una excepción genérica que ya existe en Java
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id)); 

        // Marcar el producto como inactivo en lugar de borrarlo físicamente
        producto.setActivo(false);
        productoRepository.save(producto); 
    }
}
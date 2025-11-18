package com.devioz.backend.service;

import com.devioz.backend.model.Producto;
import com.devioz.backend.model.Usuario; // Importar Usuario
import com.devioz.backend.repository.ProductoRepository;
import com.devioz.backend.repository.UsuarioRepository; // Importar Repo Usuario
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository; // Para asignar el creador

    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    // --- 👇 NUEVO MÉTODO: OBTENER PRODUCTOS DE UN VENDEDOR ---
    public List<Producto> getProductosByVendedor(String email) {
        // Buscamos al usuario por su email (que viene del Token)
        Usuario vendedor = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));
        
        // Devolvemos solo sus productos
        return productoRepository.findByCreadoPorId(vendedor.getId());
    }

    public Optional<Producto> getProductoById(Long id) {
        return productoRepository.findById(id);
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

    public void deleteProducto(Long id) {
        productoRepository.deleteById(id);
    }
}
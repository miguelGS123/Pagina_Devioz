package com.devioz.backend.service;

import com.devioz.backend.model.Usuario;
import com.devioz.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // 🔹 Obtener todos los usuarios
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    // 🔹 Obtener usuario por email
    public Optional<Usuario> getUsuarioByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    // 🔹 Obtener usuario por ID
    public Optional<Usuario> getUsuarioById(Long id) {
        return usuarioRepository.findById(id);
    }

    // 🔹 Crear o guardar usuario (útil para admin al crear vendedores)
    public Usuario saveUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // 🔹 Eliminar usuario por ID (solo admin para borrar vendedores)
    public void deleteUsuarioById(Long id) {
        usuarioRepository.deleteById(id);
    }

    // 🔹 Eliminar usuario por email (útil para que el propio usuario borre su cuenta)
    public void deleteUsuarioByEmail(String email) {
        usuarioRepository.findByEmail(email).ifPresent(usuarioRepository::delete);
    }

    // 🔹 Listar todos los vendedores
    public List<Usuario> getVendedores() {
        return usuarioRepository.findAll()
                .stream()
                .filter(u -> u.getRol() == Usuario.Rol.ROL_VENDEDOR)
                .toList();
    }

    // 🔹 Listar todos los usuarios normales
    public List<Usuario> getUsuariosNormales() {
        return usuarioRepository.findAll()
                .stream()
                .filter(u -> u.getRol() == Usuario.Rol.ROL_USUARIO)
                .toList();
    }
}

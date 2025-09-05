package com.devioz.backend.service;

import com.devioz.backend.model.Usuario;
import com.devioz.backend.repository.UsuarioRepository;
import com.devioz.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ Registro de usuario
    public String register(Usuario usuario) {
        Optional<Usuario> existente = usuarioRepository.findByEmail(usuario.getEmail());
        if (existente.isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        Usuario nuevoUsuario = usuarioRepository.save(usuario);

        // ✅ Usamos email y rol para el token
        return jwtUtil.generateToken(nuevoUsuario.getEmail(), nuevoUsuario.getRol().name());
    }

    // ✅ Login de usuario
    public String login(String email, String password) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        // ✅ Usamos email y rol para el token
        return jwtUtil.generateToken(usuario.getEmail(), usuario.getRol().name());
    }
}

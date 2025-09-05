package com.devioz.backend.controller;

import com.devioz.backend.model.Usuario;
import com.devioz.backend.repository.UsuarioRepository;
import com.devioz.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173") // 👈 ajusta al puerto de tu frontend
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // ✅ Registro
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario usuario) {
        String token = authService.register(usuario);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("usuario", usuario);

        return ResponseEntity.ok(response);
    }

    // ✅ Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        String token = authService.login(email, password);

        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("usuario", usuario);

        return ResponseEntity.ok(response);
    }
}

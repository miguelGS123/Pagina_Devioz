package com.devioz.backend.controller;

import com.devioz.backend.model.Usuario;
import com.devioz.backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            String token = authService.login(request.email(), request.password());
            return ResponseEntity.ok(new TokenResponse(token));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    // Registro
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario usuario) {
        try {
            Usuario savedUser = authService.register(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error en el registro: " + e.getMessage());
        }
    }

    // ✅ Endpoint temporal para debug de password
    @PostMapping("/check-password")
    public ResponseEntity<?> checkPassword(@RequestBody CheckPasswordRequest request) {
        boolean matches = authService.checkPassword(request.email(), request.password());
        return ResponseEntity.ok("¿Coincide el password? " + matches);
    }

    // DTOs
    public record LoginRequest(String email, String password) {}
    public record TokenResponse(String token) {}
    public record CheckPasswordRequest(String email, String password) {}
}

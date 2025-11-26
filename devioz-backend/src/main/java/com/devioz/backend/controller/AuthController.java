package com.devioz.backend.controller;

import com.devioz.backend.dto.RegisterRequest; 
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
// ✅ CAMBIO: Permitir acceso desde Hostinger (y cualquier otro origen)
@CrossOrigin(origins = "*") 
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // ✅ Registro
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre(registerRequest.getNombre());
        nuevoUsuario.setEmail(registerRequest.getEmail());
        nuevoUsuario.setPassword(registerRequest.getPassword()); 
        nuevoUsuario.setTelefono(registerRequest.getTelefono());

        String token = authService.register(nuevoUsuario);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("usuario", usuarioRepository.findByEmail(nuevoUsuario.getEmail()).orElse(null));

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
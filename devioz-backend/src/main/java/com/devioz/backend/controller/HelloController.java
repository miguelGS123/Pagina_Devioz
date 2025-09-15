package com.devioz.backend.controller;

import com.devioz.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class HelloController {

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ Endpoint público de prueba
    @GetMapping("/hello")
    public String hello() {
        return "✅ Backend Devioz funcionando correctamente!";
    }

    // ✅ Endpoint protegido que requiere rol ADMIN
    @GetMapping("/admin")
    public String admin(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extraer el token (remover "Bearer ")
            String token = authHeader.replace("Bearer ", "");

            // Validar rol
            if (jwtUtil.hasRole(token, "ADMIN")) {
                return "🔒 Acceso permitido: Bienvenido ADMIN!";
            } else {
                return "⛔ Acceso denegado: se requiere rol ADMIN.";
            }

        } catch (Exception e) {
            return "⚠️ Error: Token inválido o ausente.";
        }
    }

    // ✅ Endpoint protegido que requiere rol VENDEDOR
    @GetMapping("/vendedor")
    public String vendedor(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            if (jwtUtil.hasRole(token, "VENDEDOR")) {
                return "🛒 Acceso permitido: Bienvenido VENDEDOR!";
            } else {
                return "⛔ Acceso denegado: se requiere rol VENDEDOR.";
            }
        } catch (Exception e) {
            return "⚠️ Error: Token inválido o ausente.";
        }
    }

    // ✅ Endpoint protegido que requiere rol USUARIO
    @GetMapping("/usuario")
    public String usuario(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            if (jwtUtil.hasRole(token, "USUARIO")) {
                return "👤 Acceso permitido: Bienvenido USUARIO!";
            } else {
                return "⛔ Acceso denegado: se requiere rol USUARIO.";
            }
        } catch (Exception e) {
            return "⚠️ Error: Token inválido o ausente.";
        }
    }
}

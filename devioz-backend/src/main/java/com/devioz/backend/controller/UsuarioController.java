package com.devioz.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UsuarioController {

    @GetMapping("/user/dashboard")
    public String dashboardUsuario() {
        return "Bienvenido al panel de USUARIO 🚀";
    }
}

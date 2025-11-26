package com.devioz.backend.controller;

import com.devioz.backend.model.FormularioDevioz;
import com.devioz.backend.repository.FormularioRepository;
import com.devioz.backend.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api")
// ✅ CAMBIO: Permitir acceso desde Hostinger (y cualquier otro origen)
@CrossOrigin(origins = "*")
public class FormularioController {

    private final FormularioRepository formularioRepository;
    private final EmailService emailService;

    public FormularioController(FormularioRepository formularioRepository, EmailService emailService) {
        this.formularioRepository = formularioRepository;
        this.emailService = emailService;
    }

    @PostMapping("/formulario")
    public ResponseEntity<String> guardarFormulario(@RequestBody FormularioDevioz formulario) {
        try {
            // ✅ Guardar en la BD primero
            formularioRepository.save(formulario);

            // ✅ Enviar correos en segundo plano (no bloquea la respuesta)
            CompletableFuture.runAsync(() -> {
                emailService.enviarCorreoConfirmacion(formulario);
                emailService.notificarAdmin(formulario);
            });

            // 👉 Responder inmediatamente al frontend
            return ResponseEntity.ok("Formulario enviado ✅");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al enviar el formulario ❌");
        }
    }
}
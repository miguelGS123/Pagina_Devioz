package com.devioz.backend.controller;

import com.devioz.backend.model.FormularioDevioz;
import com.devioz.backend.repository.FormularioRepository;
import com.devioz.backend.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api")
public class FormularioController {

    private final FormularioRepository formularioRepository;
    private final EmailService emailService;

    public FormularioController(FormularioRepository formularioRepository,
                                EmailService emailService) {
        this.formularioRepository = formularioRepository;
        this.emailService = emailService;
    }

    @PostMapping("/formulario")
    public ResponseEntity<String> guardarFormulario(@RequestBody FormularioDevioz formulario) {
        try {
            formularioRepository.save(formulario);

            CompletableFuture.runAsync(() -> {
                emailService.enviarCorreoConfirmacion(formulario);
                emailService.notificarAdmin(formulario);
            });

            return ResponseEntity.ok("Formulario enviado");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al enviar formulario");
        }
    }
}

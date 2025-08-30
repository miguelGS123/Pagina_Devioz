package com.devioz.backend.controller;

import com.devioz.backend.model.FormularioDevioz;
import com.devioz.backend.repository.FormularioRepository;
import com.devioz.backend.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formulario")
@CrossOrigin(origins = "http://localhost:5173")
public class FormularioController {

    private final FormularioRepository formularioRepository;
    private final EmailService emailService;

    public FormularioController(FormularioRepository formularioRepository, EmailService emailService) {
        this.formularioRepository = formularioRepository;
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<FormularioDevioz> guardarFormulario(@RequestBody FormularioDevioz formulario) {
        FormularioDevioz guardado = formularioRepository.save(formulario);

        // Enviar correos
        emailService.enviarCorreoConfirmacion(guardado);
        emailService.notificarAdmin(guardado);

        return ResponseEntity.ok(guardado);
    }

    @GetMapping
    public List<FormularioDevioz> listarFormularios() {
        return formularioRepository.findAll();
    }
}

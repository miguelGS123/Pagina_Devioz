package com.devioz.backend.controller;

import com.devioz.backend.model.FormularioDevioz;
import com.devioz.backend.repository.FormularioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formulario")
@CrossOrigin(origins = "http://localhost:5173") // tu frontend (Vite usa 5173 por defecto)
public class FormularioController {

    private final FormularioRepository formularioRepository;

    public FormularioController(FormularioRepository formularioRepository) {
        this.formularioRepository = formularioRepository;
    }

    // ✅ Guardar un formulario (desde el frontend)
    @PostMapping
    public ResponseEntity<FormularioDevioz> guardarFormulario(@RequestBody FormularioDevioz formulario) {
        FormularioDevioz guardado = formularioRepository.save(formulario);
        return ResponseEntity.ok(guardado);
    }

    // ✅ Listar todos los formularios (para probar que sí guarda en DB)
    @GetMapping
    public List<FormularioDevioz> listarFormularios() {
        return formularioRepository.findAll();
    }
}

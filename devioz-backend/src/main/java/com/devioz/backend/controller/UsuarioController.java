package com.devioz.backend.controller;

import com.devioz.backend.model.Usuario;
import com.devioz.backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return usuarioService.getAllUsuarios();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Long id) {
        return usuarioService.getUsuarioById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Usuario createUsuario(@RequestBody Map<String, String> payload) {

        Usuario usuario = new Usuario();
        usuario.setNombre(payload.get("nombre"));
        usuario.setEmail(payload.get("email"));
        usuario.setTelefono(payload.get("telefono"));

        String rolStr = payload.get("rol");
        if (rolStr != null) usuario.setRol(Usuario.Rol.valueOf(rolStr));

        usuario.setPassword(payload.get("password"));

        return usuarioService.createUsuario(usuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> updateUsuario(@PathVariable Long id,
                                                 @RequestBody Usuario usuarioDetails) {
        try {
            Usuario updated = usuarioService.updateUsuario(id, usuarioDetails);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        usuarioService.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }
}

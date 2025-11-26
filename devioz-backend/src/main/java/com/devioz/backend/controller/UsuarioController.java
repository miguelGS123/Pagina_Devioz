package com.devioz.backend.controller;

import com.devioz.backend.model.Usuario;
import com.devioz.backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // Importar Map

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // GET /api/usuarios (Obtener todos)
    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return usuarioService.getAllUsuarios();
    }

    // GET /api/usuarios/{id} (Obtener uno)
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Long id) {
        return usuarioService.getUsuarioById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- 👇 MÉTODO CORREGIDO PARA CREAR USUARIO ---
    @PostMapping
    public Usuario createUsuario(@RequestBody Map<String, String> payload) {
        // 1. Creamos la entidad manualmente desde el JSON
        Usuario usuario = new Usuario();
        usuario.setNombre(payload.get("nombre"));
        usuario.setEmail(payload.get("email"));
        usuario.setTelefono(payload.get("telefono"));
        
        // 2. Asignamos el Rol (convirtiendo el String a Enum)
        String rolStr = payload.get("rol");
        if (rolStr != null) {
            usuario.setRol(Usuario.Rol.valueOf(rolStr)); 
        }

        // 3. Asignamos la contraseña MANUALMENTE (evitando @JsonIgnore)
        // Esto soluciona el error 'rawPassword cannot be null'
        String rawPassword = payload.get("password");
        usuario.setPassword(rawPassword);

        // 4. El servicio se encargará de encriptarla
        return usuarioService.createUsuario(usuario);
    }
    // --- 👆 FIN DE LA CORRECCIÓN ---

    // PUT /api/usuarios/{id} (Actualizar usuario - Admin)
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> updateUsuario(@PathVariable Long id, @RequestBody Usuario usuarioDetails) {
        try {
            // Nota: Para actualizar, si la contraseña viene nula, el servicio la ignora.
            // Pero si quisieras actualizarla, necesitarías la misma lógica del Map.
            // Por ahora, asumimos que el frontend envía el objeto Usuario correctamente para updates.
            
            // SI quieres permitir cambiar contraseña al editar, usa la misma lógica del Map aquí también.
            // Pero tu código actual de AdminUsersTable.tsx envía un objeto Usuario limpio,
            // y el servicio ya maneja la contraseña opcional. Dejémoslo así para Update.
            
            Usuario updatedUsuario = usuarioService.updateUsuario(id, usuarioDetails);
            return ResponseEntity.ok(updatedUsuario);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/usuarios/{id} (Eliminar usuario - Admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        usuarioService.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }
}
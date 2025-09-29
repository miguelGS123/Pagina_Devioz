package com.devioz.backend.controller;

import com.devioz.backend.model.Usuario;
import com.devioz.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ Listar todos los usuarios normales (solo ADMIN)
    @GetMapping
    @PreAuthorize("hasAuthority('ROL_ADMIN')")
    public List<Usuario> listarUsuarios() {
        return usuarioService.getUsuariosNormales();
    }

    // ✅ Listar todos los vendedores (solo ADMIN)
    @GetMapping("/vendedores")
    @PreAuthorize("hasAuthority('ROL_ADMIN')")
    public List<Usuario> listarVendedores() {
        return usuarioService.getVendedores();
    }

    // ✅ Obtener usuario por ID (ADMIN o propio usuario)
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROL_ADMIN') or #id == principal.id")
    public Optional<Usuario> obtenerUsuario(@PathVariable Long id) {
        return usuarioService.getUsuarioById(id);
    }

    // ✅ Actualizar usuario (solo el propio usuario)
    @PutMapping("/{id}")
    @PreAuthorize("#id == principal.id")
    public Usuario actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioActualizado) {
        Optional<Usuario> usuarioOpt = usuarioService.getUsuarioById(id);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            usuario.setNombre(usuarioActualizado.getNombre());
            usuario.setTelefono(usuarioActualizado.getTelefono());
            if (usuarioActualizado.getPassword() != null && !usuarioActualizado.getPassword().isEmpty()) {
                usuario.setPassword(passwordEncoder.encode(usuarioActualizado.getPassword()));
            }
            return usuarioService.saveUsuario(usuario);
        }
        return null;
    }

    // ✅ Eliminar propio usuario (USUARIO o ADMIN si necesita)
    @DeleteMapping("/mi-cuenta")
    @PreAuthorize("hasAuthority('ROL_USUARIO') or hasAuthority('ROL_ADMIN')")
    public String eliminarMiCuenta(@RequestParam String email) {
        usuarioService.deleteUsuarioByEmail(email);
        return "Cuenta eliminada correctamente ✅";
    }

    // ✅ Crear vendedor (solo ADMIN)
    @PostMapping("/vendedor")
    @PreAuthorize("hasAuthority('ROL_ADMIN')")
    public Usuario crearVendedor(@RequestBody Usuario vendedor) {
        vendedor.setPassword(passwordEncoder.encode(vendedor.getPassword()));
        vendedor.setRol(Usuario.Rol.ROL_VENDEDOR);
        return usuarioService.saveUsuario(vendedor);
    }

    // ✅ Eliminar vendedor (solo ADMIN)
    @DeleteMapping("/vendedor/{id}")
    @PreAuthorize("hasAuthority('ROL_ADMIN')")
    public String eliminarVendedor(@PathVariable Long id) {
        usuarioService.deleteUsuarioById(id);
        return "Vendedor eliminado correctamente ✅";
    }

    // ✅ Dashboard según rol (opcional, puede usarse para frontend)
    @GetMapping("/dashboard")
    public String dashboard(@RequestParam String rol) {
        switch (rol) {
            case "ROL_ADMIN": return "Bienvenido al panel de ADMIN 🚀";
            case "ROL_VENDEDOR": return "Bienvenido al panel de VENDEDOR 🚀";
            default: return "Bienvenido al panel de USUARIO 🚀";
        }
    }
}

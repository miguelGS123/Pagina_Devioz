package com.devioz.backend.security;

import com.devioz.backend.model.Usuario;
import com.devioz.backend.repository.UsuarioRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class MyUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public MyUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

        // Crear la autoridad exactamente como está en la BD
        GrantedAuthority authority = new SimpleGrantedAuthority(usuario.getRol().name());
        List<GrantedAuthority> authorities = Collections.singletonList(authority);

        return new User(
            usuario.getEmail(),
            usuario.getPassword(),
            authorities
        );
    }
}
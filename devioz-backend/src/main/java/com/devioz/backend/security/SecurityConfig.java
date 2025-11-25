package com.devioz.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    // 1. Encriptador de contraseñas
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. Gestor de Autenticación
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // 3. Configuración CORS (Permite conexión con Frontend)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Orígenes permitidos (Frontend local y Docker)
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:80")); 
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Headers necesarios para JWT e Imágenes
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control", "Pragma", "Expires", "X-Requested-With"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // 4. Cadena de Filtros de Seguridad (El cerebro de la seguridad)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                
                // === ZONA PÚBLICA (Sin Token) ===
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/api/formulario/**").permitAll()
                .requestMatchers("/api/chat/**").permitAll()
                .requestMatchers("/api/hello").permitAll()
                .requestMatchers("/uploads/**").permitAll() 
                .requestMatchers("/error").permitAll()

                // === ZONA DE PRODUCTOS ===
                .requestMatchers("/api/productos/mis-productos").hasAnyAuthority("ROL_VENDEDOR", "ROL_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/productos/**").hasAnyAuthority("ROL_ADMIN", "ROL_VENDEDOR")
                .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasAnyAuthority("ROL_ADMIN", "ROL_VENDEDOR")
                .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasAuthority("ROL_ADMIN")
                
                // === ZONA DE USUARIOS ===
                // Permite al ADMIN CREAR USUARIOS (Vendedores/Clientes/etc.) - Requerido para la tarea
                .requestMatchers(HttpMethod.POST, "/api/usuarios").hasAuthority("ROL_ADMIN") // <-- ESTA LÍNEA ES EL PERMISO
                
                // Ver perfil propio (cualquier autenticado)
                .requestMatchers(HttpMethod.GET, "/api/usuarios/**").authenticated() 
                // Gestión de usuarios
                .requestMatchers(HttpMethod.PUT, "/api/usuarios/**").hasAuthority("ROL_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**").hasAuthority("ROL_ADMIN")

                // === ZONA DE VENTAS ===
                .requestMatchers(HttpMethod.POST, "/api/ventas/crear-checkout").hasAuthority("ROL_USUARIO") // Nuevo Checkout
                .requestMatchers("/api/ventas/mis-ventas").hasAuthority("ROL_USUARIO")
                .requestMatchers("/api/ventas/vendedor").hasAnyAuthority("ROL_VENDEDOR", "ROL_ADMIN")
                .requestMatchers("/api/ventas/*/agendar").hasAnyAuthority("ROL_VENDEDOR", "ROL_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/ventas").hasAnyAuthority("ROL_ADMIN", "ROL_VENDEDOR")
                .requestMatchers(HttpMethod.POST, "/api/ventas/**").hasAuthority("ROL_USUARIO")
                .requestMatchers(HttpMethod.DELETE, "/api/ventas/**").hasAnyAuthority("ROL_ADMIN", "ROL_USUARIO")

                // === CANDADO FINAL ===
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        // Esto hace que Spring busque "ROL_ADMIN" en vez de "ROLE_ROL_ADMIN"
        http.setSharedObject(GrantedAuthorityDefaults.class, new GrantedAuthorityDefaults(""));

        return http.build();
    }
}
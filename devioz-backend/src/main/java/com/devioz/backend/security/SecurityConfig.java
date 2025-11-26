package com.devioz.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
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
@EnableWebSecurity
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

    // 3. Configuración CORS GLOBAL (Permite conexión con Hostinger y otros)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // ✅ CAMBIO: Permitir TODO (*) para evitar bloqueos de Hostinger
        configuration.setAllowedOrigins(List.of("*")); 
        
        // Métodos permitidos
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Headers necesarios
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control", "Pragma", "Expires", "X-Requested-With"));
        
        // ⚠️ IMPORTANTE: Si usas origins "*", allowCredentials NO puede ser true en navegadores modernos.
        // Si necesitas credentials (cookies), debes poner la lista explícita de dominios.
        // Como usas JWT (Header Authorization), generalmente NO necesitas credentials=true.
        configuration.setAllowCredentials(false); 
        
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // 4. Cadena de Filtros de Seguridad
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Activar CORS usando la configuración de arriba
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
                .requestMatchers(HttpMethod.GET, "/api/usuarios/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/usuarios").hasAuthority("ROL_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/usuarios/**").hasAuthority("ROL_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**").hasAuthority("ROL_ADMIN")

                // === ZONA DE VENTAS ===
                .requestMatchers("/api/ventas/mis-ventas").hasAnyAuthority("ROL_USUARIO", "ROL_VENDEDOR", "ROL_ADMIN") // Amplié permisos para evitar errores raros
                .requestMatchers("/api/ventas/checkout").authenticated() // ✅ Checkout para cualquier autenticado
                .requestMatchers("/api/ventas/vendedor").hasAnyAuthority("ROL_VENDEDOR", "ROL_ADMIN")
                .requestMatchers("/api/ventas/*/agendar").hasAnyAuthority("ROL_VENDEDOR", "ROL_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/ventas").hasAnyAuthority("ROL_ADMIN", "ROL_VENDEDOR")
                .requestMatchers(HttpMethod.POST, "/api/ventas/**").hasAuthority("ROL_USUARIO")
                .requestMatchers(HttpMethod.DELETE, "/api/ventas/**").hasAnyAuthority("ROL_ADMIN", "ROL_USUARIO")

                // === CANDADO FINAL ===
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        http.setSharedObject(GrantedAuthorityDefaults.class, new GrantedAuthorityDefaults(""));

        return http.build();
    }
}
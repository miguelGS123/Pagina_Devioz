package com.devioz.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
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
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    // (Tus @Bean de PasswordEncoder y AuthenticationManager están bien)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // 👉 Configuración de CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // frontend
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // --- 👇 ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
        // Añadimos las 3 cabeceras de no-cache a la lista permitida
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type", 
            "X-Requested-With",
            "Cache-Control", // <-- AÑADIDO
            "Pragma",        // <-- AÑADIDO
            "Expires"        // <-- AÑADIDO
        ));
        // --- 👆 FIN DE LA CORRECCIÓN 👆 ---
        
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // 👉 Seguridad HTTP (Tu configuración de rutas está bien)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll() 
                .requestMatchers("/api/formulario/**").permitAll()
                .requestMatchers("/api/chat/**").permitAll()
                .requestMatchers("/api/hello").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/productos/**").hasAnyAuthority("ROL_ADMIN", "ROL_VENDEDOR")
                .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasAnyAuthority("ROL_ADMIN", "ROL_VENDEDOR")
                .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasAnyAuthority("ROL_ADMIN", "ROL_VENDEDOR")
                .requestMatchers(HttpMethod.GET, "/api/usuarios/**").hasAuthority("ROL_ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/usuarios").hasAuthority("ROL_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/usuarios/**").hasAuthority("ROL_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**").hasAuthority("ROL_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/ventas").hasAuthority("ROL_ADMIN")
                .requestMatchers("/api/ventas/mis-ventas").hasAuthority("ROL_USUARIO")
                .requestMatchers(HttpMethod.POST, "/api/ventas/**").hasAuthority("ROL_USUARIO")
                .requestMatchers(HttpMethod.DELETE, "/api/ventas/**").hasAnyAuthority("ROL_ADMIN", "ROL_USUARIO")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        http.setSharedObject(GrantedAuthorityDefaults.class, new GrantedAuthorityDefaults(""));

        return http.build();
    }
}
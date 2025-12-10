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
// NUEVAS IMPORTACIONES REQUERIDAS PARA CORS
import org.springframework.web.cors.CorsConfiguration; 
import org.springframework.web.cors.CorsConfigurationSource; 
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays; 

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }
    
    // 🚀 CAMBIO CRÍTICO: Configuración CORS para resolver el error IllegalArgumentException
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // CORRECCIÓN: Usar el dominio específico para que funcione con allowCredentials(true)
        configuration.setAllowedOrigins(Arrays.asList("https://devioz.com")); 
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*")); 
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // 🚀 CAMBIO 2: ELIMINAR cors.disable() y USAR EL BEAN CREADO
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        // PUBLIC
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/api/formulario/**").permitAll()
                        .requestMatchers("/api/chat/**").permitAll()
                        .requestMatchers("/api/hello").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/error").permitAll()

                        // PRODUCTOS
                        .requestMatchers("/api/productos/mis-productos").hasAnyAuthority("ROL_VENDEDOR", "ROL_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/productos/**").hasAnyAuthority("ROL_ADMIN", "ROL_VENDEDOR")
                        .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasAnyAuthority("ROL_ADMIN", "ROL_VENDEDOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasAuthority("ROL_ADMIN")

                        // USUARIOS
                        .requestMatchers(HttpMethod.GET, "/api/usuarios/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/usuarios").hasAuthority("ROL_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/usuarios/**").hasAuthority("ROL_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**").hasAuthority("ROL_ADMIN")

                        // VENTAS
                        .requestMatchers("/api/ventas/mis-ventas").hasAnyAuthority("ROL_USUARIO", "ROL_VENDEDOR", "ROL_ADMIN")
                        .requestMatchers("/api/ventas/checkout").authenticated()
                        .requestMatchers("/api/ventas/vendedor").hasAnyAuthority("ROL_VENDEDOR", "ROL_ADMIN")
                        .requestMatchers("/api/ventas/*/agendar").hasAnyAuthority("ROL_VENDEDOR", "ROL_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/ventas").hasAnyAuthority("ROL_ADMIN", "ROL_VENDEDOR")
                        .requestMatchers(HttpMethod.POST, "/api/ventas/**").hasAuthority("ROL_USUARIO")
                        .requestMatchers(HttpMethod.DELETE, "/api/ventas/**").hasAnyAuthority("ROL_ADMIN", "ROL_USUARIO")

                        // RESTO
                        .anyRequest().authenticated()
                )

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        http.setSharedObject(GrantedAuthorityDefaults.class, new GrantedAuthorityDefaults(""));

        return http.build();
    }
}
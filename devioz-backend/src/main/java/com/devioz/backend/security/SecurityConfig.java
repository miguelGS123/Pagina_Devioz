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

    // 👉 Password encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 👉 AuthenticationManager para login
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // 👉 Configuración de CORS (¡CRUCIAL PARA EVITAR ERRORES DE RED!)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // Tu frontend
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // ✅ AQUÍ ESTÁN LAS CABECERAS QUE FALTABAN ANTES
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type", 
            "Cache-Control", 
            "Pragma", 
            "Expires", 
            "X-Requested-With"
        ));
        
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // 👉 Seguridad HTTP (Reglas de acceso)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                
                // 🔓 1. Rutas Totalmente Públicas
                .requestMatchers("/auth/**").permitAll() 
                .requestMatchers("/api/formulario/**").permitAll()
                .requestMatchers("/api/chat/**").permitAll()
                .requestMatchers("/api/hello").permitAll()
                .requestMatchers("/uploads/**").permitAll() // Imágenes

                // 📦 2. PRODUCTOS (El orden importa muchísimo aquí)
                // A. "Mis Productos" del Vendedor (DEBE IR ANTES del permitAll)
                .requestMatchers("/api/productos/mis-productos").hasAnyAuthority("ROL_VENDEDOR", "ROL_ADMIN")
                
                // B. Ver productos (Público - Clientes)
                .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                
                // C. Gestión (Crear/Editar -> Admin y Vendedor)
                .requestMatchers(HttpMethod.POST, "/api/productos/**").hasAnyAuthority("ROL_ADMIN", "ROL_VENDEDOR")
                .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasAnyAuthority("ROL_ADMIN", "ROL_VENDEDOR")
                
                // D. Eliminar (SOLO ADMIN)
                .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasAuthority("ROL_ADMIN")
                
                // 👥 3. USUARIOS
                // A. Ver Perfil (Todos los logueados, incluido el usuario Kevin)
                .requestMatchers(HttpMethod.GET, "/api/usuarios/**").authenticated()
                
                // B. Gestión Completa (SOLO Admin)
                .requestMatchers(HttpMethod.POST, "/api/usuarios").hasAuthority("ROL_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/usuarios/**").hasAuthority("ROL_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**").hasAuthority("ROL_ADMIN")

                // 💰 4. VENTAS / PEDIDOS
                // A. Cliente ve sus compras
                .requestMatchers("/api/ventas/mis-ventas").hasAuthority("ROL_USUARIO")
                
                // B. Vendedor ve sus ventas (pedidos recibidos)
                .requestMatchers("/api/ventas/vendedor").hasAnyAuthority("ROL_VENDEDOR", "ROL_ADMIN")
                
                // C. Vendedor agenda envío
                .requestMatchers("/api/ventas/*/agendar").hasAnyAuthority("ROL_VENDEDOR", "ROL_ADMIN")
                
                // D. Listado General (Admin y Vendedor para logística)
                .requestMatchers(HttpMethod.GET, "/api/ventas").hasAnyAuthority("ROL_ADMIN", "ROL_VENDEDOR")
                
                // E. Crear Venta (Cliente compra)
                .requestMatchers(HttpMethod.POST, "/api/ventas/**").hasAuthority("ROL_USUARIO")
                
                // F. Eliminar Venta (Admin o el propio Usuario - lógica en controlador)
                .requestMatchers(HttpMethod.DELETE, "/api/ventas/**").hasAnyAuthority("ROL_ADMIN", "ROL_USUARIO")

                // 🔒 Bloquear cualquier otra cosa que no esté en la lista
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        // Eliminar prefijo automático "ROLE_"
        http.setSharedObject(GrantedAuthorityDefaults.class, new GrantedAuthorityDefaults(""));

        return http.build();
    }
}
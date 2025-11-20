package com.devioz.backend.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull; // <-- 1. IMPORTACIÓN NECESARIA PARA EL ERROR
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final MyUserDetailsService userDetailsService;

    public JwtFilter(JwtUtil jwtUtil, MyUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,     // <-- 2. CORRECCIÓN: @NonNull
            @NonNull HttpServletResponse response,    // <-- 3. CORRECCIÓN: @NonNull
            @NonNull FilterChain filterChain          // <-- 4. CORRECCIÓN: @NonNull
    ) throws ServletException, IOException {

        String path = request.getServletPath();
        String method = request.getMethod();

        System.out.println("\n=== FILTRO JWT ===");
        System.out.println("Método: " + method);
        System.out.println("Ruta: " + path);

        // 🟢 1. Permitir libre acceso a imágenes
        if (path.startsWith("/uploads/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 🟢 2. Definir qué rutas de productos son públicas
        // Es pública si empieza con /api/productos, es GET, Y NO ES /mis-productos
        // (Esto es vital para que el Vendedor pueda ver sus productos privados)
        boolean isPublicProductRoute = path.startsWith("/api/productos") 
                                       && !path.contains("/mis-productos") 
                                       && "GET".equalsIgnoreCase(method);

        // ✅ Rutas públicas sin token
        if (path.startsWith("/auth") ||
            isPublicProductRoute || 
            path.startsWith("/api/formulario") ||
            path.startsWith("/api/chat") ||
            path.startsWith("/api/hello")) {
            
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ Permitir preflight CORS
        if ("OPTIONS".equalsIgnoreCase(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 🔒 Validación de token en rutas protegidas
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                if (jwtUtil.validateToken(token)) {
                    String email = jwtUtil.extractEmail(token);
                    
                    // Cargar usuario
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Token inválido");
                    return;
                }
            } catch (JwtException e) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Token inválido");
                return;
            } catch (Exception e) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Error cargando usuario");
                return;
            }
        } else {
            // Si no es pública y no tiene token -> Error
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "No se proporcionó token");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
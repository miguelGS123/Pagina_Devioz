package com.devioz.backend.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getServletPath();
        String method = request.getMethod();

        System.out.println("\n=== FILTRO JWT ===");
        System.out.println("Método: " + method);
        System.out.println("Ruta: " + path);
        // No imprimimos el token completo por seguridad en logs de producción, pero para debug está bien
        // System.out.println("Authorization: " + request.getHeader("Authorization"));

        // 🟢 1. Permitir libre acceso a imágenes
        if (path.startsWith("/uploads/")) {
            System.out.println("🟢 Ruta de imagen pública, saltando filtro JWT");
            filterChain.doFilter(request, response);
            return;
        }

        // 🟢 2. Definir qué rutas de productos son públicas
        // Es pública si empieza con /api/productos, es GET, Y NO ES /mis-productos
        boolean isPublicProductRoute = path.startsWith("/api/productos") 
                                       && !path.contains("/mis-productos") // 👈 LA CORRECCIÓN CLAVE
                                       && "GET".equalsIgnoreCase(method);

        // ✅ Rutas públicas sin token
        if (path.startsWith("/auth") ||
            isPublicProductRoute || // Usamos la nueva lógica
            path.startsWith("/api/formulario") ||
            path.startsWith("/api/chat") ||
            path.startsWith("/api/hello")) {
            
            System.out.println("✅ Ruta pública, permitiendo acceso sin token: " + path);
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ Permitir preflight CORS
        if ("OPTIONS".equalsIgnoreCase(method)) {
            System.out.println("✅ Solicitud OPTIONS (preflight), permitiendo sin validación");
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
                    System.out.println("🔐 Token válido para: " + email);

                    // ✅ Cargar autoridades del usuario
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("✅ Autoridades cargadas: " + userDetails.getAuthorities());
                } else {
                    System.out.println("❌ Token inválido");
                    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Token inválido");
                    return;
                }
            } catch (JwtException e) {
                System.out.println("❌ Error validando token: " + e.getMessage());
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Token inválido");
                return;
            } catch (Exception e) {
                System.out.println("❌ Error cargando usuario: " + e.getMessage());
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Error cargando usuario");
                return;
            }
        } else {
            System.out.println("🚫 No se proporcionó token en la cabecera Authorization para ruta protegida");
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "No se proporcionó token");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
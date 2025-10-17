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
import java.util.Enumeration;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final MyUserDetailsService userDetailsService; // ← Esto debe estar

    public JwtFilter(JwtUtil jwtUtil, MyUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService; // ← Y esto en el constructor
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
    System.out.println("Authorization: " + request.getHeader("Authorization"));

    // 🟢 NUEVO: Permitir libre acceso a imágenes
    if (path.startsWith("/uploads/")) {
        System.out.println("🟢 Ruta de imagen pública, saltando filtro JWT");
        filterChain.doFilter(request, response);
        return;
    }

    // ✅ Rutas públicas sin token
    if (path.startsWith("/auth") ||
        (path.startsWith("/api/productos") && "GET".equalsIgnoreCase(method)) ||
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
                System.out.println("🔐 Ruta solicitada: " + path);
                System.out.println("🔐 Método: " + method);
                System.out.println("🔐 Autoridades del usuario: " + userDetails.getAuthorities());
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
        System.out.println("🚫 No se proporcionó token en la cabecera Authorization");
        response.sendError(HttpServletResponse.SC_FORBIDDEN, "No se proporcionó token");
        return;
    }

    filterChain.doFilter(request, response);
}

}
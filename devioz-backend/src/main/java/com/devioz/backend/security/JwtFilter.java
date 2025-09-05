package com.devioz.backend.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Enumeration;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
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
        System.out.println("Content-Type: " + request.getHeader("Content-Type"));
        System.out.println("Origin: " + request.getHeader("Origin"));

        // Log headers
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            System.out.println(headerName + ": " + request.getHeader(headerName));
        }
        System.out.println("==================");

        // ✅ Rutas públicas sin token
        if (path.startsWith("/auth") ||
            path.startsWith("/productos") ||
            path.startsWith("/api/formulario") ||
            path.startsWith("/api/chat")) {
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
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(email, null, Collections.emptyList());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    System.out.println("❌ Token inválido");
                    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Token inválido");
                    return;
                }
            } catch (JwtException e) {
                System.out.println("❌ Error validando token: " + e.getMessage());
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Token inválido");
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

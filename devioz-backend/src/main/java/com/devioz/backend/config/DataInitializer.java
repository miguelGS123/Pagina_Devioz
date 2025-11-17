// En: src/main/java/com/devioz/backend/config/DataInitializer.java
package com.devioz.backend.config;

import com.devioz.backend.model.Usuario;
import com.devioz.backend.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Configuration
public class DataInitializer {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public CommandLineRunner initDatabase() {
        return args -> {
            
            String adminEmail = "miguel@devioz.com";
            String adminPassword = "miguel4598"; // La contraseña en texto plano

            Optional<Usuario> adminOpt = usuarioRepository.findByEmail(adminEmail);

            if (adminOpt.isEmpty()) {
                // Si por alguna razón NO existe, lo crea
                System.out.println(">>> Creando usuario ADMIN por defecto...");
                Usuario admin = new Usuario();
                admin.setNombre("Miguel Admin");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword)); // Encripta
                admin.setRol(Usuario.Rol.ROL_ADMIN);
                usuarioRepository.save(admin);
                System.out.println(">>> Usuario ADMIN creado exitosamente.");

            } else {
                // SI EXISTE (TU CASO), VERIFICA LA CONTRASEÑA
                System.out.println(">>> El usuario ADMIN ya existe. Verificando contraseña...");
                Usuario admin = adminOpt.get();
                
                // Comprueba si la contraseña 'miguel4598' coincide con el hash de la BD
                if (!passwordEncoder.matches(adminPassword, admin.getPassword())) {
                    
                    // SI NO COINCIDE, LA ACTUALIZA
                    System.out.println(">>> ¡Contraseña incorrecta! Actualizando hash...");
                    admin.setPassword(passwordEncoder.encode(adminPassword));
                    usuarioRepository.save(admin);
                    System.out.println(">>> Contraseña del ADMIN actualizada.");
                    
                } else {
                    System.out.println(">>> La contraseña del ADMIN es correcta.");
                }
            }
        };
    }
}
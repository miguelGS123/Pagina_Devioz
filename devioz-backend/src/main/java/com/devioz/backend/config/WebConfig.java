package com.devioz.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // LÓGICA: Mapeamos la URL "/uploads/nombre-imagen.png"
        // directamente a la carpeta interna del contenedor "/app/uploads/nombre-imagen.png".
        // El "file:" indica que es una ruta del sistema de archivos, no del classpath.
        // La barra "/" al final es OBLIGATORIA.
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:/app/uploads/");
    }
}
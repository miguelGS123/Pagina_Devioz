package com.devioz.backend.service;

import com.devioz.backend.model.FormularioDevioz;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String remitente; // tu correo configurado en application.properties

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // ✅ Correo de confirmación al usuario
    public void enviarCorreoConfirmacion(FormularioDevioz formulario) throws MessagingException, IOException {
        MimeMessage mensaje = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

        helper.setTo(formulario.getCorreo());
        helper.setSubject("Gracias por contactarnos - Devíoz");
        helper.setFrom(remitente);

        String cuerpo = """
                <h2>Hola, gracias por contactarnos en Devíoz</h2>
                <p>Hemos recibido tu consulta sobre: <b>%s</b></p>
                <p>En breve uno de nuestros asesores se pondrá en contacto contigo.</p>
                <p>Mira esta imagen relacionada con tu área de interés:</p>
                <img src='cid:imagenArea' alt='Imagen área' style='max-width:400px; margin-top:10px;'/>
                """.formatted(formulario.getArea());

        helper.setText(cuerpo, true);

        // Adjuntar imagen según el área
        String imagenPath = seleccionarImagen(formulario.getArea());
        if (imagenPath != null) {
            ClassPathResource imagen = new ClassPathResource(imagenPath);
            helper.addInline("imagenArea", imagen);
        }

        mailSender.send(mensaje);
    }

    // ✅ Correo al administrador
    public void notificarAdmin(FormularioDevioz formulario) throws MessagingException {
        MimeMessage mensaje = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

        helper.setTo("987536362miguel@gmail.com"); // 🔴 cámbialo por tu correo personal
        helper.setSubject("📩 Nuevo formulario recibido en Devíoz");
        helper.setFrom(remitente);

        String cuerpo = """
                <h2>Nuevo formulario recibido</h2>
                <p><b>Asunto:</b> %s</p>
                <p><b>Correo:</b> %s</p>
                <p><b>Teléfono:</b> %s</p>
                <p><b>Área:</b> %s</p>
                <p><b>Mensaje:</b> %s</p>
                """.formatted(
                formulario.getAsunto(),
                formulario.getCorreo(),
                formulario.getTelefono(),
                formulario.getArea(),
                formulario.getMensaje()
        );

        helper.setText(cuerpo, true);
        mailSender.send(mensaje);
    }

    // ✅ Asignar imagen según el área
    private String seleccionarImagen(String area) {
        if (area == null) return null;

        return switch (area.toLowerCase()) {
            case "desarrollo web" -> "static/email/web.png";
            case "desarrollo app" -> "static/email/app.png";
            case "devops" -> "static/email/devops.png";
            case "aws" -> "static/email/aws.png";
            case "data" -> "static/email/data.png";
            default -> null;
        };
    }
}

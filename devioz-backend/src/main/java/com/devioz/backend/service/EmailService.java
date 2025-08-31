package com.devioz.backend.service;

import com.devioz.backend.model.FormularioDevioz;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // 📩 Correo de confirmación para el usuario
    @Async
    public void enviarCorreoConfirmacion(FormularioDevioz formulario) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

            helper.setTo(formulario.getCorreo());
            helper.setSubject("Gracias por contactarnos - Devíoz");

            String imagen = obtenerImagenPorArea(formulario.getArea());

            String contenidoHtml = """
                <h2>¡Gracias por contactarte con Devíoz!</h2>
                <p>Hola, hemos recibido tu solicitud sobre el área: <b>%s</b>.</p>
                <p>Uno de nuestros asesores se pondrá en contacto contigo muy pronto.</p>
                <img src="cid:imagenArea" alt="Imagen Área" style="width:400px; margin-top:10px;"/>
                """.formatted(formulario.getArea());

            helper.setText(contenidoHtml, true);

            // ✅ Adjuntar imagen desde resources/email/
            if (imagen != null) {
                ClassPathResource resource = new ClassPathResource("email/" + imagen);
                helper.addInline("imagenArea", resource);
            }

            mailSender.send(mensaje);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // 📩 Notificación al admin
    @Async
    public void notificarAdmin(FormularioDevioz formulario) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

            helper.setTo("987536362miguel@gmail.com"); // tu correo admin
            helper.setSubject("Nuevo formulario recibido - Devíoz");

            String contenido = """
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

            helper.setText(contenido, true);

            mailSender.send(mensaje);

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    // 🔹 Método para asignar imagen según el área
    private String obtenerImagenPorArea(String area) {
        return switch (area) {
            case "Desarrollo Web" -> "web.png";
            case "Desarrollo App" -> "app.png";
            case "DevOps" -> "devops.png";
            case "AWS" -> "aws.png";
            case "Data" -> "data.png";
            default -> null;
        };
    }
}

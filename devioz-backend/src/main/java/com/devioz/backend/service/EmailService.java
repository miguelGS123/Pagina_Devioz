package com.devioz.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import com.devioz.backend.model.FormularioDevioz;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // ✅ Correo al cliente
    public void enviarCorreoConfirmacion(FormularioDevioz form) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(form.getCorreo());
        mensaje.setSubject("Gracias por contactarnos - Devioz");
        mensaje.setText("Hola " + form.getAsunto() + "!\n\n" +
                "Gracias por escribirnos. Hemos recibido tu solicitud sobre: " + form.getArea() + "\n\n" +
                "En breve nuestro equipo se pondrá en contacto contigo.\n\n" +
                "Atentamente,\nEquipo Devioz");

        mailSender.send(mensaje);
    }

    // ✅ Correo al administrador
    public void notificarAdmin(FormularioDevioz form) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo("TU_CORREO_ADMIN@gmail.com"); // cámbialo por el tuyo
        mensaje.setSubject("Nuevo formulario recibido");
        mensaje.setText("Se recibió un nuevo mensaje en el formulario:\n\n" +
                "Asunto: " + form.getAsunto() + "\n" +
                "Correo: " + form.getCorreo() + "\n" +
                "Teléfono: " + form.getTelefono() + "\n" +
                "Área: " + form.getArea() + "\n" +
                "Mensaje: " + form.getMensaje());

        mailSender.send(mensaje);
    }
}

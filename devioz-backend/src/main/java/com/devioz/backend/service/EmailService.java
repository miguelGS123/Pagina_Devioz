package com.devioz.backend.service;

import com.devioz.backend.dto.VentaRequestDTO; // <-- NUEVA IMPORTACIÓN
import com.devioz.backend.dto.VentaRequestDTO.ItemVentaRequestDTO; // <-- NUEVA IMPORTACIÓN
import com.devioz.backend.model.FormularioDevioz;
import com.devioz.backend.model.Usuario;
import com.devioz.backend.model.Venta;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.math.BigDecimal; // <-- NUEVA IMPORTACIÓN
import java.time.format.DateTimeFormatter;
import java.util.List; // <-- NUEVA IMPORTACIÓN
import java.util.concurrent.atomic.AtomicReference; // <-- NUEVA IMPORTACIÓN (para cálculo)

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // 📩 Correo de confirmación para el usuario (Formulario contacto) - MANTENIDO
    @Async
    public void enviarCorreoConfirmacion(FormularioDevioz formulario) {
        // CÓDIGO MANTENIDO (sin cambios)
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
            if (imagen != null) {
                ClassPathResource resource = new ClassPathResource("email/" + imagen);
                helper.addInline("imagenArea", resource);
            }

            mailSender.send(mensaje);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // 📩 Notificación al admin (Formulario contacto) - MANTENIDO
    @Async
    public void notificarAdmin(FormularioDevioz formulario) {
        // CÓDIGO MANTENIDO (sin cambios)
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

            helper.setTo("987536362miguel@gmail.com"); //correo admin
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

    // =================================================================================
    // 📌 MÉTODO 1: CONFIRMACIÓN DE COMPRA (COMPRA DE ÍTEM INDIVIDUAL) - MANTENIDO
    // =================================================================================
    @Async
    public void enviarConfirmacionCompra(Usuario usuario, Venta venta) {
        // CÓDIGO MANTENIDO (Funciona para el endpoint antiguo de una sola venta)
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

            helper.setTo(usuario.getEmail());
            helper.setSubject("Confirmación de tu compra #" + venta.getId() + " - Devíoz");

            String contenidoHtml = """
                <h2>¡Gracias por tu compra en Devíoz!</h2>
                <p>Hola <b>%s</b>, hemos procesado exitosamente tu pedido.</p>
                
                <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
                    <h3>📦 Detalles de tu compra</h3>
                    <p><b>Producto:</b> %s</p>
                    <p><b>Cantidad:</b> %d unidades</p>
                    <p><b>Precio unitario:</b> $%.2f</p>
                    <p><b>Total pagado:</b> $%.2f</p>
                    <p><b>Número de pedido:</b> #%d</p>
                    <p><b>Fecha:</b> %s</p>
                </div>
                
                <p>Tu pedido será procesado y enviado en un plazo de 24-48 horas.</p>
                <p>Si tienes alguna pregunta, responde a este correo.</p>
                """.formatted(
                        usuario.getNombre(),
                        venta.getProducto().getNombre(),
                        venta.getCantidad(),
                        venta.getProducto().getPrecio(),
                        venta.getTotal(),
                        venta.getId(),
                        venta.getFecha().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                );

            helper.setText(contenidoHtml, true);
            mailSender.send(mensaje);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // =================================================================================
    // 📌 MÉTODO 2: CONFIRMACIÓN DE CHECKOUT FORMAL (NUEVO MÉTODO SOBRECARGADO)
    //    Este método usa la información del DTO para incluir los detalles de la entrega.
    // =================================================================================
    @Async
    public void enviarConfirmacionCompra(Usuario usuario, VentaRequestDTO ventaRequest, List<Venta> ventasGuardadas) { // <-- NUEVA FIRMA
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

            helper.setTo(usuario.getEmail());
            helper.setSubject("Confirmación de tu compra (Checkout) - Devíoz");

            // Calcular el total general de la orden
            BigDecimal totalGeneral = ventasGuardadas.stream()
                .map(Venta::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            // Construir la lista de ítems comprados
            StringBuilder itemsHtml = new StringBuilder();
            ventasGuardadas.forEach(venta -> {
                itemsHtml.append(String.format(
                    "<li>%d x %s ($%.2f c/u)</li>",
                    venta.getCantidad(),
                    venta.getProducto().getNombre(),
                    venta.getProducto().getPrecio()
                ));
            });
            
            String contenidoHtml = """
                <h2>¡Tu pedido ha sido confirmado!</h2>
                <p>Hola <b>%s</b>, hemos recibido tu compra con los siguientes detalles:</p>
                
                <div style="background: #e6f7ff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                    <h3>📦 Resumen del Pedido (#%d)</h3>
                    <ul>%s</ul>
                    <hr style="border-top: 1px solid #ccc;"/>
                    <p style="font-size: 1.1em;"><b>TOTAL A PAGAR:</b> $%.2f</p>
                </div>

                <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
                    <h3>📍 Datos de Entrega</h3>
                    <p><b>Contacto:</b> %s (%s)</p>
                    <p><b>Método:</b> %s</p>
                    <p><b>Dirección de entrega:</b> %s</p>
                </div>
                
                <p style="margin-top: 20px; color: #cc0000;">
                    <b>¡Importante!</b> En breve nos comunicaremos contigo al número %s para coordinar la contra entrega del producto.
                </p>
                """.formatted(
                    usuario.getNombre(),
                    ventasGuardadas.get(0).getId(), // Usamos el ID de la primera venta como referencia de pedido
                    itemsHtml.toString(),
                    totalGeneral,
                    ventaRequest.getNombreCliente(),
                    ventaRequest.getTelefonoCliente(),
                    ventaRequest.getTipoEntrega().replace("_", " "), // Limpiar el nombre de la entrega
                    ventaRequest.getDireccionEntrega(),
                    ventaRequest.getTelefonoCliente()
                );

            helper.setText(contenidoHtml, true);
            mailSender.send(mensaje);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Método para asignar imagen según el área - MANTENIDO
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
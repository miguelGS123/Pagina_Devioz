package com.devioz.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "formulario_devioz")
public class FormularioDevioz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 30, nullable = false)
    private String asunto;

    @Column(nullable = false)
    private String correo;

    @Column(length = 50, nullable = false)
    private String area;  // ✅ coincide con frontend

    @Column(length = 500, nullable = false)
    private String mensaje;
}

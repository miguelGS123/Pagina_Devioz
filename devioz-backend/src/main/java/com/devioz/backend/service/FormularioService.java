package com.devioz.backend.service;

import com.devioz.backend.model.FormularioDevioz;
import com.devioz.backend.repository.FormularioRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FormularioService {

    private final FormularioRepository repository;

    public FormularioService(FormularioRepository repository) {
        this.repository = repository;
    }

    public List<FormularioDevioz> listar() {
        return repository.findAll();
    }

    public FormularioDevioz guardar(FormularioDevioz form) {
        return repository.save(form);
    }
}

package br.com.senai.sistema_trocas.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.senai.sistema_trocas.entities.Curso;
import br.com.senai.sistema_trocas.repositories.CursoRepository;

@Service
public class CursoService {

    @Autowired
    private CursoRepository cursoRepository;

    public List<Curso> findAll() {
        return cursoRepository.findAll();
    }

    public Curso findById(Integer id) {
        return cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso não encontrado com ID: " + id));
    }

    public Curso insert(Curso curso) {
        return cursoRepository.save(curso);
    }

    public Curso update(Integer id, Curso cursoAtualizado) {
        Curso curso = findById(id);
        curso.setNome(cursoAtualizado.getNome());
        return cursoRepository.save(curso);
    }

    public void delete(Integer id) {
        if (!cursoRepository.existsById(id)) {
            throw new RuntimeException("Curso não encontrado com ID: " + id);
        }
        cursoRepository.deleteById(id);
    }
}

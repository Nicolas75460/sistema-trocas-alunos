package br.com.senai.sistema_trocas.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.senai.sistema_trocas.entities.Aluno;
import br.com.senai.sistema_trocas.repositories.AlunoRepository;

@Service
public class AlunoService {

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private BCryptPasswordEncoder encoder;

    public List<Aluno> findAll() {
        return alunoRepository.findAll();
    }

    public Aluno findById(Integer id) {
        return alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com ID: " + id));
    }

    public Aluno insert(Aluno aluno) {
        if (alunoRepository.findByEmail(aluno.getEmail()) != null) {
            throw new RuntimeException("Email já cadastrado");
        }
        aluno.setSenha(encoder.encode(aluno.getSenha()));
        return alunoRepository.save(aluno);
    }

    public Aluno update(Integer id, Aluno alunoAtualizado) {
        Aluno aluno = findById(id);

        if (!aluno.getEmail().equals(alunoAtualizado.getEmail())
                && alunoRepository.findByEmail(alunoAtualizado.getEmail()) != null) {
            throw new RuntimeException("Email já cadastrado");
        }

        aluno.setNome(alunoAtualizado.getNome());
        aluno.setEmail(alunoAtualizado.getEmail());

        if (alunoAtualizado.getSenha() != null && !alunoAtualizado.getSenha().isEmpty()) {
            aluno.setSenha(encoder.encode(alunoAtualizado.getSenha()));
        }

        aluno.setCurso(alunoAtualizado.getCurso());

        return alunoRepository.save(aluno);
    }

    public void delete(Integer id) {
        if (!alunoRepository.existsById(id)) {
            throw new RuntimeException("Aluno não encontrado com ID: " + id);
        }
        alunoRepository.deleteById(id);
    }

    public Aluno findByEmail(String email) {
        return alunoRepository.findByEmail(email);
    }

    public Aluno login(String email, String senha) {
        Aluno aluno = alunoRepository.findByEmail(email);
        if (aluno != null && encoder.matches(senha, aluno.getSenha())) {
            return aluno;
        }
        return null;
    }
}

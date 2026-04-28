package br.com.senai.sistema_trocas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.senai.sistema_trocas.entities.Aluno;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Integer> {

    Aluno findByEmail(String email);

    Aluno findByEmailAndSenha(String email, String senha);

    boolean existsByEmail(String email);
}

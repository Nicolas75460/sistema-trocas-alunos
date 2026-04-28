package br.com.senai.sistema_trocas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.senai.sistema_trocas.entities.Curso;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Integer> {
}

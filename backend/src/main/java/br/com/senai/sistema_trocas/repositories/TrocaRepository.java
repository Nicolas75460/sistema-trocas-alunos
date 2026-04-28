package br.com.senai.sistema_trocas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import br.com.senai.sistema_trocas.entities.Troca;

@Repository
public interface TrocaRepository extends JpaRepository<Troca, Integer> {

    List<Troca> findBySolicitanteId(Integer alunoId);

    List<Troca> findByReceptorId(Integer alunoId);

    List<Troca> findByStatus(Troca.StatusTroca status);
}

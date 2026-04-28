package br.com.senai.sistema_trocas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import br.com.senai.sistema_trocas.entities.Mensagem;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Integer> {

    List<Mensagem> findByTrocaId(Integer trocaId);

    List<Mensagem> findByRemetenteId(Integer alunoId);

    List<Mensagem> findByDestinatarioId(Integer alunoId);
}

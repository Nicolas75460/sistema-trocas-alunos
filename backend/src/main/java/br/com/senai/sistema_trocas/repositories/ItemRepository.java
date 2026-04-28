package br.com.senai.sistema_trocas.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import br.com.senai.sistema_trocas.entities.Item;

@Repository
public interface ItemRepository extends JpaRepository<Item, Integer> {

    List<Item> findByAlunoId(Integer alunoId);

    List<Item> findByCategoriaId(Integer categoriaId);
}

package br.com.senai.sistema_trocas.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.senai.sistema_trocas.entities.ImagemItem;

@Repository
public interface ImagemItemRepository extends JpaRepository<ImagemItem, Integer> {

    List<ImagemItem> findByItemId(Integer itemId);
}

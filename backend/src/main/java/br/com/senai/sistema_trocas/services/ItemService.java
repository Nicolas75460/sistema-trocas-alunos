package br.com.senai.sistema_trocas.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.senai.sistema_trocas.entities.Item;
import br.com.senai.sistema_trocas.repositories.ItemRepository;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    public List<Item> findAll() {
        return itemRepository.findAll();
    }

    public List<Item> findByAlunoId(Integer alunoId) {
        return itemRepository.findByAlunoId(alunoId);
    }

    public List<Item> findByCategoriaId(Integer categoriaId) {
        return itemRepository.findByCategoriaId(categoriaId);
    }

    public Item findById(Integer id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item não encontrado com ID: " + id));
    }

    public Item insert(Item item) {
        return itemRepository.save(item);
    }

    public Item update(Integer id, Item itemAtualizado) {
        Item item = findById(id);
        item.setNome(itemAtualizado.getNome());
        item.setDescricao(itemAtualizado.getDescricao());
        item.setAluno(itemAtualizado.getAluno());
        item.setCategoria(itemAtualizado.getCategoria());
        return itemRepository.save(item);
    }

    public void delete(Integer id) {
        if (!itemRepository.existsById(id)) {
            throw new RuntimeException("Item não encontrado com ID: " + id);
        }
        itemRepository.deleteById(id);
    }
}

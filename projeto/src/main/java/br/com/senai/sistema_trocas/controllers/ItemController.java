package br.com.senai.sistema_trocas.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.senai.sistema_trocas.entities.Item;
import br.com.senai.sistema_trocas.services.ItemService;

import java.util.List;

@RestController
@RequestMapping("/itens")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @GetMapping
    public ResponseEntity<List<Item>> findAll() {
        return ResponseEntity.ok(itemService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(itemService.findById(id));
    }

    @GetMapping("/aluno")
    public ResponseEntity<List<Item>> findByAlunoId(@RequestParam("value") Integer alunoId) {
        return ResponseEntity.ok(itemService.findByAlunoId(alunoId));
    }

    @GetMapping("/categoria")
    public ResponseEntity<List<Item>> findByCategoriaId(@RequestParam("value") Integer categoriaId) {
        return ResponseEntity.ok(itemService.findByCategoriaId(categoriaId));
    }

    @PostMapping("/cadastro")
    public ResponseEntity<Item> insert(@RequestBody Item item) {
        Item novo = itemService.insert(item);
        return ResponseEntity.ok(novo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Item> update(@PathVariable Integer id, @RequestBody Item itemAtualizado) {
        Item atualizado = itemService.update(id, itemAtualizado);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        itemService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

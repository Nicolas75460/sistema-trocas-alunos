package br.com.senai.sistema_trocas.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.senai.sistema_trocas.entities.ImagemItem;
import br.com.senai.sistema_trocas.services.ImagemItemService;

import java.util.List;

@RestController
@RequestMapping("/imagens")
public class ImagemItemController {

    @Autowired
    private ImagemItemService imagemItemService;

    @GetMapping
    public ResponseEntity<List<ImagemItem>> findAll() {
        return ResponseEntity.ok(imagemItemService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImagemItem> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(imagemItemService.findById(id));
    }

    @GetMapping("/item")
    public ResponseEntity<List<ImagemItem>> findByItemId(@RequestParam("value") Integer itemId) {
        return ResponseEntity.ok(imagemItemService.findByItemId(itemId));
    }

    @PostMapping("/cadastro")
    public ResponseEntity<ImagemItem> insert(@RequestBody ImagemItem imagemItem) {
        ImagemItem nova = imagemItemService.insert(imagemItem);
        return ResponseEntity.ok(nova);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ImagemItem> update(@PathVariable Integer id, @RequestBody ImagemItem imagemAtualizada) {
        ImagemItem atualizada = imagemItemService.update(id, imagemAtualizada);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        imagemItemService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

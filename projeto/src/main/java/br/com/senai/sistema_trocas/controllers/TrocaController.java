package br.com.senai.sistema_trocas.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.senai.sistema_trocas.entities.Troca;
import br.com.senai.sistema_trocas.services.TrocaService;

import java.util.List;

@RestController
@RequestMapping("/trocas")
public class TrocaController {

    @Autowired
    private TrocaService trocaService;

    @GetMapping
    public ResponseEntity<List<Troca>> findAll() {
        return ResponseEntity.ok(trocaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Troca> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(trocaService.findById(id));
    }

    @GetMapping("/solicitante")
    public ResponseEntity<List<Troca>> findBySolicitanteId(@RequestParam("value") Integer alunoId) {
        return ResponseEntity.ok(trocaService.findBySolicitanteId(alunoId));
    }

    @GetMapping("/receptor")
    public ResponseEntity<List<Troca>> findByReceptorId(@RequestParam("value") Integer alunoId) {
        return ResponseEntity.ok(trocaService.findByReceptorId(alunoId));
    }

    @GetMapping("/status")
    public ResponseEntity<List<Troca>> findByStatus(@RequestParam("value") Troca.StatusTroca status) {
        return ResponseEntity.ok(trocaService.findByStatus(status));
    }

    @PostMapping("/cadastro")
    public ResponseEntity<Troca> insert(@RequestBody Troca troca) {
        Troca nova = trocaService.insert(troca);
        return ResponseEntity.ok(nova);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Troca> updateStatus(@PathVariable Integer id, @RequestParam("value") Troca.StatusTroca status) {
        Troca atualizada = trocaService.updateStatus(id, status);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        trocaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

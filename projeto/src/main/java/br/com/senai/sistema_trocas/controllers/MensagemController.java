package br.com.senai.sistema_trocas.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.senai.sistema_trocas.entities.Mensagem;
import br.com.senai.sistema_trocas.services.MensagemService;

import java.util.List;

@RestController
@RequestMapping("/mensagens")
public class MensagemController {

    @Autowired
    private MensagemService mensagemService;

    @GetMapping
    public ResponseEntity<List<Mensagem>> findAll() {
        return ResponseEntity.ok(mensagemService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mensagem> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(mensagemService.findById(id));
    }

    @GetMapping("/troca")
    public ResponseEntity<List<Mensagem>> findByTrocaId(@RequestParam("value") Integer trocaId) {
        return ResponseEntity.ok(mensagemService.findByTrocaId(trocaId));
    }

    @GetMapping("/remetente")
    public ResponseEntity<List<Mensagem>> findByRemetenteId(@RequestParam("value") Integer alunoId) {
        return ResponseEntity.ok(mensagemService.findByRemetenteId(alunoId));
    }

    @GetMapping("/destinatario")
    public ResponseEntity<List<Mensagem>> findByDestinatarioId(@RequestParam("value") Integer alunoId) {
        return ResponseEntity.ok(mensagemService.findByDestinatarioId(alunoId));
    }

    @PostMapping("/cadastro")
    public ResponseEntity<Mensagem> insert(@RequestBody Mensagem mensagem) {
        Mensagem nova = mensagemService.insert(mensagem);
        return ResponseEntity.ok(nova);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mensagem> update(@PathVariable Integer id, @RequestBody Mensagem mensagemAtualizada) {
        Mensagem atualizada = mensagemService.update(id, mensagemAtualizada);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        mensagemService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

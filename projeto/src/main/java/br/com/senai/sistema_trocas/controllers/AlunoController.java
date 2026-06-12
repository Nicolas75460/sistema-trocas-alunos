package br.com.senai.sistema_trocas.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.senai.sistema_trocas.entities.Aluno;
import br.com.senai.sistema_trocas.services.AlunoService;

import java.util.List;

@RestController
@RequestMapping("/alunos")
public class AlunoController {

    @Autowired
    private AlunoService alunoService;

    @GetMapping
    public ResponseEntity<List<Aluno>> findAll() {
        return ResponseEntity.ok(alunoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aluno> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(alunoService.findById(id));
    }

    @PostMapping("/cadastro")
    public ResponseEntity<Aluno> insert(@RequestBody Aluno aluno) {
        Aluno novo = alunoService.insert(aluno);
        return ResponseEntity.ok(novo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Aluno> update(@PathVariable Integer id, @RequestBody Aluno alunoAtualizado) {
        Aluno atualizado = alunoService.update(id, alunoAtualizado);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        alunoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/email")
    public ResponseEntity<Aluno> findByEmail(@RequestParam("value") String email) {
        Aluno aluno = alunoService.findByEmail(email);
        if (aluno == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(aluno);
    }

    @GetMapping("/login")
    public ResponseEntity<Aluno> login(@RequestParam("email") String email, @RequestParam("senha") String senha) {
        Aluno aluno = alunoService.login(email, senha);
        if (aluno == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(aluno);
    }
}

package br.com.senai.sistema_trocas.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_aluno")
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_aluno")
    private Integer id;

    @Column(name = "nome_aluno", nullable = false, length = 200)
    private String nome;

    @Column(name = "email", nullable = false, unique = true, length = 200)
    private String email;

    @Column(name = "senha", nullable = false, length = 50)
    private String senha;

    @ManyToOne
    @JoinColumn(name = "tb_curso_id_curso", nullable = false)
    private Curso curso;

    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Item> itens = new ArrayList<>();

    @OneToMany(mappedBy = "solicitante", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Troca> trocasSolicitadas = new ArrayList<>();

    @OneToMany(mappedBy = "receptor", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Troca> trocasRecebidas = new ArrayList<>();

    @OneToMany(mappedBy = "remetente", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Mensagem> mensagensEnviadas = new ArrayList<>();

    @OneToMany(mappedBy = "destinatario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Mensagem> mensagensRecebidas = new ArrayList<>();

    public Aluno() {
    }

    public Aluno(Integer id, String nome, String email, String senha, Curso curso, List<Item> itens,
            List<Troca> trocasSolicitadas, List<Troca> trocasRecebidas, List<Mensagem> mensagensEnviadas,
            List<Mensagem> mensagensRecebidas) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.curso = curso;
        this.itens = itens;
        this.trocasSolicitadas = trocasSolicitadas;
        this.trocasRecebidas = trocasRecebidas;
        this.mensagensEnviadas = mensagensEnviadas;
        this.mensagensRecebidas = mensagensRecebidas;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public Curso getCurso() {
        return curso;
    }

    public void setCurso(Curso curso) {
        this.curso = curso;
    }

    public List<Item> getItens() {
        return itens;
    }

    public void setItens(List<Item> itens) {
        this.itens = itens;
    }

    public List<Troca> getTrocasSolicitadas() {
        return trocasSolicitadas;
    }

    public void setTrocasSolicitadas(List<Troca> trocasSolicitadas) {
        this.trocasSolicitadas = trocasSolicitadas;
    }

    public List<Troca> getTrocasRecebidas() {
        return trocasRecebidas;
    }

    public void setTrocasRecebidas(List<Troca> trocasRecebidas) {
        this.trocasRecebidas = trocasRecebidas;
    }

    public List<Mensagem> getMensagensEnviadas() {
        return mensagensEnviadas;
    }

    public void setMensagensEnviadas(List<Mensagem> mensagensEnviadas) {
        this.mensagensEnviadas = mensagensEnviadas;
    }

    public List<Mensagem> getMensagensRecebidas() {
        return mensagensRecebidas;
    }

    public void setMensagensRecebidas(List<Mensagem> mensagensRecebidas) {
        this.mensagensRecebidas = mensagensRecebidas;
    }
}

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
@Table(name = "tb_item")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_item")
    private Integer id;

    @Column(name = "nome_item", nullable = false, length = 200)
    private String nome;

    @Column(name = "descricao", length = 500)
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "tb_aluno_id_aluno", nullable = false)
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "tb_categoria_id_categoria", nullable = false)
    private Categoria categoria;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ImagemItem> imagens = new ArrayList<>();

    @OneToMany(mappedBy = "itemOfertado", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Troca> trocasOfertadas = new ArrayList<>();

    @OneToMany(mappedBy = "itemDesejado", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Troca> trocasDesejadas = new ArrayList<>();

    public Item() {
    }

    public Item(Integer id, String nome, String descricao, Aluno aluno, Categoria categoria, List<ImagemItem> imagens,
            List<Troca> trocasOfertadas, List<Troca> trocasDesejadas) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.aluno = aluno;
        this.categoria = categoria;
        this.imagens = imagens;
        this.trocasOfertadas = trocasOfertadas;
        this.trocasDesejadas = trocasDesejadas;
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

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Aluno getAluno() {
        return aluno;
    }

    public void setAluno(Aluno aluno) {
        this.aluno = aluno;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public List<ImagemItem> getImagens() {
        return imagens;
    }

    public void setImagens(List<ImagemItem> imagens) {
        this.imagens = imagens;
    }

    public List<Troca> getTrocasOfertadas() {
        return trocasOfertadas;
    }

    public void setTrocasOfertadas(List<Troca> trocasOfertadas) {
        this.trocasOfertadas = trocasOfertadas;
    }

    public List<Troca> getTrocasDesejadas() {
        return trocasDesejadas;
    }

    public void setTrocasDesejadas(List<Troca> trocasDesejadas) {
        this.trocasDesejadas = trocasDesejadas;
    }
}

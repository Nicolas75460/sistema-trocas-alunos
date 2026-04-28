package br.com.senai.sistema_trocas.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.EnumType;

@Entity
@Table(name = "tb_troca")
public class Troca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_troca")
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 10)
    private StatusTroca status;

    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    @ManyToOne
    @JoinColumn(name = "tb_aluno_id_solicitante", nullable = false)
    private Aluno solicitante;

    @ManyToOne
    @JoinColumn(name = "tb_aluno_id_receptor", nullable = false)
    private Aluno receptor;

    @ManyToOne
    @JoinColumn(name = "tb_item_id_item_ofertado", nullable = false)
    private Item itemOfertado;

    @ManyToOne
    @JoinColumn(name = "tb_item_id_item_desejado", nullable = false)
    private Item itemDesejado;

    @OneToMany(mappedBy = "troca", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Mensagem> mensagens = new ArrayList<>();

    public Troca() {
    }

    public Troca(Integer id, StatusTroca status, LocalDateTime dataCriacao, Aluno solicitante, Aluno receptor,
            Item itemOfertado, Item itemDesejado, List<Mensagem> mensagens) {
        this.id = id;
        this.status = status;
        this.dataCriacao = dataCriacao;
        this.solicitante = solicitante;
        this.receptor = receptor;
        this.itemOfertado = itemOfertado;
        this.itemDesejado = itemDesejado;
        this.mensagens = mensagens;
    }

    public enum StatusTroca {
        PENDENTE, ACEITA, RECUSADA
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public StatusTroca getStatus() {
        return status;
    }

    public void setStatus(StatusTroca status) {
        this.status = status;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public Aluno getSolicitante() {
        return solicitante;
    }

    public void setSolicitante(Aluno solicitante) {
        this.solicitante = solicitante;
    }

    public Aluno getReceptor() {
        return receptor;
    }

    public void setReceptor(Aluno receptor) {
        this.receptor = receptor;
    }

    public Item getItemOfertado() {
        return itemOfertado;
    }

    public void setItemOfertado(Item itemOfertado) {
        this.itemOfertado = itemOfertado;
    }

    public Item getItemDesejado() {
        return itemDesejado;
    }

    public void setItemDesejado(Item itemDesejado) {
        this.itemDesejado = itemDesejado;
    }

    public List<Mensagem> getMensagens() {
        return mensagens;
    }

    public void setMensagens(List<Mensagem> mensagens) {
        this.mensagens = mensagens;
    }
}

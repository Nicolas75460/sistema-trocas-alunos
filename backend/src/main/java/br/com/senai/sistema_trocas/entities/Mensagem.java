package br.com.senai.sistema_trocas.entities;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_mensagem")
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mensagem")
    private Integer id;

    @Lob
    @Column(name = "mensagem", nullable = false)
    private String mensagem;

    @Column(name = "data_envio", nullable = false)
    private LocalDateTime dataEnvio;

    @ManyToOne
    @JoinColumn(name = "tb_aluno_id_remetente", nullable = false)
    private Aluno remetente;

    @ManyToOne
    @JoinColumn(name = "tb_aluno_id_destinatario", nullable = false)
    private Aluno destinatario;

    @ManyToOne
    @JoinColumn(name = "tb_troca_id_troca", nullable = false)
    private Troca troca;

    public Mensagem() {
    }

    public Mensagem(Integer id, String mensagem, LocalDateTime dataEnvio, Aluno remetente, Aluno destinatario, Troca troca) {
        this.id = id;
        this.mensagem = mensagem;
        this.dataEnvio = dataEnvio;
        this.remetente = remetente;
        this.destinatario = destinatario;
        this.troca = troca;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public LocalDateTime getDataEnvio() {
        return dataEnvio;
    }

    public void setDataEnvio(LocalDateTime dataEnvio) {
        this.dataEnvio = dataEnvio;
    }

    public Aluno getRemetente() {
        return remetente;
    }

    public void setRemetente(Aluno remetente) {
        this.remetente = remetente;
    }

    public Aluno getDestinatario() {
        return destinatario;
    }

    public void setDestinatario(Aluno destinatario) {
        this.destinatario = destinatario;
    }

    public Troca getTroca() {
        return troca;
    }

    public void setTroca(Troca troca) {
        this.troca = troca;
    }
}

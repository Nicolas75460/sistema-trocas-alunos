package br.com.senai.sistema_trocas.entities;

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
@Table(name = "tb_imagem_item")
public class ImagemItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_imagem")
    private Integer id;

    @Lob
    @Column(name = "url_imagem")
    @JsonIgnore
    private byte[] urlImagem;

    @ManyToOne
    @JoinColumn(name = "tb_item_id_item", nullable = false)
    private Item item;

    public ImagemItem() {
    }

    public ImagemItem(Integer id, byte[] urlImagem, Item item) {
        this.id = id;
        this.urlImagem = urlImagem;
        this.item = item;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public byte[] getUrlImagem() {
        return urlImagem;
    }

    public void setUrlImagem(byte[] urlImagem) {
        this.urlImagem = urlImagem;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }
}

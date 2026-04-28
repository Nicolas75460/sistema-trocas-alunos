package br.com.senai.sistema_trocas.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.senai.sistema_trocas.entities.ImagemItem;
import br.com.senai.sistema_trocas.repositories.ImagemItemRepository;

@Service
public class ImagemItemService {

    @Autowired
    private ImagemItemRepository imagemItemRepository;

    public List<ImagemItem> findAll() {
        return imagemItemRepository.findAll();
    }

    public List<ImagemItem> findByItemId(Integer itemId) {
        return imagemItemRepository.findByItemId(itemId);
    }

    public ImagemItem findById(Integer id) {
        return imagemItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Imagem não encontrada com ID: " + id));
    }

    public ImagemItem insert(ImagemItem imagemItem) {
        return imagemItemRepository.save(imagemItem);
    }

    public ImagemItem update(Integer id, ImagemItem imagemAtualizada) {
        ImagemItem imagem = findById(id);
        imagem.setUrlImagem(imagemAtualizada.getUrlImagem());
        imagem.setItem(imagemAtualizada.getItem());
        return imagemItemRepository.save(imagem);
    }

    public void delete(Integer id) {
        if (!imagemItemRepository.existsById(id)) {
            throw new RuntimeException("Imagem não encontrada com ID: " + id);
        }
        imagemItemRepository.deleteById(id);
    }
}

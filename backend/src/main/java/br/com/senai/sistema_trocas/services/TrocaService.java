package br.com.senai.sistema_trocas.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.senai.sistema_trocas.entities.Troca;
import br.com.senai.sistema_trocas.repositories.TrocaRepository;

@Service
public class TrocaService {

    @Autowired
    private TrocaRepository trocaRepository;

    public List<Troca> findAll() {
        return trocaRepository.findAll();
    }

    public List<Troca> findBySolicitanteId(Integer alunoId) {
        return trocaRepository.findBySolicitanteId(alunoId);
    }

    public List<Troca> findByReceptorId(Integer alunoId) {
        return trocaRepository.findByReceptorId(alunoId);
    }

    public List<Troca> findByStatus(Troca.StatusTroca status) {
        return trocaRepository.findByStatus(status);
    }

    public Troca findById(Integer id) {
        return trocaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Troca não encontrada com ID: " + id));
    }

    public Troca insert(Troca troca) {
        if (troca.getSolicitante().getId().equals(troca.getReceptor().getId())) {
            throw new RuntimeException("Solicitante e receptor não podem ser a mesma pessoa");
        }
        if (troca.getItemOfertado().getId().equals(troca.getItemDesejado().getId())) {
            throw new RuntimeException("Item ofertado e item desejado não podem ser iguais");
        }
        troca.setDataCriacao(LocalDateTime.now());
        troca.setStatus(Troca.StatusTroca.PENDENTE);
        return trocaRepository.save(troca);
    }

    public Troca updateStatus(Integer id, Troca.StatusTroca status) {
        Troca troca = findById(id);
        if (status == Troca.StatusTroca.ACEITA || status == Troca.StatusTroca.RECUSADA) {
            if (troca.getStatus() != Troca.StatusTroca.PENDENTE) {
                throw new RuntimeException("Só é possível aceitar/recusar trocas pendentes");
            }
            troca.setStatus(status);
        } else {
            throw new RuntimeException("Status inválido");
        }
        return trocaRepository.save(troca);
    }

    public void delete(Integer id) {
        Troca troca = findById(id);
        if (troca.getStatus() != Troca.StatusTroca.PENDENTE) {
            throw new RuntimeException("Só é possível deletar trocas pendentes");
        }
        trocaRepository.deleteById(id);
    }
}

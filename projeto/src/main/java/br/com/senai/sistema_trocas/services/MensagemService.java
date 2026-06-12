package br.com.senai.sistema_trocas.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.senai.sistema_trocas.entities.Mensagem;
import br.com.senai.sistema_trocas.repositories.MensagemRepository;

@Service
public class MensagemService {

    @Autowired
    private MensagemRepository mensagemRepository;

    public List<Mensagem> findAll() {
        return mensagemRepository.findAll();
    }

    public List<Mensagem> findByTrocaId(Integer trocaId) {
        return mensagemRepository.findByTrocaId(trocaId);
    }

    public List<Mensagem> findByRemetenteId(Integer alunoId) {
        return mensagemRepository.findByRemetenteId(alunoId);
    }

    public List<Mensagem> findByDestinatarioId(Integer alunoId) {
        return mensagemRepository.findByDestinatarioId(alunoId);
    }

    public Mensagem findById(Integer id) {
        return mensagemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mensagem nao encontrada com ID: " + id));
    }

    public Mensagem insert(Mensagem mensagem) {
        if (mensagem.getRemetente().getId().equals(mensagem.getDestinatario().getId())) {
            throw new RuntimeException("Remetente e destinatario nao podem ser a mesma pessoa");
        }
        mensagem.setDataEnvio(java.time.LocalDateTime.now());
        return mensagemRepository.save(mensagem);
    }

    public Mensagem update(Integer id, Mensagem mensagemAtualizada) {
        Mensagem mensagem = findById(id);
        if (!mensagem.getRemetente().getId().equals(mensagemAtualizada.getRemetente().getId())) {
            throw new RuntimeException("Nao e possivel alterar o remetente");
        }
        if (!mensagem.getTroca().getId().equals(mensagemAtualizada.getTroca().getId())) {
            throw new RuntimeException("Nao e possivel alterar a troca");
        }
        mensagem.setMensagem(mensagemAtualizada.getMensagem());
        return mensagemRepository.save(mensagem);
    }

    public void delete(Integer id) {
        if (!mensagemRepository.existsById(id)) {
            throw new RuntimeException("Mensagem nao encontrada com ID: " + id);
        }
        mensagemRepository.deleteById(id);
    }
}

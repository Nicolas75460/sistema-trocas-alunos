package br.com.senai.sistema_trocas.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import br.com.senai.sistema_trocas.entities.Curso;
import br.com.senai.sistema_trocas.entities.Categoria;
import br.com.senai.sistema_trocas.repositories.CursoRepository;
import br.com.senai.sistema_trocas.repositories.CategoriaRepository;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CursoRepository cursoRepository;
    private final CategoriaRepository categoriaRepository;

    // Nomes corretos dos cursos com caracteres unicode escapados
    private static final String[] NOMES_CURSOS = {
        "Desenvolvimento de Sistemas",
        "Eletrot\u00e9cnica",
        "Mec\u00e2nica",
        "Administra\u00e7\u00e3o"
    };

    // Nomes corretos das categorias com caracteres unicode escapados
    private static final String[] NOMES_CATEGORIAS = {
        "Ferramentas",
        "Livros",
        "Componentes Eletr\u00f4nicos",
        "Outros"
    };

    public DataInitializer(CursoRepository cursoRepository, CategoriaRepository categoriaRepository) {
        this.cursoRepository = cursoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        initCursos();
        initCategorias();
    }

    private void initCursos() {
        List<Curso> cursosExistentes = cursoRepository.findAll();

        if (cursosExistentes.isEmpty()) {
            // Tabela vazia: inserir todos os cursos
            for (String nome : NOMES_CURSOS) {
                Curso c = new Curso();
                c.setNome(nome);
                cursoRepository.save(c);
            }
            System.out.println("[DataInitializer] Cursos inseridos: " + NOMES_CURSOS.length);
        } else {
            // Tabela ja tem dados: corrigir nomes com caracteres corrompidos
            boolean alterado = false;
            for (Curso c : cursosExistentes) {
                String nomeCorrigido = corrigirNomeCurso(c.getNome());
                if (nomeCorrigido != null && !nomeCorrigido.equals(c.getNome())) {
                    c.setNome(nomeCorrigido);
                    cursoRepository.save(c);
                    alterado = true;
                    System.out.println("[DataInitializer] Curso corrigido: " + nomeCorrigido);
                }
            }
            if (!alterado) {
                System.out.println("[DataInitializer] Cursos ja estao com nomes corretos.");
            }
        }
    }

    private void initCategorias() {
        List<Categoria> categoriasExistentes = categoriaRepository.findAll();

        if (categoriasExistentes.isEmpty()) {
            // Tabela vazia: inserir todas as categorias
            for (String nome : NOMES_CATEGORIAS) {
                Categoria cat = new Categoria();
                cat.setNome(nome);
                categoriaRepository.save(cat);
            }
            System.out.println("[DataInitializer] Categorias inseridas: " + NOMES_CATEGORIAS.length);
        } else {
            // Tabela ja tem dados: corrigir nomes com caracteres corrompidos
            boolean alterado = false;
            for (Categoria cat : categoriasExistentes) {
                String nomeCorrigido = corrigirNomeCategoria(cat.getNome());
                if (nomeCorrigido != null && !nomeCorrigido.equals(cat.getNome())) {
                    cat.setNome(nomeCorrigido);
                    categoriaRepository.save(cat);
                    alterado = true;
                    System.out.println("[DataInitializer] Categoria corrigida: " + nomeCorrigido);
                }
            }
            if (!alterado) {
                System.out.println("[DataInitializer] Categorias ja estao com nomes corretos.");
            }
        }
    }

    /**
     * Identifica um curso pelo nome (mesmo corrompido) e retorna o nome correto.
     * Usa substrings sem acentos para identificar o curso independente do encoding.
     */
    private String corrigirNomeCurso(String nomeAtual) {
        if (nomeAtual == null) return null;
        String lower = nomeAtual.toLowerCase();

        if (lower.contains("desenvolvimento") || lower.contains("sistemas") || lower.contains("ds")) {
            return "Desenvolvimento de Sistemas";
        } else if (lower.contains("eletro") || lower.contains("eletrot")) {
            return "Eletrot\u00e9cnica";
        } else if (lower.contains("mec") && (lower.contains("nica") || lower.contains("anica"))) {
            return "Mec\u00e2nica";
        } else if (lower.contains("admin") || lower.contains("istrac")) {
            return "Administra\u00e7\u00e3o";
        }
        return nomeAtual; // nao reconhecido, manter como esta
    }

    /**
     * Identifica uma categoria pelo nome e retorna o nome correto.
     */
    private String corrigirNomeCategoria(String nomeAtual) {
        if (nomeAtual == null) return null;
        String lower = nomeAtual.toLowerCase();

        if (lower.contains("ferram")) {
            return "Ferramentas";
        } else if (lower.contains("livro")) {
            return "Livros";
        } else if (lower.contains("eletr") || lower.contains("compon")) {
            return "Componentes Eletr\u00f4nicos";
        } else if (lower.contains("outro")) {
            return "Outros";
        }
        return nomeAtual;
    }
}

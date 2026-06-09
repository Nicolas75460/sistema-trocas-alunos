/**
 * api.js — Módulo central de comunicação com o backend Spring Boot (porta 8080)
 * Todas as páginas devem carregar este arquivo ANTES dos seus próprios scripts.
 */

const API_BASE = 'http://localhost:8080';

// ─── AUTH / SESSION ──────────────────────────────────────────────────────────
/**
 * Salva o aluno logado no sessionStorage.
 * @param {Object} aluno
 */
function salvarSessao(aluno) {
    sessionStorage.setItem('alunoLogado', JSON.stringify(aluno));
}

/**
 * Retorna o aluno logado ou null.
 * @returns {Object|null}
 */
function getSessao() {
    const dado = sessionStorage.getItem('alunoLogado');
    return dado ? JSON.parse(dado) : null;
}

/**
 * Remove a sessão (logout).
 */
function encerrarSessao() {
    sessionStorage.removeItem('alunoLogado');
    window.location.href = 'login.html';
}

/**
 * Redireciona para login se não houver sessão.
 * Use nas páginas que exigem login.
 */
function exigirLogin() {
    if (!getSessao()) {
        window.location.href = 'login.html';
    }
}

// ─── HELPER ──────────────────────────────────────────────────────────────────
/**
 * Wrapper para fetch com tratamento padrão de erros.
 * @param {string} url
 * @param {RequestInit} options
 * @returns {Promise<any>}
 */
async function apiFetch(url, options = {}) {
    const defaultHeaders = { 'Content-Type': 'application/json' };
    const config = {
        ...options,
        headers: { ...defaultHeaders, ...(options.headers || {}) }
    };
    const response = await fetch(url, config);
    if (!response.ok) {
        let mensagem = `Erro ${response.status}`;
        try {
            const body = await response.text();
            if (body) mensagem += `: ${body}`;
        } catch (_) { /* ignora */ }
        throw new Error(mensagem);
    }
    // 204 No Content → sem corpo
    if (response.status === 204) return null;
    return response.json();
}

// ─── ALUNOS ──────────────────────────────────────────────────────────────────
const AlunoAPI = {
    /**
     * Realiza login. Retorna objeto Aluno se credenciais corretas, senão lança erro.
     * @param {string} email
     * @param {string} senha
     */
    login: (email, senha) =>
        apiFetch(`${API_BASE}/alunos/login?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`),

    /**
     * Cadastra novo aluno.
     * @param {{ nome: string, email: string, senha: string, curso: { id: number } }} aluno
     */
    cadastrar: (aluno) =>
        apiFetch(`${API_BASE}/alunos/cadastro`, { method: 'POST', body: JSON.stringify(aluno) }),

    /**
     * Busca aluno por ID.
     * @param {number} id
     */
    buscarPorId: (id) =>
        apiFetch(`${API_BASE}/alunos/${id}`),

    /**
     * Atualiza dados do aluno.
     * @param {number} id
     * @param {Object} dados
     */
    atualizar: (id, dados) =>
        apiFetch(`${API_BASE}/alunos/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
};

// ─── CURSOS ──────────────────────────────────────────────────────────────────
const CursoAPI = {
    /**
     * Retorna lista de todos os cursos.
     */
    listarTodos: () =>
        apiFetch(`${API_BASE}/cursos`),
};

// ─── CATEGORIAS ──────────────────────────────────────────────────────────────
const CategoriaAPI = {
    /**
     * Retorna lista de todas as categorias.
     */
    listarTodas: () =>
        apiFetch(`${API_BASE}/categorias`),
};

// ─── ITENS ───────────────────────────────────────────────────────────────────
const ItemAPI = {
    /**
     * Lista todos os itens (usado em Explorar e Catálogo).
     */
    listarTodos: () =>
        apiFetch(`${API_BASE}/itens`),

    /**
     * Lista itens de um aluno específico.
     * @param {number} alunoId
     */
    listarPorAluno: (alunoId) =>
        apiFetch(`${API_BASE}/itens/aluno?value=${alunoId}`),

    /**
     * Lista itens de uma categoria específica.
     * @param {number} categoriaId
     */
    listarPorCategoria: (categoriaId) =>
        apiFetch(`${API_BASE}/itens/categoria?value=${categoriaId}`),

    /**
     * Busca item por ID.
     * @param {number} id
     */
    buscarPorId: (id) =>
        apiFetch(`${API_BASE}/itens/${id}`),

    /**
     * Cadastra novo item.
     * @param {{ nome: string, descricao: string, aluno: { id: number }, categoria: { id: number } }} item
     */
    cadastrar: (item) =>
        apiFetch(`${API_BASE}/itens/cadastro`, { method: 'POST', body: JSON.stringify(item) }),

    /**
     * Exclui item por ID.
     * @param {number} id
     */
    excluir: (id) =>
        apiFetch(`${API_BASE}/itens/${id}`, { method: 'DELETE' }),
};

// ─── TROCAS ──────────────────────────────────────────────────────────────────
const TrocaAPI = {
    /**
     * Lista todas as trocas.
     */
    listarTodas: () =>
        apiFetch(`${API_BASE}/trocas`),

    /**
     * Cria uma nova solicitação de troca.
     * @param {Object} troca
     */
    criar: (troca) =>
        apiFetch(`${API_BASE}/trocas/cadastro`, { method: 'POST', body: JSON.stringify(troca) }),

    /**
     * Atualiza o status de uma troca (ex: ACEITA, RECUSADA).
     * @param {number} id
     * @param {Object} dados
     */
    atualizar: (id, dados) =>
        apiFetch(`${API_BASE}/trocas/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),

    /**
     * Exclui uma troca.
     * @param {number} id
     */
    excluir: (id) =>
        apiFetch(`${API_BASE}/trocas/${id}`, { method: 'DELETE' }),
};

// ─── MENSAGENS ───────────────────────────────────────────────────────────────
const MensagemAPI = {
    /**
     * Lista todas as mensagens.
     */
    listarTodas: () =>
        apiFetch(`${API_BASE}/mensagens`),

    /**
     * Lista mensagens de uma troca específica.
     * @param {number} trocaId
     */
    listarPorTroca: (trocaId) =>
        apiFetch(`${API_BASE}/mensagens/troca?value=${trocaId}`),

    /**
     * Envia uma nova mensagem.
     * @param {Object} mensagem
     */
    enviar: (mensagem) =>
        apiFetch(`${API_BASE}/mensagens/cadastro`, { method: 'POST', body: JSON.stringify(mensagem) }),
};

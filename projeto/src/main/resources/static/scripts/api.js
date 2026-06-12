/**
 * api.js â€” Módulo central de comunicação com o backend Spring Boot (porta 8080)
 * Todas as páginas devem carregar este arquivo ANTES dos seus próprios scripts.
 */

const API_BASE = 'http://localhost:8080';

// â”€â”€â”€ AUTH / SESSION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ HELPER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    // 204 No Content â†’ sem corpo
    if (response.status === 204) return null;
    return response.json();
}

// â”€â”€â”€ ALUNOS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ CURSOS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CursoAPI = {
    /**
     * Retorna lista de todos os cursos.
     */
    listarTodos: () =>
        apiFetch(`${API_BASE}/cursos`),
};

// â”€â”€â”€ CATEGORIAS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CategoriaAPI = {
    /**
     * Retorna lista de todas as categorias.
     */
    listarTodas: () =>
        apiFetch(`${API_BASE}/categorias`),
};

// â”€â”€â”€ ITENS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ TROCAS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ MENSAGENS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// --- AUTO HIDE LOGIN ---
document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.querySelector('.auth-header-link[href="login.html"]');
    const cadastroLink = document.querySelector('.auth-header-link[href="cadastro.html"]');
    const headerActions = document.querySelector('.header__actions');
    
    if (getSessao()) {
        if (loginLink) loginLink.style.display = 'none';
        if (cadastroLink) cadastroLink.style.display = 'none';
        
        if (headerActions) {
            const btnSair = document.createElement('a');
            btnSair.href = '#';
            btnSair.className = 'auth-header-link';
            btnSair.textContent = 'Sair da Conta';
            btnSair.style.backgroundColor = '#dc3545'; // um tom vermelho/deslogar
            btnSair.style.color = 'white';
            btnSair.style.border = 'none';
            btnSair.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.removeItem('alunoLogado');
                window.location.reload(); // Recarrega a página conforme solicitado
            });
            headerActions.appendChild(btnSair);
        }
    }
});
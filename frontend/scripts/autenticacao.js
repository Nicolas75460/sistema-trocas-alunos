/**
 * autenticacao.js — Login e Cadastro conectados à API real.
 */
document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.querySelector('.auth-form');
    if (!authForm) return;

    const isLoginPage = !!document.getElementById('senha') && !document.getElementById('nome');
    const isCadastroPage = !!document.getElementById('nome');

    // ─── Formulário de LOGIN ────────────────────────────────────────────────
    if (isLoginPage) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const senha = document.getElementById('senha').value;
            const submitBtn = authForm.querySelector('.auth-submit-btn');

            submitBtn.innerHTML = 'Entrando...';
            submitBtn.disabled = true;

            try {
                const aluno = await AlunoAPI.login(email, senha);
                salvarSessao(aluno);
                window.location.href = 'explorar.html';
            } catch (err) {
                mostrarErro('E-mail ou senha inválidos. Verifique suas credenciais.');
                submitBtn.innerHTML = `Entrar <svg class="icon icon--sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`;
                submitBtn.disabled = false;
            }
        });
    }

    // ─── Formulário de CADASTRO ─────────────────────────────────────────────
    if (isCadastroPage) {
        // Popula o select de cursos com dados da API
        const selectCurso = document.getElementById('curso');
        if (selectCurso) {
            CursoAPI.listarTodos()
                .then(cursos => {
                    selectCurso.innerHTML = '<option value="" disabled selected>Selecione seu curso</option>';
                    cursos.forEach(c => {
                        const opt = document.createElement('option');
                        opt.value = c.id;
                        opt.textContent = c.nome;
                        selectCurso.appendChild(opt);
                    });
                })
                .catch(() => {
                    // fallback: mantém opções estáticas caso a API não esteja rodando
                });
        }

        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const senha = document.getElementById('senha').value;
            const cursoId = document.getElementById('curso').value;
            const submitBtn = authForm.querySelector('.auth-submit-btn');

            if (!nome || !email || !senha || !cursoId) {
                mostrarErro('Preencha todos os campos obrigatórios.');
                return;
            }

            submitBtn.innerHTML = 'Criando conta...';
            submitBtn.disabled = true;

            try {
                const payload = {
                    nome,
                    email,
                    senha,
                    curso: { id: parseInt(cursoId) }
                };
                await AlunoAPI.cadastrar(payload);
                // Faz login automático após cadastro
                const aluno = await AlunoAPI.login(email, senha);
                salvarSessao(aluno);
                window.location.href = 'explorar.html';
            } catch (err) {
                const msg = err.message.includes('400') || err.message.includes('Email')
                    ? 'Este e-mail já está cadastrado.'
                    : `Erro ao criar conta: ${err.message}`;
                mostrarErro(msg);
                submitBtn.innerHTML = `Criar Minha Conta <svg class="icon icon--sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`;
                submitBtn.disabled = false;
            }
        });
    }

    // ─── Helpers ────────────────────────────────────────────────────────────
    function mostrarErro(msg) {
        let alertEl = document.querySelector('.auth-alert-error');
        if (!alertEl) {
            alertEl = document.createElement('div');
            alertEl.className = 'auth-alert-error';
            alertEl.style.cssText = 'background:#fee2e2;border:1px solid #fca5a5;color:#991b1b;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:14px;';
            authForm.insertBefore(alertEl, authForm.firstChild);
        }
        alertEl.textContent = msg;
        alertEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

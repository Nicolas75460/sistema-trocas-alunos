/**
 * perfil.js — Carrega e salva dados do perfil do aluno logado via API.
 */
document.addEventListener('DOMContentLoaded', async () => {

    // ─── Verifica sessão ──────────────────────────────────────────────────
    const aluno = getSessao();
    if (!aluno) {
        window.location.href = 'login.html';
        return;
    }

    // ─── Popula dados do perfil na tela ───────────────────────────────────
    const elNome        = document.querySelector('.profile-card__name');
    const elCurso       = document.querySelector('.profile-card__course-badge');
    const elAvatar      = document.querySelector('.profile-card__avatar');
    const elTrocasLabel = document.querySelector('.profile-card__trocas-label');

    if (elNome)   elNome.textContent  = aluno.nome  || 'Seu Nome';
    if (elCurso)  elCurso.textContent = aluno.curso?.nome || 'Curso';
    if (elAvatar) elAvatar.textContent = (aluno.nome || '?').charAt(0).toUpperCase();

    // ─── Popula a seção de listagens com os itens do aluno ───────────────
    const listingsGrid = document.querySelector('.listings-grid');
    if (listingsGrid) {
        try {
            const itens = await ItemAPI.listarPorAluno(aluno.id);
            renderizarListings(itens, listingsGrid);

            // Atualiza contador de itens
            const statItens = document.getElementById('stat-itens');
            if (statItens) statItens.textContent = itens.length;
        } catch (err) {
            console.warn('Erro ao carregar itens do aluno:', err.message);
        }
    }

    // ─── Carrega e atualiza contadores de trocas e reservas ────────────────
    try {
        const [recebidas, enviadas] = await Promise.all([
            apiFetch(`${API_BASE}/trocas/receptor?value=${aluno.id}`),
            apiFetch(`${API_BASE}/trocas/solicitante?value=${aluno.id}`)
        ]);
        const totalTrocas = (recebidas || []).length + (enviadas || []).length;
        
        const statTrocas = document.getElementById('stat-trocas');
        if (statTrocas) statTrocas.textContent = totalTrocas;
        if (elTrocasLabel) elTrocasLabel.textContent = `(${totalTrocas} trocas)`;
    } catch (err) {
        console.warn('Erro ao carregar trocas para contador:', err.message);
    }

    const statReservas = document.getElementById('stat-reservas');
    if (statReservas) statReservas.textContent = 0; // Sem recurso de reserva ativo

    // ─── Renderiza cards de itens do aluno ────────────────────────────────
    function renderizarListings(itens, grid) {
        if (!itens || itens.length === 0) {
            grid.innerHTML = '<p style="color:#888;padding:16px 0;">Você ainda não tem itens cadastrados.</p>';
            return;
        }
        grid.innerHTML = '';
        itens.forEach(item => {
            const catNome = item.categoria?.nome || 'Item';
            grid.innerHTML += `
                <article class="product-card" data-item-id="${item.id}">
                    <div class="product-card__image-container" style="background:linear-gradient(135deg,#1e3a5f,#0056b3); height:160px; display:flex; align-items:center; justify-content:center; border-radius:8px 8px 0 0;">
                        <svg style="opacity:.25;width:48px;height:48px;color:white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
                        </svg>
                    </div>
                    <div class="product-card__content" style="padding:12px;">
                        <span class="product-card__category product-card__category--tools">${catNome}</span>
                        <h3 class="product-card__name" style="margin:6px 0 4px;">${item.nome}</h3>
                        ${item.descricao ? `<p style="font-size:12px;color:#666;margin:0 0 10px;">${item.descricao.substring(0,60)}...</p>` : ''}
                        <button class="btn btn--danger btn-excluir-item" data-item-id="${item.id}"
                            style="font-size:12px;padding:6px 10px;background:#ef4444;color:white;border:none;border-radius:6px;cursor:pointer;">
                            Excluir Item
                        </button>
                    </div>
                </article>`;
        });

        // Ação de excluir item
        document.querySelectorAll('.btn-excluir-item').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('Tem certeza que deseja excluir este item?')) return;
                const itemId = btn.dataset.itemId;
                try {
                    await ItemAPI.excluir(itemId);
                    btn.closest('article').remove();
                    alert('Item excluído com sucesso.');
                } catch (err) {
                    alert(`Erro ao excluir item: ${err.message}`);
                }
            });
        });
    }

    // ─── Alternar Abas (Meus Itens / Configurações) ───────────────────────
    const profileTabs    = document.querySelectorAll('.profile-tab');
    const profileContents = document.querySelectorAll('.profile-content');

    profileTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            profileTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            if (targetId) {
                profileContents.forEach(c => c.classList.remove('active'));
                const target = document.getElementById(targetId);
                if (target) target.classList.add('active');
            }
        });
    });

    // ─── Edição de perfil ─────────────────────────────────────────────────
    const btnEditProfile = document.querySelector('.btn-edit-profile');
    const profileInputs  = document.querySelectorAll('.profile-form input');

    if (btnEditProfile) {
        btnEditProfile.addEventListener('click', async (e) => {
            e.preventDefault();
            const isEditing = btnEditProfile.classList.contains('editing');

            if (isEditing) {
                // SALVAR
                const novoNome  = document.querySelector('#input-nome')?.value?.trim();
                const novoEmail = document.querySelector('#input-email')?.value?.trim();

                if (novoNome || novoEmail) {
                    try {
                        const dadosAtualizar = {
                            nome:  novoNome  || aluno.nome,
                            email: novoEmail || aluno.email,
                            curso: aluno.curso
                        };
                        const alunoAtualizado = await AlunoAPI.atualizar(aluno.id, dadosAtualizar);
                        salvarSessao(alunoAtualizado);
                        if (elNome)  elNome.textContent  = alunoAtualizado.nome;
                        alert('Perfil atualizado com sucesso!');
                    } catch (err) {
                        alert(`Erro ao atualizar perfil: ${err.message}`);
                    }
                }

                btnEditProfile.textContent = 'Editar Perfil';
                btnEditProfile.classList.remove('editing');
                profileInputs.forEach(input => input.setAttribute('readonly', true));
            } else {
                // EDITAR
                btnEditProfile.textContent = 'Salvar Alterações';
                btnEditProfile.classList.add('editing');
                profileInputs.forEach(input => input.removeAttribute('readonly'));
                if (profileInputs.length > 0) profileInputs[0].focus();
            }
        });
    }

    // ─── Troca de foto do avatar ──────────────────────────────────────────
    const avatarInput = document.getElementById('avatar-upload');
    const avatarImage = document.querySelector('.profile-card__avatar, .profile-avatar img');

    if (avatarInput && avatarImage) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                avatarImage.src = URL.createObjectURL(file);
            }
        });
    }

    // ─── Botão Logout ──────────────────────────────────────────────────────
    const btnLogout = document.querySelector('.btn-logout, #btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Deseja sair da sua conta?')) {
                encerrarSessao();
            }
        });
    }
});

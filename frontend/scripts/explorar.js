/**
 * explorar.js — Carrega itens e categorias dinâmicos da API.
 */
document.addEventListener('DOMContentLoaded', async () => {

    // ─── Popula cards de categorias dinamicamente ─────────────────────────
    const categoriesGrid = document.querySelector('.categories-grid');
    if (categoriesGrid) {
        try {
            const categorias = await CategoriaAPI.listarTodas();
            if (categorias && categorias.length > 0) {
                categoriesGrid.innerHTML = '';
                categorias.forEach(cat => {
                    categoriesGrid.innerHTML += `
                        <div class="category-card" data-categoria-id="${cat.id}" style="cursor:pointer;">
                            <div class="category-icon">
                                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                                </svg>
                            </div>
                            <h3>${cat.nome}</h3>
                        </div>`;
                });

                // Filtro por categoria ao clicar
                document.querySelectorAll('.category-card').forEach(card => {
                    card.addEventListener('click', async () => {
                        const catId = card.dataset.categoriaId;
                        document.querySelectorAll('.category-card').forEach(c => c.style.borderColor = '');
                        card.style.borderColor = 'var(--cor-primaria, #0056b3)';
                        const itens = await ItemAPI.listarPorCategoria(catId);
                        renderizarItens(itens);
                    });
                });
            }
        } catch (err) {
            console.warn('Não foi possível carregar categorias:', err.message);
        }
    }

    // ─── Carrega todos os itens na grid ──────────────────────────────────
    const itemsGrid = document.querySelector('.items-grid');
    if (itemsGrid) {
        try {
            const itens = await ItemAPI.listarTodos();
            renderizarItens(itens);
        } catch (err) {
            console.warn('Não foi possível carregar itens:', err.message);
            // mantém o HTML estático original como fallback
        }
    }

    // ─── Like / Favoritar (visual) ────────────────────────────────────────
    document.addEventListener('click', (e) => {
        const likeBtn = e.target.closest('.like-btn');
        if (!likeBtn) return;
        e.preventDefault();
        const icon = likeBtn.querySelector('.icon, svg');
        if (icon) {
            const isLiked = likeBtn.classList.toggle('liked');
            icon.style.color = isLiked ? 'red' : 'currentColor';
        }
    });

    // ─── Solicitar Troca ─────────────────────────────────────────────────
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.btn-request');
        if (!btn) return;
        e.preventDefault();

        const aluno = getSessao();
        if (!aluno) {
            alert('Você precisa estar logado para solicitar uma troca.');
            window.location.href = 'login.html';
            return;
        }

        const card = btn.closest('.item-card');
        const itemId = card ? card.dataset.itemId : null;
        const itemName = card ? card.querySelector('h3')?.innerText : 'este item';

        if (!itemId) {
            alert(`Troca solicitada para: ${itemName}\n(Selecione o item que deseja oferecer no chat.)`);
            window.location.href = 'chat.html';
            return;
        }

        // Navega para o catálogo/chat passando o ID do item desejado
        window.location.href = `chat.html?itemDesejado=${itemId}`;
    });

    // ─── Função auxiliar para renderizar itens ────────────────────────────
    function renderizarItens(itens) {
        const grid = document.querySelector('.items-grid');
        if (!grid) return;

        if (!itens || itens.length === 0) {
            grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color: var(--cor-texto-claro, #888); padding: 40px 0;">Nenhum item disponível no momento.</p>';
            return;
        }

        grid.innerHTML = '';
        itens.forEach(item => {
            const nomeAluno = item.aluno?.nome || 'Usuário';
            const nomeCategoria = item.categoria?.nome || '';
            const descricao = item.descricao || '';
            grid.innerHTML += `
                <div class="item-card" data-item-id="${item.id}">
                    <div class="item-image" style="background: linear-gradient(135deg,#1e3a5f 0%,#0056b3 100%); display:flex; align-items:center; justify-content:center; min-height:160px;">
                        <div class="item-tags">
                            ${nomeCategoria ? `<span class="tag tag--white">${nomeCategoria.toUpperCase()}</span>` : ''}
                        </div>
                        <svg style="opacity:.3;width:64px;height:64px;color:white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
                        </svg>
                    </div>
                    <div class="item-info">
                        <div class="item-title-row">
                            <h3>${item.nome}</h3>
                            <button class="like-btn">
                                <svg class="icon icon--sm" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                            </button>
                        </div>
                        ${descricao ? `<p style="font-size:13px;color:#666;margin:4px 0 8px;">${descricao}</p>` : ''}
                        <div class="item-author">
                            <span>Postado por <strong>${nomeAluno}</strong></span>
                        </div>
                        <button class="btn-request">Solicitar Troca
                            <svg class="icon icon--sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                            </svg>
                        </button>
                    </div>
                </div>`;
        });
    }
});

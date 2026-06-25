/**
 * catalogo.js — Carrega itens e filtra por categoria via API real.
 */
document.addEventListener('DOMContentLoaded', async () => {

    let todosOsItens = [];
    let categoriaAtiva = null;

    // ─── Carrega categorias no filtro lateral ─────────────────────────────
    const filterList = document.querySelector('.filter-list, .sidebar-filters ul, .categories-sidebar');
    if (filterList) {
        try {
            const categorias = await CategoriaAPI.listarTodas();
            if (categorias && categorias.length > 0) {
                filterList.innerHTML = '';
                // Item "Todos"
                const liTodos = document.createElement('li');
                liTodos.className = 'filter-item active';
                liTodos.textContent = 'Todos';
                liTodos.dataset.categoriaId = '';
                filterList.appendChild(liTodos);

                categorias.forEach(cat => {
                    const li = document.createElement('li');
                    li.className = 'filter-item';
                    li.textContent = cat.nome;
                    li.dataset.categoriaId = cat.id;
                    filterList.appendChild(li);
                });
            }
        } catch (err) {
            console.warn('Não foi possível carregar categorias no catálogo:', err.message);
        }
    }

    // ─── Carrega todos os itens ────────────────────────────────────────────
    try {
        todosOsItens = await ItemAPI.listarTodos();
        renderizarCatalogo(todosOsItens);
    } catch (err) {
        console.warn('Não foi possível carregar itens do catálogo:', err.message);
    }

    // ─── Filtros de categoria ─────────────────────────────────────────────
    document.addEventListener('click', async (e) => {
        const filterItem = e.target.closest('.filter-item');
        if (!filterItem) return;

        document.querySelectorAll('.filter-item').forEach(f => f.classList.remove('active'));
        filterItem.classList.add('active');

        const catId = filterItem.dataset.categoriaId;
        categoriaAtiva = catId || null;

        if (!catId) {
            renderizarCatalogo(todosOsItens);
        } else {
            try {
                const itensFiltrados = await ItemAPI.listarPorCategoria(catId);
                renderizarCatalogo(itensFiltrados);
            } catch (err) {
                console.warn('Erro ao filtrar por categoria:', err.message);
            }
        }
    });

    // ─── Renderiza os cards do catálogo ───────────────────────────────────
    function renderizarCatalogo(itens) {
        // Tenta encontrar a grid de produtos do catálogo
        const grid = document.querySelector('.products-grid, .catalog-grid, .items-grid');
        if (!grid) return;

        if (!itens || itens.length === 0) {
            grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#888; padding:40px 0;">Nenhum item encontrado para este filtro.</p>';
            return;
        }

        grid.innerHTML = '';
        itens.forEach(item => {
            const nomeAluno = item.aluno?.nome || 'Usuário';
            const nomeCategoria = item.categoria?.nome || 'Geral';
            const descricao = item.descricao ? item.descricao.substring(0, 80) + (item.descricao.length > 80 ? '...' : '') : '';
            grid.innerHTML += `
                <div class="product-card" data-item-id="${item.id}">
                    <div class="product-image" style="background: linear-gradient(135deg,#1e3a5f,#0056b3); height:180px; display:flex; align-items:center; justify-content:center; border-radius: 8px 8px 0 0;">
                        <svg style="opacity:.25;width:56px;height:56px;color:white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
                        </svg>
                    </div>
                    <div class="product-info" style="padding:16px;">
                        <span class="product-category" style="font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#0056b3;font-weight:600;">${nomeCategoria}</span>
                        <h3 style="margin:6px 0 4px;">${item.nome}</h3>
                        ${descricao ? `<p style="font-size:13px;color:#666;margin:0 0 12px;">${descricao}</p>` : ''}
                        <p style="font-size:12px;color:#888;margin:0 0 12px;">por <strong>${nomeAluno}</strong></p>
                        <button class="btn btn--primary btn-ver-detalhes" data-item-id="${item.id}" style="width:100%;font-size:13px;padding:10px;">
                            Ver Detalhes
                        </button>
                    </div>
                </div>`;
        });

        // Clique em "Ver Detalhes"
        document.querySelectorAll('.btn-ver-detalhes').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = btn.dataset.itemId;
                alert(`Item ID ${itemId} — página de detalhes em breve!`);
            });
        });
    }

    // ─── Gaveta de Filtros Responsiva ──────────────────────────────────────
    const btnToggleFilters = document.querySelector('.btn-toggle-filters');
    const btnCloseFilters = document.querySelector('.btn-close-filters');
    const filtersOverlay = document.querySelector('.filters-overlay');
    const sidebarFiltros = document.querySelector('.sidebar-filtros');

    if (btnToggleFilters && sidebarFiltros) {
        btnToggleFilters.addEventListener('click', () => {
            sidebarFiltros.classList.add('sidebar-filtros--open');
            if (filtersOverlay) filtersOverlay.classList.add('filters-overlay--open');
        });
    }

    const fecharFiltros = () => {
        if (sidebarFiltros) sidebarFiltros.classList.remove('sidebar-filtros--open');
        if (filtersOverlay) filtersOverlay.classList.remove('filters-overlay--open');
    };

    if (btnCloseFilters) {
        btnCloseFilters.addEventListener('click', fecharFiltros);
    }
    if (filtersOverlay) {
        filtersOverlay.addEventListener('click', fecharFiltros);
    }
});

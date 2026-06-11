/**
 * meus-pedidos.js — Carrega trocas do aluno logado via API real.
 * Status possíveis: PENDENTE, ACEITA, RECUSADA
 */
document.addEventListener('DOMContentLoaded', async () => {

    const aluno = getSessao();
    if (!aluno) {
        window.location.href = 'login.html';
        return;
    }

    let trocasRecebidas = [];
    let trocasEnviadas  = [];

    // ─── Carrega trocas do backend ────────────────────────────────────────
    try {
        const [recebidas, enviadas] = await Promise.all([
            apiFetch(`http://localhost:8082/trocas/receptor?value=${aluno.id}`),
            apiFetch(`http://localhost:8082/trocas/solicitante?value=${aluno.id}`)
        ]);
        trocasRecebidas = recebidas || [];
        trocasEnviadas  = enviadas  || [];
    } catch (err) {
        console.warn('Não foi possível carregar trocas:', err.message);
    }

    // ─── Referências de containers ────────────────────────────────────────
    const containerPedidos = document.querySelector('.pedidos-container, .trocas-container, main');

    // Injeta seções se não existirem
    injetarSecoes();

    renderizarTrocas(trocasRecebidas, 'recebidas');
    renderizarTrocas(trocasEnviadas, 'enviadas');

    // ─── Lógica das Abas ─────────────────────────────────────────────────
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            const tipo = item.dataset.tipo;
            document.querySelectorAll('.secao-trocas').forEach(s => {
                s.style.display = s.dataset.tipo === tipo ? 'block' : 'none';
            });
        });
    });

    // Atualiza data-tipo dos navItems se não existir
    const navList = document.querySelectorAll('.nav-item');
    if (navList.length >= 2) {
        navList[0].dataset.tipo = 'recebidas';
        navList[1].dataset.tipo = 'enviadas';
        // Mostra recebidas por padrão
        navList[0].click();
    }

    // ─── Funções ──────────────────────────────────────────────────────────

    function injetarSecoes() {
        // Cria contêineres de seções de trocas se ainda não existem
        const main = document.querySelector('main') || document.body;

        if (!document.querySelector('.secao-trocas')) {
            const divRecebidas = criarSecao('recebidas', 'Trocas Recebidas');
            const divEnviadas  = criarSecao('enviadas',  'Trocas Enviadas');
            const wrapper = document.querySelector('.pedidos-list, .trocas-list');
            if (wrapper) {
                wrapper.appendChild(divRecebidas);
                wrapper.appendChild(divEnviadas);
            } else {
                main.appendChild(divRecebidas);
                main.appendChild(divEnviadas);
            }
        }
    }

    function criarSecao(tipo, titulo) {
        const div = document.createElement('div');
        div.className = 'secao-trocas';
        div.dataset.tipo = tipo;
        div.innerHTML = `<h2 style="margin-bottom:16px;">${titulo}</h2><div class="cards-${tipo}"></div>`;
        return div;
    }

    function renderizarTrocas(trocas, tipo) {
        const container = document.querySelector(`.cards-${tipo}`);
        if (!container) return;

        if (!trocas || trocas.length === 0) {
            container.innerHTML = `<p style="color:#888;padding:16px 0;">Nenhuma troca ${tipo === 'recebidas' ? 'recebida' : 'enviada'} no momento.</p>`;
            return;
        }

        container.innerHTML = '';
        trocas.forEach(troca => {
            const statusClass = {
                'PENDENTE' : 'warning',
                'ACEITA'   : 'success',
                'RECUSADA' : 'danger'
            }[troca.status] || 'warning';

            const statusLabel = {
                'PENDENTE' : '⏳ Pendente',
                'ACEITA'   : '✅ Aceita',
                'RECUSADA' : '❌ Recusada'
            }[troca.status] || troca.status;

            const nomeSolicitante = troca.solicitante?.nome || 'Aluno';
            const nomeReceptor    = troca.receptor?.nome    || 'Aluno';
            const itemOfertado    = troca.itemOfertado?.nome  || 'Item ofertado';
            const itemDesejado    = troca.itemDesejado?.nome  || 'Item desejado';
            const data = troca.dataCriacao
                ? new Date(troca.dataCriacao).toLocaleDateString('pt-BR')
                : '';

            const acoesBotoes = tipo === 'recebidas' && troca.status === 'PENDENTE'
                ? `<div style="display:flex;gap:8px;margin-top:12px;">
                       <button class="btn-aceitar btn btn--primary" data-troca-id="${troca.id}" style="font-size:13px;padding:8px 14px;">Aceitar</button>
                       <button class="btn-recusar btn" data-troca-id="${troca.id}" style="font-size:13px;padding:8px 14px;background:#ef4444;color:white;border:none;border-radius:6px;cursor:pointer;">Recusar</button>
                   </div>`
                : '';

            container.innerHTML += `
                <div class="pedido-card" data-troca-id="${troca.id}" style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:16px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <span style="font-size:12px;background:#f3f4f6;border-radius:4px;padding:3px 8px;color:#374151;">
                            ${statusLabel}
                        </span>
                        <span style="font-size:12px;color:#9ca3af;">${data}</span>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px;">
                        <div>
                            <p style="font-size:11px;color:#6b7280;margin:0 0 2px;">OFERTA</p>
                            <strong>${itemOfertado}</strong>
                            <p style="font-size:12px;color:#6b7280;margin:2px 0 0;">por ${nomeSolicitante}</p>
                        </div>
                        <svg style="width:24px;height:24px;color:#9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                        </svg>
                        <div style="text-align:right;">
                            <p style="font-size:11px;color:#6b7280;margin:0 0 2px;">DESEJADO</p>
                            <strong>${itemDesejado}</strong>
                            <p style="font-size:12px;color:#6b7280;margin:2px 0 0;">de ${nomeReceptor}</p>
                        </div>
                    </div>
                    ${acoesBotoes}
                </div>`;
        });

        // Aceitar / Recusar
        container.querySelectorAll('.btn-aceitar').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('Aceitar esta troca?')) return;
                try {
                    await apiFetch(`http://localhost:8080/trocas/${btn.dataset.trocaId}/status?value=ACEITA`, { method: 'PUT' });
                    btn.closest('.pedido-card').querySelector('.btn-aceitar').textContent = '✅ Aceita';
                    btn.closest('[style]').querySelectorAll('button').forEach(b => b.remove());
                    window.location.reload();
                } catch (err) {
                    alert(`Erro: ${err.message}`);
                }
            });
        });

        container.querySelectorAll('.btn-recusar').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('Recusar esta troca?')) return;
                try {
                    await apiFetch(`http://localhost:8080/trocas/${btn.dataset.trocaId}/status?value=RECUSADA`, { method: 'PUT' });
                    window.location.reload();
                } catch (err) {
                    alert(`Erro: ${err.message}`);
                }
            });
        });
    }
});

/**
 * chat.js — Carrega trocas e mensagens via API real.
 *
 * Fluxo:
 *  1. Se vier com ?itemDesejado=<id>, busca o item, descobre o dono,
 *     cria (ou reutiliza) a troca e abre o chat diretamente.
 *  2. Caso contrário, lista todas as trocas do usuário na sidebar
 *     e aguarda seleção.
 */
document.addEventListener('DOMContentLoaded', async () => {

    const aluno = getSessao();
    if (!aluno) {
        window.location.href = 'login.html';
        return;
    }

    // ─── Seleciona elementos do DOM ───────────────────────────────────────
    const chatInput          = document.querySelector('.chat-input__field input');
    const sendBtn            = document.querySelector('.chat-input__send-btn');
    const messagesContainer  = document.querySelector('.chat-messages');
    const conversationList   = document.querySelector('.chat-sidebar__list');
    const chatHeaderAvatar   = document.querySelector('.chat-header__avatar');
    const chatHeaderName     = document.querySelector('.chat-header__name');
    const chatHeaderStatus   = document.querySelector('.chat-header__status');
    const finalizeBtn        = document.querySelector('.chat-header__finalize-btn');

    let trocaAtiva       = null;
    let destinatarioAtivo = null;

    // ─── Estado inicial: cabeçalho em branco ─────────────────────────────
    definirEstadoSemConversa();

    // ─── Carrega trocas do usuário ────────────────────────────────────────
    let todasTrocas = [];
    try {
        const [recebidas, enviadas] = await Promise.all([
            apiFetch(`${API_BASE}/trocas/receptor?value=${aluno.id}`),
            apiFetch(`${API_BASE}/trocas/solicitante?value=${aluno.id}`)
        ]);
        todasTrocas = [...(recebidas || []), ...(enviadas || [])];
    } catch (err) {
        console.warn('Não foi possível carregar trocas:', err.message);
    }

    // ─── Popula a sidebar ─────────────────────────────────────────────────
    if (!conversationList) return;
    conversationList.innerHTML = '';

    if (todasTrocas.length === 0) {
        conversationList.innerHTML = `
            <div style="padding:24px 16px;text-align:center;color:#9ca3af;">
                <svg style="width:40px;height:40px;margin:0 auto 12px;display:block;opacity:0.4;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <p style="font-size:13px;margin:0;">Nenhuma troca iniciada ainda.</p>
                <p style="font-size:12px;margin:8px 0 0;opacity:0.7;">Explore itens e solicite uma troca para começar a conversar.</p>
                <a href="../index.html" style="display:inline-block;margin-top:12px;padding:8px 16px;background:#0056b3;color:white;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600;">Explorar Itens</a>
            </div>`;
    } else {
        todasTrocas.forEach(troca => renderizarItemSidebar(troca));
    }

    // ─── Verifica parâmetro ?itemDesejado= e cria/abre troca ─────────────
    const params       = new URLSearchParams(window.location.search);
    const itemDesejadoId = params.get('itemDesejado');
    const trocaIdParam   = params.get('trocaId');

    if (trocaIdParam) {
        // Abre troca específica diretamente (ex: vindo de meus-pedidos)
        const troca = todasTrocas.find(t => String(t.id) === String(trocaIdParam));
        if (troca) {
            const itemEl = conversationList.querySelector(`[data-troca-id="${troca.id}"]`);
            if (itemEl) itemEl.click();
        }
    } else if (itemDesejadoId) {
        await iniciarTrocaPorItem(itemDesejadoId);
    } else if (todasTrocas.length > 0) {
        // Seleciona a primeira conversa automaticamente
        const primeiro = conversationList.querySelector('.conversation-item');
        if (primeiro) primeiro.click();
    }

    // ─── Inicia troca a partir de um item desejado ────────────────────────
    async function iniciarTrocaPorItem(itemId) {
        try {
            // 1. Busca dados do item desejado
            const itemDesejado = await ItemAPI.buscarPorId(itemId);
            if (!itemDesejado) throw new Error('Item não encontrado.');

            const receptor = itemDesejado.aluno;
            if (!receptor) throw new Error('Dono do item não encontrado.');

            // 2. Não pode trocar com si mesmo
            if (receptor.id === aluno.id) {
                mostrarAviso(messagesContainer,
                    '⚠️ Você não pode solicitar troca de um item que é seu.');
                return;
            }

            // 3. Verifica se já existe troca entre esses dois usuários para esse item
            const trocaExistente = todasTrocas.find(t =>
                String(t.itemDesejado?.id) === String(itemId) &&
                (
                    (String(t.solicitante?.id) === String(aluno.id) && String(t.receptor?.id) === String(receptor.id)) ||
                    (String(t.receptor?.id) === String(aluno.id) && String(t.solicitante?.id) === String(receptor.id))
                )
            );

            if (trocaExistente) {
                // Já existe — apenas abre a conversa
                const itemEl = conversationList.querySelector(`[data-troca-id="${trocaExistente.id}"]`);
                if (itemEl) {
                    itemEl.click();
                } else {
                    await selecionarConversa(trocaExistente, null,
                        receptor.nome || 'Aluno', receptor);
                }
                return;
            }

            // 4. Cria nova troca (sem itemOfertado — o solicitante não precisa indicar antes)
            const novasTrocas = await apiFetch(`${API_BASE}/trocas/solicitante?value=${aluno.id}`);
            // Monta payload — itemOfertado é opcional conforme o backend
            const payload = {
                solicitante:  { id: aluno.id },
                receptor:     { id: receptor.id },
                itemDesejado: { id: itemId },
                status: 'PENDENTE'
            };

            let trocaCriada;
            try {
                trocaCriada = await TrocaAPI.criar(payload);
            } catch (err) {
                console.warn('Erro ao criar troca:', err.message);
                // Se falhou por itemOfertado obrigatório, mostra aviso amigável
                mostrarAviso(messagesContainer,
                    `⚠️ Não foi possível criar a troca automaticamente: ${err.message}\n\nTente publicar um item primeiro para ofertá-lo na troca.`);
                return;
            }

            // 5. Adiciona na sidebar e abre
            renderizarItemSidebar(trocaCriada);
            todasTrocas.push(trocaCriada);

            const novoEl = conversationList.querySelector(`[data-troca-id="${trocaCriada.id}"]`);
            if (novoEl) novoEl.click();

        } catch (err) {
            console.warn('iniciarTrocaPorItem:', err.message);
            mostrarAviso(messagesContainer, `⚠️ ${err.message}`);
        }
    }

    // ─── Renderiza item na sidebar ────────────────────────────────────────
    function renderizarItemSidebar(troca) {
        const outraPessoa = troca.solicitante?.id === aluno.id
            ? troca.receptor
            : troca.solicitante;
        const nomePessoa = outraPessoa?.nome || 'Aluno';
        const nomeItem   = troca.itemDesejado?.nome || troca.itemOfertado?.nome || 'Item';
        const inicial    = nomePessoa.charAt(0).toUpperCase();

        const statusCores = {
            'PENDENTE':  { bg: '#fef3c7', color: '#92400e' },
            'ACEITA':    { bg: '#dcfce7', color: '#166534' },
            'RECUSADA':  { bg: '#fee2e2', color: '#991b1b' },
            'FINALIZADA':{ bg: '#e0f2fe', color: '#0369a1' }
        };
        const cores = statusCores[troca.status] || statusCores['PENDENTE'];

        const item = document.createElement('div');
        item.className      = 'conversation-item';
        item.dataset.trocaId = troca.id;
        item.style.cssText  = 'display:flex;align-items:center;gap:12px;padding:14px 16px;cursor:pointer;border-bottom:1px solid rgba(0,0,0,0.06);transition:background 0.15s ease;';

        item.innerHTML = `
            <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#1e3a5f,#0056b3);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:17px;flex-shrink:0;">
                ${inicial}
            </div>
            <div style="flex:1;min-width:0;">
                <div style="font-weight:600;font-size:14px;color:#111827;margin-bottom:2px;">${nomePessoa}</div>
                <div style="font-size:12px;color:#6b7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${nomeItem}</div>
            </div>
            <span style="font-size:10px;padding:3px 7px;border-radius:5px;font-weight:600;white-space:nowrap;background:${cores.bg};color:${cores.color};">${troca.status}</span>`;

        item.addEventListener('mouseenter', () => {
            if (item.dataset.ativo !== 'true') item.style.background = '#f9fafb';
        });
        item.addEventListener('mouseleave', () => {
            if (item.dataset.ativo !== 'true') item.style.background = '';
        });
        item.addEventListener('click', () =>
            selecionarConversa(troca, item, nomePessoa, outraPessoa));

        conversationList.appendChild(item);
    }

    // ─── Seleciona conversa e carrega mensagens ───────────────────────────
    async function selecionarConversa(troca, itemEl, nomePessoa, outraPessoa) {
        // Desativa todos
        conversationList.querySelectorAll('.conversation-item').forEach(c => {
            c.style.background = '';
            c.dataset.ativo    = 'false';
        });
        // Ativa o clicado
        if (itemEl) {
            itemEl.style.background = '#eff6ff';
            itemEl.dataset.ativo    = 'true';
        }

        trocaAtiva        = troca.id;
        destinatarioAtivo = outraPessoa;

        // Atualiza cabeçalho do chat
        if (chatHeaderAvatar) {
            chatHeaderAvatar.alt = nomePessoa;
            // Mostra inicial caso não haja foto
            chatHeaderAvatar.style.display = 'none';
        }
        if (chatHeaderName)   chatHeaderName.textContent = nomePessoa;
        if (chatHeaderStatus) {
            const statusLabel = {
                'PENDENTE':  '⏳ Pendente',
                'ACEITA':    '✅ Aceita',
                'RECUSADA':  '❌ Recusada',
                'FINALIZADA':'🏁 Finalizada'
            }[troca.status] || troca.status;
            chatHeaderStatus.innerHTML = `<span class="chat-header__online">${statusLabel}</span>`;
        }

        // Botão Finalizar Troca — habilitado se estiver PENDENTE ou ACEITA
        if (finalizeBtn) {
            const statusPermitidos = ['PENDENTE', 'ACEITA'];
            finalizeBtn.disabled = !statusPermitidos.includes(troca.status);
            finalizeBtn.title    = !statusPermitidos.includes(troca.status)
                ? 'Esta troca já foi concluída ou recusada'
                : 'Finalizar esta troca';
        }

        // Habilita o input
        if (chatInput) {
            chatInput.disabled     = false;
            chatInput.placeholder  = 'Digite sua mensagem...';
        }
        if (sendBtn) sendBtn.disabled = false;

        // Carrega mensagens
        if (messagesContainer) {
            // Tenta carregar do cache local (localStorage) primeiro
            const cacheKey = `chat_msgs_${trocaAtiva}`;
            const localMsgs = localStorage.getItem(cacheKey);
            if (localMsgs) {
                try {
                    renderizarMensagens(JSON.parse(localMsgs));
                } catch (_) {}
            } else {
                messagesContainer.innerHTML = '<p style="text-align:center;color:#9ca3af;padding:32px 20px;font-size:13px;">Carregando mensagens...</p>';
            }

            try {
                const mensagens = await MensagemAPI.listarPorTroca(trocaAtiva);
                // Salva no cache local
                localStorage.setItem(cacheKey, JSON.stringify(mensagens || []));
                renderizarMensagens(mensagens || []);
            } catch (err) {
                if (!localMsgs) {
                    messagesContainer.innerHTML = '<p style="text-align:center;color:#9ca3af;padding:32px 20px;font-size:13px;">Nenhuma mensagem ainda. Inicie a conversa! 👋</p>';
                }
            }
        }
    }

    // ─── Renderiza mensagens ──────────────────────────────────────────────
    function renderizarMensagens(mensagens) {
        if (!messagesContainer) return;

        if (mensagens.length === 0) {
            messagesContainer.innerHTML = '<p style="text-align:center;color:#9ca3af;padding:32px 20px;font-size:13px;">Nenhuma mensagem ainda. Inicie a conversa! 👋</p>';
            return;
        }

        messagesContainer.innerHTML = '';
        mensagens.forEach(msg => {
            const isMine = msg.remetente?.id === aluno.id;
            const hora   = msg.dataEnvio
                ? new Date(msg.dataEnvio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                : '';
            const initials = (msg.remetente?.nome || '?').charAt(0).toUpperCase();

            messagesContainer.innerHTML += `
                <div class="message ${isMine ? 'message--sent' : 'message--received'}" style="display:flex;align-items:flex-end;gap:8px;margin-bottom:14px;${isMine ? 'flex-direction:row-reverse;' : ''}">
                    <div style="width:32px;height:32px;border-radius:50%;background:${isMine ? '#0056b3' : '#6b7280'};color:white;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;">${initials}</div>
                    <div class="message__content">
                        <div class="message__bubble" style="background:${isMine ? '#0056b3' : '#f3f4f6'};color:${isMine ? 'white' : '#111'};padding:10px 14px;border-radius:${isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};max-width:340px;word-break:break-word;line-height:1.45;">${escapeHtml(msg.mensagem)}</div>
                        <div class="message__time" style="font-size:11px;color:#9ca3af;margin-top:3px;${isMine ? 'text-align:right;' : ''}">${hora}${isMine ? ' <span>✓</span>' : ''}</div>
                    </div>
                </div>`;
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // ─── Envio de mensagem ────────────────────────────────────────────────
    const enviarMensagem = async () => {
        const text = chatInput?.value?.trim();
        if (!text) return;

        if (!trocaAtiva || !destinatarioAtivo) {
            alert('Selecione uma conversa antes de enviar uma mensagem.');
            return;
        }

        chatInput.value = '';

        // Exibe localmente (otimismo)
        const hora    = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const inicial = (aluno.nome || 'E').charAt(0).toUpperCase();
        messagesContainer?.insertAdjacentHTML('beforeend', `
            <div class="message message--sent" style="display:flex;align-items:flex-end;gap:8px;margin-bottom:14px;flex-direction:row-reverse;">
                <div style="width:32px;height:32px;border-radius:50%;background:#0056b3;color:white;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;">${inicial}</div>
                <div>
                    <div style="background:#0056b3;color:white;padding:10px 14px;border-radius:16px 16px 4px 16px;max-width:340px;word-break:break-word;line-height:1.45;">${escapeHtml(text)}</div>
                    <div style="font-size:11px;color:#9ca3af;margin-top:3px;text-align:right;">${hora} <span>✓</span></div>
                </div>
            </div>`);

        if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Persiste no backend e atualiza cache local
        try {
            const novaMsg = await MensagemAPI.enviar({
                mensagem:     text,
                remetente:    { id: aluno.id },
                destinatario: { id: destinatarioAtivo.id },
                troca:        { id: trocaAtiva }
            });

            // Atualiza cache local do localStorage com o payload completo retornado do backend
            const cacheKey = `chat_msgs_${trocaAtiva}`;
            const cached = JSON.parse(localStorage.getItem(cacheKey) || '[]');
            cached.push(novaMsg);
            localStorage.setItem(cacheKey, JSON.stringify(cached));
        } catch (err) {
            console.warn('Erro ao enviar mensagem:', err.message);
        }
    };

    if (sendBtn)   sendBtn.addEventListener('click', enviarMensagem);
    if (chatInput) chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') enviarMensagem(); });

    // ─── Botão Finalizar Troca ─────────────────────────────────────────────
    if (finalizeBtn) {
        finalizeBtn.addEventListener('click', async () => {
            if (!trocaAtiva) return;
            if (!confirm('Deseja finalizar esta troca? Esta ação não pode ser desfeita.')) return;
            try {
                await apiFetch(`${API_BASE}/trocas/${trocaAtiva}/status?value=FINALIZADA`, { method: 'PUT' });
                alert('Troca finalizada com sucesso! ✅');
                window.location.reload();
            } catch (err) {
                alert(`Erro ao finalizar troca: ${err.message}`);
            }
        });
    }

    // ─── Estado sem conversa selecionada ──────────────────────────────────
    function definirEstadoSemConversa() {
        // Oculta cabeçalho estático e exibe placeholder
        if (chatHeaderAvatar) chatHeaderAvatar.style.display = 'none';
        if (chatHeaderName)   chatHeaderName.textContent    = 'Selecione uma conversa';
        if (chatHeaderStatus) chatHeaderStatus.innerHTML    = '';
        if (finalizeBtn)      finalizeBtn.disabled          = true;

        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#9ca3af;text-align:center;padding:40px;">
                    <svg style="width:56px;height:56px;margin-bottom:16px;opacity:0.3;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    <p style="font-size:15px;font-weight:600;margin:0 0 6px;">Suas mensagens</p>
                    <p style="font-size:13px;margin:0;opacity:0.7;">Clique em uma conversa ao lado para ver as mensagens.</p>
                </div>`;
        }
        if (chatInput) {
            chatInput.disabled    = true;
            chatInput.placeholder = 'Selecione uma conversa para começar...';
        }
        if (sendBtn) sendBtn.disabled = true;
    }

    // ─── Exibe aviso no painel de mensagens ───────────────────────────────
    function mostrarAviso(container, texto) {
        if (!container) return;
        container.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#9ca3af;text-align:center;padding:40px;">
                <p style="font-size:14px;margin:0;white-space:pre-line;">${escapeHtml(texto)}</p>
            </div>`;
    }

    // ─── Helper: escapa HTML para prevenir XSS ────────────────────────────
    function escapeHtml(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }
});

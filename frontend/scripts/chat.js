/**
 * chat.js — Carrega trocas e mensagens via API real.
 * A estrutura: seleciona uma troca na sidebar → carrega mensagens no chat.
 */
document.addEventListener('DOMContentLoaded', async () => {

    const aluno = getSessao();
    if (!aluno) {
        window.location.href = 'login.html';
        return;
    }

    // ─── Seleciona elementos do DOM ───────────────────────────────────────
    const chatInput         = document.querySelector('.chat-input__field input');
    const sendBtn           = document.querySelector('.chat-input__send-btn');
    const messagesContainer = document.querySelector('.chat-messages');
    const conversationList  = document.querySelector('.chat-sidebar__list');
    const chatHeaderName    = document.querySelector('.chat-header__name');
    const chatHeaderStatus  = document.querySelector('.chat-header__status');

    let trocaAtiva = null;
    let destinatarioAtivo = null;

    // ─── Limpa TODOS os itens estáticos do HTML ───────────────────────────
    if (conversationList) {
        conversationList.querySelectorAll('.conversation-item').forEach(el => el.remove());
    }

    // ─── Estado inicial: nenhuma conversa selecionada ─────────────────────
    definirEstadoSemConversa();

    // ─── Carrega lista de trocas do aluno ────────────────────────────────
    let todasTrocas = [];
    try {
        const [recebidas, enviadas] = await Promise.all([
            apiFetch(`${API_BASE}/trocas/receptor?value=${aluno.id}`),
            apiFetch(`${API_BASE}/trocas/solicitante?value=${aluno.id}`)
        ]);
        todasTrocas = [...(recebidas || []), ...(enviadas || [])];
    } catch (err) {
        console.warn('Nao foi possivel carregar trocas:', err.message);
    }

    // ─── Popula a sidebar ─────────────────────────────────────────────────
    if (!conversationList) return;

    if (todasTrocas.length === 0) {
        conversationList.innerHTML = `
            <div style="padding:24px 16px;text-align:center;color:#9ca3af;">
                <svg style="width:40px;height:40px;margin:0 auto 12px;display:block;opacity:0.4;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <p style="font-size:13px;margin:0;">Nenhuma troca iniciada ainda.</p>
                <p style="font-size:12px;margin:8px 0 0;opacity:0.7;">Explore itens e solicite uma troca para comecar a conversar.</p>
                <a href="explorar.html" style="display:inline-block;margin-top:12px;padding:8px 16px;background:#0056b3;color:white;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600;">Explorar Itens</a>
            </div>`;
        return;
    }

    // Renderiza cada troca como item clicável
    todasTrocas.forEach(troca => {
        const outraPessoa = troca.solicitante?.id === aluno.id
            ? troca.receptor
            : troca.solicitante;
        const nomePessoa = outraPessoa?.nome || 'Aluno';
        const nomeItem   = troca.itemDesejado?.nome || troca.itemOfertado?.nome || 'Item';
        const inicial    = nomePessoa.charAt(0).toUpperCase();

        const statusCores = {
            'PENDENTE': { bg: '#fef3c7', color: '#92400e' },
            'ACEITA':   { bg: '#dcfce7', color: '#166534' },
            'RECUSADA': { bg: '#fee2e2', color: '#991b1b' },
            'CANCELADA':{ bg: '#f3f4f6', color: '#6b7280' }
        };
        const cores = statusCores[troca.status] || statusCores['PENDENTE'];

        const item = document.createElement('div');
        item.className = 'conversation-item';
        item.dataset.trocaId = troca.id;
        item.style.cssText = 'display:flex;align-items:center;gap:12px;padding:14px 16px;cursor:pointer;border-bottom:1px solid rgba(0,0,0,0.06);transition:background 0.15s ease;';

        item.innerHTML = `
            <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#1e3a5f,#0056b3);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:17px;flex-shrink:0;">
                ${inicial}
            </div>
            <div style="flex:1;min-width:0;">
                <div style="font-weight:600;font-size:14px;color:#111827;margin-bottom:2px;">${nomePessoa}</div>
                <div style="font-size:12px;color:#6b7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${nomeItem}</div>
            </div>
            <span style="font-size:10px;padding:3px 7px;border-radius:5px;font-weight:600;white-space:nowrap;background:${cores.bg};color:${cores.color};">${troca.status}</span>`;

        // Hover
        item.addEventListener('mouseenter', () => {
            if (item.dataset.ativo !== 'true') item.style.background = '#f9fafb';
        });
        item.addEventListener('mouseleave', () => {
            if (item.dataset.ativo !== 'true') item.style.background = '';
        });

        // Click: seleciona conversa
        item.addEventListener('click', () => selecionarConversa(troca, item, nomePessoa, outraPessoa));

        conversationList.appendChild(item);
    });

    // Seleciona a primeira conversa automaticamente
    const primeiro = conversationList.querySelector('.conversation-item');
    if (primeiro) primeiro.click();

    // ─── Seleciona conversa e carrega mensagens ───────────────────────────
    async function selecionarConversa(troca, itemEl, nomePessoa, outraPessoa) {
        // Desativa todos
        conversationList.querySelectorAll('.conversation-item').forEach(c => {
            c.style.background = '';
            c.dataset.ativo = 'false';
        });
        // Ativa o clicado
        itemEl.style.background = '#eff6ff';
        itemEl.dataset.ativo = 'true';

        trocaAtiva = troca.id;
        destinatarioAtivo = outraPessoa;

        // Atualiza header
        if (chatHeaderName)   chatHeaderName.textContent = nomePessoa;
        if (chatHeaderStatus) chatHeaderStatus.innerHTML = `<span class="chat-header__online">${troca.status}</span>`;

        // Habilita o input
        if (chatInput) {
            chatInput.disabled = false;
            chatInput.placeholder = 'Digite sua mensagem...';
        }
        if (sendBtn) sendBtn.disabled = false;

        // Carrega mensagens
        if (messagesContainer) {
            messagesContainer.innerHTML = '<p style="text-align:center;color:#9ca3af;padding:32px 20px;font-size:13px;">Carregando mensagens...</p>';
            try {
                const mensagens = await MensagemAPI.listarPorTroca(trocaAtiva);
                renderizarMensagens(mensagens || []);
            } catch (err) {
                messagesContainer.innerHTML = '<p style="text-align:center;color:#9ca3af;padding:32px 20px;font-size:13px;">Nenhuma mensagem ainda. Inicie a conversa!</p>';
            }
        }
    }

    // ─── Renderiza mensagens ──────────────────────────────────────────────
    function renderizarMensagens(mensagens) {
        if (!messagesContainer) return;

        if (mensagens.length === 0) {
            messagesContainer.innerHTML = '<p style="text-align:center;color:#9ca3af;padding:32px 20px;font-size:13px;">Nenhuma mensagem ainda. Inicie a conversa!</p>';
            return;
        }

        messagesContainer.innerHTML = '';
        mensagens.forEach(msg => {
            const isMine = msg.remetente?.id === aluno.id;
            const hora = msg.dataEnvio
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
            // Não deve acontecer pois o botão fica desabilitado, mas por segurança:
            alert('Selecione uma conversa antes de enviar uma mensagem.');
            return;
        }

        chatInput.value = '';

        // Exibe localmente (otimismo)
        const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
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

        // Persiste no backend
        try {
            await MensagemAPI.enviar({
                mensagem:     text,
                remetente:    { id: aluno.id },
                destinatario: { id: destinatarioAtivo.id },
                troca:        { id: trocaAtiva }
            });
        } catch (err) {
            console.warn('Erro ao enviar mensagem:', err.message);
        }
    };

    if (sendBtn)   sendBtn.addEventListener('click', enviarMensagem);
    if (chatInput) chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') enviarMensagem(); });

    // ─── Estado sem conversa selecionada ──────────────────────────────────
    function definirEstadoSemConversa() {
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#9ca3af;text-align:center;padding:40px;">
                    <svg style="width:56px;height:56px;margin-bottom:16px;opacity:0.3;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    <p style="font-size:15px;font-weight:600;margin:0 0 6px;">Selecione uma conversa</p>
                    <p style="font-size:13px;margin:0;opacity:0.7;">Escolha uma troca na lista ao lado para ver as mensagens.</p>
                </div>`;
        }
        if (chatInput) {
            chatInput.disabled = true;
            chatInput.placeholder = 'Selecione uma conversa...';
        }
        if (sendBtn) sendBtn.disabled = true;
    }

    // ─── Helper: escapa HTML para prevenir XSS ────────────────────────────
    function escapeHtml(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
});

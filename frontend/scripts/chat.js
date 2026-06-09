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

    const chatInput       = document.querySelector('.chat-input__field input');
    const sendBtn         = document.querySelector('.chat-input__send-btn');
    const messagesContainer = document.querySelector('.chat-messages');
    const conversationList  = document.querySelector('.conversation-list, .conversations-sidebar, .sidebar');

    let trocaAtiva = null;   // ID da troca selecionada
    let destinatarioAtivo = null;  // Aluno para quem vai enviar

    // ─── Carrega lista de trocas do aluno (recebidas + enviadas) ─────────
    let todasTrocas = [];
    try {
        const [recebidas, enviadas] = await Promise.all([
            apiFetch(`http://localhost:8080/trocas/receptor?value=${aluno.id}`),
            apiFetch(`http://localhost:8080/trocas/solicitante?value=${aluno.id}`)
        ]);
        todasTrocas = [...(recebidas || []), ...(enviadas || [])];
    } catch (err) {
        console.warn('Não foi possível carregar trocas:', err.message);
    }

    // ─── Popula a sidebar de conversas ───────────────────────────────────
    if (conversationList && todasTrocas.length > 0) {
        // Limpa itens estáticos mas preserva a estrutura
        const staticItems = conversationList.querySelectorAll('.conversation-item');
        staticItems.forEach(el => el.remove());

        todasTrocas.forEach(troca => {
            const outraPessoa = troca.solicitante?.id === aluno.id
                ? troca.receptor
                : troca.solicitante;
            const nomePessoa = outraPessoa?.nome || 'Aluno';
            const nomeItem   = troca.itemDesejado?.nome || troca.itemOfertado?.nome || 'Item';

            const item = document.createElement('div');
            item.className = 'conversation-item';
            item.dataset.trocaId = troca.id;
            item.innerHTML = `
                <div class="conversation-avatar" style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#1e3a5f,#0056b3);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:16px;flex-shrink:0;">
                    ${nomePessoa.charAt(0).toUpperCase()}
                </div>
                <div class="conversation-info" style="flex:1;min-width:0;">
                    <div style="font-weight:600;font-size:14px;">${nomePessoa}</div>
                    <div style="font-size:12px;color:#6b7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${nomeItem}</div>
                </div>
                <span style="font-size:10px;padding:2px 6px;border-radius:4px;background:${troca.status==='PENDENTE'?'#fef3c7':troca.status==='ACEITA'?'#dcfce7':'#fee2e2'};color:${troca.status==='PENDENTE'?'#92400e':troca.status==='ACEITA'?'#166534':'#991b1b'};">${troca.status}</span>`;

            item.style.cssText = 'display:flex;align-items:center;gap:12px;padding:12px;cursor:pointer;border-bottom:1px solid #f3f4f6;';
            item.addEventListener('click', () => selecionarConversa(troca, item, nomePessoa, outraPessoa));
            conversationList.appendChild(item);
        });

        // Seleciona a primeira automaticamente
        const primeiro = conversationList.querySelector('.conversation-item');
        if (primeiro) primeiro.click();

    } else if (conversationList && todasTrocas.length === 0) {
        conversationList.innerHTML += '<p style="padding:16px;color:#888;font-size:13px;">Nenhuma troca iniciada ainda.</p>';
    }

    // ─── Seleciona conversa e carrega mensagens ───────────────────────────
    async function selecionarConversa(troca, itemEl, nomePessoa, outraPessoa) {
        document.querySelectorAll('.conversation-item').forEach(c => c.style.background = '');
        itemEl.style.background = '#f0f9ff';

        trocaAtiva = troca.id;
        destinatarioAtivo = outraPessoa;

        // Título do chat
        const chatTitle = document.querySelector('.chat-header h2, .chat-title, .contact-name');
        if (chatTitle) chatTitle.textContent = nomePessoa;

        // Carrega mensagens
        if (messagesContainer) {
            messagesContainer.innerHTML = '<p style="text-align:center;color:#9ca3af;padding:20px;font-size:13px;">Carregando mensagens...</p>';
            try {
                const mensagens = await MensagemAPI.listarPorTroca(trocaAtiva);
                renderizarMensagens(mensagens || []);
            } catch (err) {
                messagesContainer.innerHTML = '<p style="text-align:center;color:#9ca3af;padding:20px;font-size:13px;">Nenhuma mensagem ainda. Inicie a conversa!</p>';
            }
        }
    }

    // ─── Renderiza mensagens no chat ──────────────────────────────────────
    function renderizarMensagens(mensagens) {
        if (!messagesContainer) return;

        if (mensagens.length === 0) {
            messagesContainer.innerHTML = '<p style="text-align:center;color:#9ca3af;padding:20px;font-size:13px;">Nenhuma mensagem ainda. Inicie a conversa!</p>';
            return;
        }

        messagesContainer.innerHTML = '';
        mensagens.forEach(msg => {
            const isMine = msg.remetente?.id === aluno.id;
            const hora = msg.dataEnvio
                ? new Date(msg.dataEnvio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                : '';
            const initials = msg.remetente?.nome?.charAt(0)?.toUpperCase() || '?';
            messagesContainer.innerHTML += `
                <div class="message ${isMine ? 'message--sent' : 'message--received'}" style="display:flex;align-items:flex-end;gap:8px;margin-bottom:12px;${isMine?'flex-direction:row-reverse;':''}">
                    <div class="message__avatar-initials" style="width:32px;height:32px;border-radius:50%;background:${isMine?'#0056b3':'#6b7280'};color:white;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;">${initials}</div>
                    <div class="message__content">
                        <div class="message__bubble" style="background:${isMine?'#0056b3':'#f3f4f6'};color:${isMine?'white':'#111'};padding:10px 14px;border-radius:${isMine?'16px 16px 4px 16px':'16px 16px 16px 4px'};max-width:320px;word-break:break-word;">${msg.mensagem}</div>
                        <div class="message__time" style="font-size:11px;color:#9ca3af;margin-top:3px;${isMine?'text-align:right;':''}">
                            ${hora} ${isMine ? '<span>✓</span>' : ''}
                        </div>
                    </div>
                </div>`;
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // ─── Envio de mensagem ────────────────────────────────────────────────
    const enviarMensagem = async () => {
        const text = chatInput?.value?.trim();
        if (!text) return;
        if (!trocaAtiva) {
            alert('Selecione uma conversa antes de enviar uma mensagem.');
            return;
        }
        if (!destinatarioAtivo) return;

        chatInput.value = '';

        // Exibe localmente de imediato (otimismo)
        const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        messagesContainer?.insertAdjacentHTML('beforeend', `
            <div class="message message--sent" style="display:flex;align-items:flex-end;gap:8px;margin-bottom:12px;flex-direction:row-reverse;">
                <div style="width:32px;height:32px;border-radius:50%;background:#0056b3;color:white;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;">${aluno.nome?.charAt(0)?.toUpperCase()}</div>
                <div>
                    <div style="background:#0056b3;color:white;padding:10px 14px;border-radius:16px 16px 4px 16px;max-width:320px;word-break:break-word;">${text}</div>
                    <div style="font-size:11px;color:#9ca3af;margin-top:3px;text-align:right;">${hora} <span>✓</span></div>
                </div>
            </div>`);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Persiste no backend
        try {
            await MensagemAPI.enviar({
                mensagem: text,
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

    // Scroll para o fim ao carregar
    if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

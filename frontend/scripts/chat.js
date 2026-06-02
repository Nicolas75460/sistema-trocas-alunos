/**
 * Lógica para a tela de Chat
 * Objetivo: Alternar conversas, enviar novas mensagens e manter o scroll no final.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Alternar entre as conversas na Sidebar
    const conversations = document.querySelectorAll('.conversation-item');
    
    conversations.forEach(conv => {
        conv.addEventListener('click', () => {
            conversations.forEach(c => c.classList.remove('conversation-item--active'));
            conv.classList.add('conversation-item--active');
            // Num sistema real, isso carregaria as mensagens do contato clicado.
        });
    });

    // 2. Enviar nova mensagem
    const chatInput = document.querySelector('.chat-input__field input');
    const sendBtn = document.querySelector('.chat-input__send-btn');
    const messagesContainer = document.querySelector('.chat-messages');

    // Função para renderizar a mensagem na tela
    const sendMessage = () => {
        const text = chatInput.value.trim();
        
        if (text !== '') {
            // Criação da estrutura HTML da nova mensagem
            const messageHTML = `
                <div class="message message--sent">
                    <div class="message__avatar-initials">EU</div>
                    <div class="message__content">
                        <div class="message__bubble">${text}</div>
                        <div class="message__time">
                            Agora
                            <span class="message__read-check">✓</span>
                        </div>
                    </div>
                </div>
            `;
            
            // Adiciona a mensagem ao container
            messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
            
            // Limpa o input e rola o chat para o final
            chatInput.value = '';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };

    // Escuta o clique no botão de enviar
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    // Escuta a tecla "Enter" no input
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Mantém o scroll no final ao carregar a página
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});

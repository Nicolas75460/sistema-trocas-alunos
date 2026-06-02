/**
 * Lógica para a tela de Explorar
 * Objetivo: Favoritar itens e lidar com botões de solicitação.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Sistema de "Like / Favoritar"
    const likeButtons = document.querySelectorAll('.like-btn');
    
    likeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Alterna uma classe no SVG interno para simular preenchimento
            const icon = btn.querySelector('.icon');
            if (icon) {
                // Simples toggle de cor para indicar estado ativo
                const isLiked = icon.style.color === 'red';
                icon.style.color = isLiked ? 'currentColor' : 'red';
            }
        });
    });

    // Botão de solicitar troca
    const requestButtons = document.querySelectorAll('.btn-request');
    
    requestButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const itemName = e.target.closest('.item-info').querySelector('h3').innerText;
            alert(`Você iniciou uma solicitação de troca para: ${itemName}`);
            // Redirecionaria para o chat ou abriria modal
        });
    });
});

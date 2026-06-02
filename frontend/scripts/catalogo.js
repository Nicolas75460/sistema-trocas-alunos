/**
 * Lógica para a tela de Catálogo
 * Objetivo: Simular o funcionamento dos filtros laterais.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Filtros de Categoria Laterais
    const filterItems = document.querySelectorAll('.filter-item');
    
    filterItems.forEach(item => {
        item.addEventListener('click', () => {
            // Desmarca todos e marca o clicado
            filterItems.forEach(f => f.classList.remove('active'));
            item.classList.add('active');
            
            // Em uma aplicação real, faria um fetch na API para filtrar os produtos
        });
    });

    // Feedback visual nos botões de "Ver Detalhes"
    const btnDetalhes = document.querySelectorAll('.product-info .btn');
    
    btnDetalhes.forEach(btn => {
        btn.addEventListener('click', () => {
            // Em um fluxo real, redirecionaria para a página específica do produto
            console.log('Redirecionando para os detalhes do produto...');
        });
    });
});

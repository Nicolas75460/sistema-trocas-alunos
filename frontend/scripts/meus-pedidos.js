/**
 * Lógica para a tela de Meus Pedidos
 * Objetivo: Alternar entre as abas e lidar com as ações de Aceitar/Recusar pedidos.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Lógica das Abas (Sidebar)
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove a classe 'active' de todos os itens
            navItems.forEach(nav => nav.classList.remove('active'));
            // Adiciona a classe 'active' apenas no item clicado
            item.classList.add('active');
            
            // Aqui poderia entrar a lógica para filtrar os cards (Recebidos vs Enviados)
        });
    });

    // Lógica das Ações (Aceitar / Recusar)
    const btnAceitar = document.querySelectorAll('.btn-aceitar');
    const btnRecusar = document.querySelectorAll('.btn-recusar');

    btnAceitar.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.pedido-card');
            alert('Pedido de troca aceito com sucesso!');
            card.remove(); // Remove o card da tela
        });
    });

    btnRecusar.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.pedido-card');
            if (confirm('Tem certeza que deseja recusar este pedido?')) {
                card.remove(); // Remove o card da tela
            }
        });
    });
});

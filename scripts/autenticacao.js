/**
 * Lógica para as telas de Autenticação (Login e Cadastro)
 * Objetivo: Validar o formulário de forma simples e simular o redirecionamento.
 */
document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.querySelector('.auth-form');

    if (authForm) {
        authForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Evita o recarregamento da página
            
            const submitBtn = authForm.querySelector('.auth-submit-btn');
            const originalText = submitBtn.innerHTML;

            // Simula o estado de "Carregando"
            submitBtn.innerHTML = 'Processando...';
            submitBtn.disabled = true;

            // Simula uma requisição assíncrona (ex: API de login) com delay de 1 segundo
            setTimeout(() => {
                // Em um cenário real, aqui seria validado o token.
                // Como é o Front-End, apenas redirecionamos.
                window.location.href = 'explorar.html';
            }, 1000);
        });
    }
});

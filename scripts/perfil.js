/**
 * Lógica para a tela de Perfil
 * Objetivo: Lidar com a edição de dados do usuário, mudança de foto de perfil e navegação em abas.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Lógica para Alternar Abas (ex: "Meus Itens", "Configurações")
    const profileTabs = document.querySelectorAll('.profile-tab'); // Botões das abas
    const profileContents = document.querySelectorAll('.profile-content'); // Conteúdo das abas

    profileTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove a classe ativa de todas as abas
            profileTabs.forEach(t => t.classList.remove('active'));
            // Adiciona a classe ativa apenas na aba clicada
            tab.classList.add('active');

            // Se o seu HTML usar data-target para mostrar o conteúdo correto:
            const targetId = tab.getAttribute('data-target');
            if (targetId) {
                profileContents.forEach(content => content.classList.remove('active'));
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            }
        });
    });

    // 2. Lógica para Edição de Perfil
    const btnEditProfile = document.querySelector('.btn-edit-profile');
    const profileInputs = document.querySelectorAll('.profile-form input');

    if (btnEditProfile) {
        btnEditProfile.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Verifica se o formulário já está em modo de edição
            const isEditing = btnEditProfile.classList.contains('editing');

            if (isEditing) {
                // Ação de SALVAR
                btnEditProfile.innerHTML = 'Editar Perfil';
                btnEditProfile.classList.remove('editing');
                
                // Desabilita os inputs novamente para modo leitura
                profileInputs.forEach(input => input.setAttribute('readonly', true));
                
                alert('Dados do perfil atualizados com sucesso!');
                // Num sistema real, aqui você enviaria os dados (fetch/axios) para o backend
            } else {
                // Ação de EDITAR
                btnEditProfile.innerHTML = 'Salvar Alterações';
                btnEditProfile.classList.add('editing');
                
                // Remove o readonly para permitir a digitação
                profileInputs.forEach(input => input.removeAttribute('readonly'));
                
                // Dá o foco no primeiro input do formulário automaticamente
                if (profileInputs.length > 0) {
                    profileInputs[0].focus();
                }
            }
        });
    }

    // 3. Simulação de troca de Foto do Avatar
    // Assume que existe um <input type="file" id="avatar-upload"> escondido
    const avatarInput = document.getElementById('avatar-upload');
    const avatarImage = document.querySelector('.profile-avatar img');

    if (avatarInput && avatarImage) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Cria uma URL temporária (blob) para mostrar a imagem selecionada pelo usuário
                const imageURL = URL.createObjectURL(file);
                avatarImage.src = imageURL;
            }
        });
    }
});

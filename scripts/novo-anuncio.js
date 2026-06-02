/**
 * Lógica para a tela de Novo Anúncio
 * Objetivo: Seleção de tipo, upload e pré-visualização de múltiplas fotos, e simulação de publicação.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Lógica do Tipo de Oferta (Produto ou Serviço) ---
    const typeOptions = document.querySelectorAll('.type-option');
    
    typeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault(); 
            // Remove a seleção de todas as opções e marca apenas a clicada
            typeOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });

    // --- 2. Lógica de Upload e Preview de Fotos ---
    // Assumindo que no seu HTML exista um input file e um container para as miniaturas
    const photoInput = document.getElementById('upload-fotos'); 
    const previewContainer = document.getElementById('preview-container');
    
    // Array para guardar os arquivos selecionados (útil para enviar ao backend depois)
    let selectedFiles = [];

    if (photoInput && previewContainer) {
        photoInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);

            files.forEach(file => {
                // Valida se o arquivo é realmente uma imagem
                if (file.type.startsWith('image/')) {
                    selectedFiles.push(file);

                    // Cria um objeto URL temporário para visualização rápida na tela
                    const imageURL = URL.createObjectURL(file);

                    // Cria os elementos do DOM para a miniatura
                    const previewWrapper = document.createElement('div');
                    previewWrapper.classList.add('photo-preview-item');
                    // Estilo embutido apenas como segurança, mas recomendo colocar na sua folha de CSS
                    previewWrapper.style.position = 'relative'; 
                    previewWrapper.style.display = 'inline-block';

                    const imgElement = document.createElement('img');
                    imgElement.src = imageURL;
                    imgElement.classList.add('preview-img');

                    // Cria o botão de remover a foto
                    const removeBtn = document.createElement('button');
                    removeBtn.innerHTML = '&times;'; // Símbolo de "X"
                    removeBtn.classList.add('btn-remove-photo');
                    
                    // Lógica para remover a foto da visualização e do array
                    removeBtn.addEventListener('click', () => {
                        previewWrapper.remove();
                        // Libera memória do navegador
                        URL.revokeObjectURL(imageURL); 
                        // Remove o arquivo da nossa lista
                        selectedFiles = selectedFiles.filter(f => f !== file);
                    });

                    // Monta a estrutura e joga na tela
                    previewWrapper.appendChild(imgElement);
                    previewWrapper.appendChild(removeBtn);
                    previewContainer.appendChild(previewWrapper);
                }
            });

            // Reseta o input para permitir selecionar a mesma foto novamente se o usuário apagou
            photoInput.value = ''; 
        });
    }

    // --- 3. Simulação de "Publicar Anúncio" ---
    const publishBtn = document.querySelector('.btn-publish');
    
    if (publishBtn) {
        publishBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const itemName = document.getElementById('item-name').value;
            const category = document.getElementById('category').value;
            
            // Validação simples
            if (!itemName || !category) {
                alert('Por favor, preencha o nome do item e a categoria.');
                return;
            }

            if (selectedFiles.length === 0) {
                const wantsToContinue = confirm('Você não adicionou fotos. Deseja publicar mesmo assim?');
                if (!wantsToContinue) return;
            }

            // Simula o carregamento e sucesso
            publishBtn.innerHTML = 'Publicando...';
            publishBtn.disabled = true;

            setTimeout(() => {
                alert('Anúncio publicado com sucesso!');
                window.location.href = 'explorar.html'; // Redireciona para explorar
            }, 800);
        });
    }
});

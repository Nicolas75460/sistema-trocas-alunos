/**
 * novo-anuncio.js — Publicação de itens conectada à API real.
 * Requer que o aluno esteja logado (sessão salva pelo autenticacao.js).
 */
document.addEventListener('DOMContentLoaded', async () => {

    // ─── Verifica se o aluno está logado ─────────────────────────────────
    const aluno = getSessao();
    if (!aluno) {
        alert('Você precisa estar logado para publicar um anúncio.');
        window.location.href = 'login.html';
        return;
    }

    // ─── Popula select de categorias com dados da API ─────────────────────
    const selectCategoria = document.getElementById('category');
    if (selectCategoria) {
        try {
            const categorias = await CategoriaAPI.listarTodas();
            if (categorias && categorias.length > 0) {
                selectCategoria.innerHTML = '<option value="">Selecione uma categoria</option>';
                categorias.forEach(cat => {
                    const opt = document.createElement('option');
                    opt.value = cat.id;
                    opt.textContent = cat.nome;
                    selectCategoria.appendChild(opt);
                });
            }
        } catch (err) {
            console.warn('Não foi possível carregar categorias:', err.message);
            // Mantém as opções estáticas do HTML como fallback
        }
    }

    // ─── Seleção de tipo (Produto / Serviço) ─────────────────────────────
    const typeOptions = document.querySelectorAll('.type-option');
    typeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            typeOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });

    // ─── Upload e pré-visualização de fotos ──────────────────────────────
    const photoInput = document.getElementById('upload-fotos');
    const previewContainer = document.getElementById('preview-container');
    let selectedFiles = [];

    if (photoInput && previewContainer) {
        photoInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    selectedFiles.push(file);
                    const imageURL = URL.createObjectURL(file);

                    const previewWrapper = document.createElement('div');
                    previewWrapper.classList.add('photo-preview-item');
                    previewWrapper.style.cssText = 'position:relative;display:inline-block;margin:4px;';

                    const imgElement = document.createElement('img');
                    imgElement.src = imageURL;
                    imgElement.classList.add('preview-img');
                    imgElement.style.cssText = 'width:80px;height:80px;object-fit:cover;border-radius:6px;';

                    const removeBtn = document.createElement('button');
                    removeBtn.innerHTML = '&times;';
                    removeBtn.classList.add('btn-remove-photo');
                    removeBtn.style.cssText = 'position:absolute;top:-6px;right:-6px;background:#ef4444;color:white;border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:14px;line-height:1;';

                    removeBtn.addEventListener('click', () => {
                        previewWrapper.remove();
                        URL.revokeObjectURL(imageURL);
                        selectedFiles = selectedFiles.filter(f => f !== file);
                    });

                    previewWrapper.appendChild(imgElement);
                    previewWrapper.appendChild(removeBtn);
                    previewContainer.appendChild(previewWrapper);
                }
            });
            photoInput.value = '';
        });
    }

    // ─── Publicar Anúncio ─────────────────────────────────────────────────
    const publishBtn = document.querySelector('.btn-publish');
    if (publishBtn) {
        publishBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const itemName = document.getElementById('item-name')?.value?.trim();
            const categoriaId = document.getElementById('category')?.value;
            const descricao = document.getElementById('description')?.value?.trim() || '';

            if (!itemName) {
                mostrarAlerta('Por favor, informe o nome do item.', 'erro');
                return;
            }
            if (!categoriaId) {
                mostrarAlerta('Por favor, selecione uma categoria.', 'erro');
                return;
            }

            publishBtn.textContent = 'Publicando...';
            publishBtn.disabled = true;

            try {
                const payload = {
                    nome: itemName,
                    descricao: descricao,
                    aluno: { id: aluno.id },
                    categoria: { id: parseInt(categoriaId) }
                };

                await ItemAPI.cadastrar(payload);
                mostrarAlerta('Anúncio publicado com sucesso! Redirecionando...', 'sucesso');
                setTimeout(() => { window.location.href = 'explorar.html'; }, 1200);
            } catch (err) {
                mostrarAlerta(`Erro ao publicar anúncio: ${err.message}`, 'erro');
                publishBtn.textContent = 'Publicar Anúncio';
                publishBtn.disabled = false;
            }
        });
    }

    // ─── Helper de alerta visual ─────────────────────────────────────────
    function mostrarAlerta(msg, tipo = 'erro') {
        let alertEl = document.querySelector('.anuncio-alert');
        if (!alertEl) {
            alertEl = document.createElement('div');
            alertEl.className = 'anuncio-alert';
            const container = document.querySelector('.form-actions') || publishBtn?.parentElement;
            if (container) container.insertBefore(alertEl, container.firstChild);
        }
        const isErro = tipo === 'erro';
        alertEl.style.cssText = `padding:12px 16px; border-radius:8px; margin-bottom:12px; font-size:14px;
            background:${isErro ? '#fee2e2' : '#dcfce7'};
            border:1px solid ${isErro ? '#fca5a5' : '#86efac'};
            color:${isErro ? '#991b1b' : '#166534'};`;
        alertEl.textContent = msg;
    }
});

# Expansão — Casos de Uso

---

## 📦 Módulo: Itens

### 1. Publicar item

- **Ator Principal:** Utilizador (Usuário)
- **Resumo:** Permite ao utilizador registar um novo item na plataforma para troca.
- **Pré-condições:** O utilizador deve ter iniciado sessão (estar autenticado).
- **Fluxo Principal:**
  1. O utilizador acede à opção de adicionar item.
  2. Preenche os detalhes (título, descrição, estado de conservação, fotos).
  3. Submete o formulário.
  4. O sistema guarda a informação e torna o item visível.
- **Pós-condições:** O item fica disponível para pesquisa no sistema.

---

### 2. Buscar itens

- **Ator Principal:** Utilizador
- **Resumo:** Permite procurar por itens disponíveis no sistema.
- **Pré-condições:** Nenhuma (ou estar autenticado, dependendo da regra de negócio).
- **Fluxo Principal:**
  1. O utilizador insere uma palavra-chave na barra de pesquisa.
  2. O sistema procura itens correspondentes.
  3. O sistema apresenta a lista de resultados.

---

### 3. Deletar postagem *(Relacionado com Publicar item)*

- **Ator Principal:** Utilizador
- **Resumo:** Permite a remoção de um item que o utilizador publicou anteriormente.
- **Pré-condições:** O utilizador deve ter a sessão iniciada e ser o proprietário do item.
- **Fluxo Principal:**
  1. O utilizador acede aos seus itens publicados.
  2. Seleciona a opção de apagar/eliminar o item.
  3. O sistema pede confirmação.
  4. O utilizador confirma.
  5. O sistema remove o item da base de dados.

---

### 4. Filtrar resultados *(Extensão de Buscar itens)*

- **Ator Principal:** Utilizador
- **Resumo:** Permite aplicar filtros (ex: categoria, localização, condição) para refinar a pesquisa de itens.
- **Pré-condições:** O utilizador deve estar a realizar uma pesquisa ("Buscar itens").
- **Fluxo Principal:**
  1. Na página de pesquisa, o utilizador seleciona os filtros desejados.
  2. O sistema aplica os parâmetros de filtragem.
  3. O sistema atualiza os resultados apresentados no ecrã.

---

## 👤 Módulo: Conta

### 5. Criar conta

- **Ator Principal:** Utilizador (Visitante)
- **Resumo:** Permite que um novo utilizador se registe na plataforma.
- **Pré-condições:** Não possuir um registo prévio com o mesmo endereço de e-mail.
- **Fluxo Principal:**
  1. O visitante acede à página de registo.
  2. Preenche os dados (nome, e-mail, palavra-passe).
  3. O sistema valida os dados e regista o utilizador.
- **Pós-condições:** O utilizador passa a ter credenciais válidas no sistema.

---

### 6. Fazer login

- **Ator Principal:** Utilizador
- **Resumo:** Permite que o utilizador inicie sessão para aceder às funcionalidades restritas.
- **Pré-condições:** Ter uma conta criada.
- **Fluxo Principal:**
  1. O utilizador insere o e-mail e palavra-passe.
  2. Clica em "Entrar".
  3. O sistema invoca "Validar credenciais".
  4. O acesso é concedido.

---

### 7. Validar credenciais *(Inclusão de Fazer login)*

- **Ator Principal:** Sistema
- **Resumo:** Verifica internamente se os dados inseridos no login estão corretos.
- **Pré-condições:** O utilizador ter submetido o formulário de login.
- **Fluxo Principal:**
  1. O sistema recebe as credenciais.
  2. Compara de forma segura com os dados encriptados na base de dados.
  3. Retorna sucesso ou erro (palavra-passe incorreta, e-mail inexistente).

---

### 8. Recuperar senha *(Extensão de Fazer login)*

- **Ator Principal:** Utilizador
- **Resumo:** Permite ao utilizador repor a sua palavra-passe caso se tenha esquecido dela.
- **Pré-condições:** O utilizador não se conseguir autenticar (falha no login).
- **Fluxo Principal:**
  1. Na página de login, clica em "Recuperar senha".
  2. Insere o seu e-mail.
  3. O sistema envia um e-mail com o link de recuperação.
  4. O utilizador define uma nova palavra-passe.

---

## 🔄 Módulo: Trocas

> **Nota:** Todas as ações principais deste módulo acionam a inclusão "Notificar utilizador".

### 9. Propor troca

- **Ator Principal:** Utilizador
- **Resumo:** O utilizador envia uma oferta, sugerindo um dos seus itens em troca do item de outro utilizador.
- **Pré-condições:** Estar autenticado e ter itens próprios disponíveis para oferecer.
- **Fluxo Principal:**
  1. Seleciona o item de interesse de outro utilizador.
  2. Escolhe a opção "Propor troca".
  3. Seleciona o seu próprio item a oferecer.
  4. Confirma a proposta.
  5. O sistema regista o pedido e invoca a notificação.

---

### 10. Aceitar troca

- **Ator Principal:** Utilizador
- **Resumo:** O utilizador proprietário do item decide aceitar a proposta de troca recebida.
- **Pré-condições:** Existir uma proposta de troca pendente.
- **Fluxo Principal:**
  1. O utilizador acede às propostas recebidas.
  2. Visualiza a proposta e clica em "Aceitar".
  3. O sistema atualiza o estado de ambos os itens para "Em troca/Trocado" e invoca a notificação.

---

### 11. Recusar troca

- **Ator Principal:** Utilizador
- **Resumo:** O utilizador declina uma oferta de troca que lhe foi feita.
- **Pré-condições:** Existir uma proposta pendente.
- **Fluxo Principal:**
  1. O utilizador analisa a proposta.
  2. Clica em "Recusar".
  3. O sistema elimina a proposta, mantém os itens disponíveis e invoca a notificação.

---

### 12. Cancelar troca

- **Ator Principal:** Utilizador
- **Resumo:** Permite desistir de uma troca proposta ou já em andamento.
- **Pré-condições:** A troca ainda não ter sido concluída fisicamente.
- **Fluxo Principal:**
  1. O utilizador acede às trocas ativas.
  2. Seleciona "Cancelar".
  3. O sistema atualiza o estado da transação para "Cancelada" e invoca a notificação.

---

### 13. Notificar usuário

- **Ator Principal:** Sistema
- **Resumo:** Dispara alertas (via e-mail, app ou painel) sempre que o estado de uma troca é alterado.
- **Pré-condições:** Ocorrer uma ação de propor, aceitar, recusar ou cancelar.
- **Fluxo Principal:**
  1. O sistema processa o tipo de evento.
  2. Identifica o utilizador recetor.
  3. Envia a mensagem correspondente.

---

## 💬 Módulo: Comunicação

### 14. Trocar mensagens

- **Ator Principal:** Utilizador
- **Resumo:** Permite um chat direto entre os utilizadores interessados numa troca.
- **Pré-condições:** Autenticação ativa (geralmente após uma proposta de troca ser iniciada ou aceite).
- **Fluxo Principal:**
  1. O utilizador acede ao chat da troca.
  2. Escreve a mensagem.
  3. O sistema entrega a mensagem ao outro utilizador.

---

### 15. Avaliar usuário

- **Ator Principal:** Utilizador
- **Resumo:** Permite atribuir uma classificação/nota a outro utilizador após a conclusão do negócio.
- **Pré-condições:** Uma troca entre os dois utilizadores ter sido finalizada com sucesso.
- **Fluxo Principal:**
  1. O utilizador acede ao perfil ou histórico de trocas.
  2. Seleciona a opção de avaliação (ex: 1 a 5 estrelas) e escreve um comentário.
  3. O sistema guarda a nota e calcula a média do utilizador avaliado.

---

### 16. Denunciar usuário

- **Ator Principal:** Utilizador
- **Resumo:** Permite reportar um utilizador por conduta imprópria, fraude ou quebra de regras.
- **Pré-condições:** Sessão iniciada.
- **Fluxo Principal:**
  1. O utilizador acede ao perfil do infrator.
  2. Clica em "Denunciar".
  3. Escolhe o motivo e fornece detalhes.
  4. O sistema envia a queixa para o Administrador.

---

## 🛡️ Módulo: Administração

### 17. Ver relatórios

- **Ator Principal:** Administrador
- **Resumo:** Permite aceder a estatísticas gerais do sistema (número de trocas, utilizadores ativos, etc.).
- **Pré-condições:** Estar autenticado com privilégios de Administração.
- **Fluxo Principal:**
  1. O Administrador acede ao "Painel (Dashboard)".
  2. Seleciona a secção de relatórios.
  3. O sistema gera e apresenta gráficos e métricas.

---

### 18. Moderar postagens

- **Ator Principal:** Administrador
- **Resumo:** Permite analisar, aprovar ou eliminar itens publicados que tenham sido denunciados ou violem termos de uso.
- **Pré-condições:** Ser Administrador do sistema.
- **Fluxo Principal:**
  1. O Administrador acede à fila de moderação/denúncias.
  2. Analisa o item.
  3. Decide apagar o item ou rejeitar a denúncia.
  4. O sistema aplica a alteração.

---

### 19. Gerenciar usuários

- **Ator Principal:** Administrador
- **Resumo:** Permite administrar as contas, podendo bloquear, banir ou reverter ações de utilizadores problemáticos.
- **Pré-condições:** Ser Administrador do sistema.
- **Fluxo Principal:**
  1. Procura pelo perfil do utilizador.
  2. Seleciona o perfil e aplica uma sanção (ex: Bloquear conta).
  3. O sistema suspende o acesso desse utilizador imediatamente.
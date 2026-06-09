--  DML - 5 comandos simples (INSERT, UPDATE, DELETE)
-- 1. Inserir uma nova categoria
INSERT INTO tb_categoria (nome_categoria)
VALUES ('Instrumentos Musicais');
 
-- 2. Inserir um novo item
INSERT INTO tb_item (nome_item, descricao, tb_aluno_id_aluno, tb_categoria_id_categoria)
VALUES ('Violão Clássico', 'Giannini, cordas de nylon, pequeno arranhão na tampa', 5, 8);
 
-- 3. Inserir uma nova mensagem em uma troca existente
INSERT INTO tb_mensagem (data_envio, mensagem, tb_aluno_id_remetente, tb_aluno_id_destinatario, tb_troca_id_troca)
VALUES (NOW(), 'Podemos combinar a troca para amanhã?', 3, 8, 2);
 
-- 4. Atualizar o nome de um item
UPDATE tb_item
SET nome_item = 'Livro Clean Code - Robert C. Martin'
WHERE id_item = 1;
 
-- 5. Deletar uma troca recusada
DELETE FROM tb_troca
WHERE status = 'RECUSADA'
  AND id_troca = 4;
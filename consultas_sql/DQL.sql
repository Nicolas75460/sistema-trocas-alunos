--  DQL - 5 consultas simples
-- 1. Listar todas as categorias cadastradas
SELECT id_categoria, nome_categoria
FROM tb_categoria
ORDER BY nome_categoria;
 
-- 2. Buscar todos os itens de um aluno específico (id = 2)
SELECT
    i.nome_item,
    i.descricao,
    c.nome_categoria
FROM tb_item i
JOIN tb_categoria c ON c.id_categoria = i.tb_categoria_id_categoria
WHERE i.tb_aluno_id_aluno = 2
ORDER BY i.nome_item;
 
-- 3. Listar todas as mensagens de uma troca (id = 2)
SELECT
    m.data_envio,
    a.nome_aluno AS remetente,
    m.mensagem
FROM tb_mensagem m
JOIN tb_aluno a ON a.id_aluno = m.tb_aluno_id_remetente
WHERE m.tb_troca_id_troca = 2
ORDER BY m.data_envio ASC;
 
-- 4. Contar quantos itens existem por aluno
SELECT
    a.nome_aluno,
    COUNT(i.id_item) AS total_itens
FROM tb_aluno a
LEFT JOIN tb_item i ON i.tb_aluno_id_aluno = a.id_aluno
GROUP BY a.id_aluno, a.nome_aluno
ORDER BY total_itens DESC;
 
-- 5. Listar trocas aceitas com data e itens trocados
SELECT
    t.id_troca,
    t.data_criacao,
    i_of.nome_item  AS item_ofertado,
    i_des.nome_item AS item_desejado,
    sol.nome_aluno  AS solicitante,
    rec.nome_aluno  AS receptor
FROM tb_troca t
JOIN tb_item i_of  ON i_of.id_item  = t.tb_item_id_item_ofertado
JOIN tb_item i_des ON i_des.id_item = t.tb_item_id_item_desejado
JOIN tb_aluno sol  ON sol.id_aluno  = t.tb_aluno_id_solicitante
JOIN tb_aluno rec  ON rec.id_aluno  = t.tb_aluno_id_receptor
WHERE t.status = 'ACEITA'
ORDER BY t.data_criacao DESC;
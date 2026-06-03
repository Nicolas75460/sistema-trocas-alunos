-- =====================================
-- CURSOS
-- =====================================

INSERT INTO tb_curso (nome_curso) VALUES
('Análise e Desenvolvimento de Sistemas'),
('Engenharia de Software'),
('Ciência da Computação'),
('Banco de Dados'),
('Redes de Computadores');

-- =====================================
-- CATEGORIAS
-- =====================================

INSERT INTO tb_categoria (nome_categoria) VALUES
('Eletrônicos'),
('Livros'),
('Instrumentos Musicais'),
('Jogos'),
('Esportes'),
('Roupas'),
('Celulares'),
('Informática');

-- =====================================
-- ALUNOS
-- =====================================

INSERT INTO tb_aluno
(nome_aluno, email, senha, tb_curso_id_curso)
VALUES
('Arthur Faria', 'arthur@senai.com', '123456', 1),
('João Silva', 'joao@senai.com', '123456', 2),
('Maria Souza', 'maria@senai.com', '123456', 3),
('Pedro Santos', 'pedro@senai.com', '123456', 4),
('Ana Lima', 'ana@senai.com', '123456', 5),
('Lucas Costa', 'lucas@senai.com', '123456', 1),
('Beatriz Alves', 'beatriz@senai.com', '123456', 2),
('Gabriel Rocha', 'gabriel@senai.com', '123456', 3);

-- =====================================
-- ITENS
-- =====================================

INSERT INTO tb_item
(nome_item, descricao, tb_aluno_id_aluno, tb_categoria_id_categoria)
VALUES
('Notebook Dell', 'Notebook i5 com 16GB RAM', 1, 1),
('Violão Clássico', 'Violão Giannini conservado', 2, 3),
('Livro Java', 'Java Completo atualizado', 3, 2),
('PlayStation 4', 'Console com dois controles', 4, 4),
('Bola de Futebol', 'Bola oficial pouco usada', 5, 5),
('Camisa Oficial', 'Camisa tamanho M', 6, 6),
('iPhone 12', '64GB em ótimo estado', 7, 7),
('Monitor LG', '24 polegadas Full HD', 8, 8);

-- =====================================
-- IMAGENS DOS ITENS
-- =====================================

INSERT INTO tb_imagem_item
(url_imagem, tb_item_id_item)
VALUES
('https://site.com/notebook.jpg', 1),
('https://site.com/violao.jpg', 2),
('https://site.com/livro-java.jpg', 3),
('https://site.com/ps4.jpg', 4),
('https://site.com/bola.jpg', 5),
('https://site.com/camisa.jpg', 6),
('https://site.com/iphone.jpg', 7),
('https://site.com/monitor.jpg', 8);

-- =====================================
-- TROCAS
-- =====================================

INSERT INTO tb_troca
(
data_criacao,
status,
tb_item_id_item_desejado,
tb_item_id_item_ofertado,
tb_aluno_id_receptor,
tb_aluno_id_solicitante
)
VALUES
(NOW(), 'PENDENTE', 1, 2, 1, 2),
(NOW(), 'ACEITA', 4, 3, 4, 3),
(NOW(), 'RECUSADA', 7, 5, 7, 5),
(NOW(), 'PENDENTE', 8, 6, 8, 6),
(NOW(), 'ACEITA', 2, 1, 2, 1);

-- =====================================
-- MENSAGENS
-- =====================================

INSERT INTO tb_mensagem
(
data_envio,
mensagem,
tb_aluno_id_destinatario,
tb_aluno_id_remetente,
tb_troca_id_troca
)
VALUES
(
NOW(),
'Tenho interesse no seu notebook.',
1,
2,
1
),
(
NOW(),
'Podemos combinar a troca amanhã?',
2,
1,
1
),
(
NOW(),
'Troca aceita, vamos marcar um horário.',
4,
3,
2
),
(
NOW(),
'Infelizmente não tenho interesse.',
7,
5,
3
),
(
NOW(),
'Seu monitor ainda está disponível?',
8,
6,
4
),
(
NOW(),
'Sim, está disponível para troca.',
6,
8,
4
);
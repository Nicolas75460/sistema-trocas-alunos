-- Corrige o tipo da coluna 'mensagem' de OID para TEXT se necessário (sem usar blocos PL/pgSQL)
ALTER TABLE tb_mensagem DROP COLUMN IF EXISTS mensagem;
ALTER TABLE tb_mensagem ADD COLUMN mensagem TEXT;

-- Cursos
INSERT INTO tb_curso (id_curso, nome_curso) VALUES
(1, 'Desenvolvimento de Sistemas'),
(2, 'Eletrotécnica'),
(3, 'Mecânica'),
(4, 'Administração')
ON CONFLICT (id_curso) DO NOTHING;

-- Categorias
INSERT INTO tb_categoria (id_categoria, nome_categoria) VALUES
(1, 'Ferramentas'),
(2, 'Livros'),
(3, 'Componentes Eletrônicos'),
(4, 'Outros')
ON CONFLICT (id_categoria) DO NOTHING;

-- Alunos (Senha padrão '123456' em BCrypt)
INSERT INTO tb_aluno (id_aluno, nome_aluno, email, senha, tb_curso_id_curso) VALUES
(1, 'Ana Souza', 'ana.souza@aluno.senai.br', '$2a$10$tf5attArkty15BtXRU66aOePyD4gOJ4EEh977Y52SQReV2y/2uy5e', 1),
(2, 'Bruno Lima', 'bruno.lima@aluno.senai.br', '$2a$10$tf5attArkty15BtXRU66aOePyD4gOJ4EEh977Y52SQReV2y/2uy5e', 2),
(3, 'Carla Dias', 'carla.dias@aluno.senai.br', '$2a$10$tf5attArkty15BtXRU66aOePyD4gOJ4EEh977Y52SQReV2y/2uy5e', 3),
(4, 'Daniela Oliveira', 'daniela.oliveira@aluno.senai.br', '$2a$10$tf5attArkty15BtXRU66aOePyD4gOJ4EEh977Y52SQReV2y/2uy5e', 4),
(5, 'Felipe Rocha', 'felipe.rocha@aluno.senai.br', '$2a$10$tf5attArkty15BtXRU66aOePyD4gOJ4EEh977Y52SQReV2y/2uy5e', 1)
ON CONFLICT (id_aluno) DO NOTHING;

-- Itens
INSERT INTO tb_item (id_item, nome_item, descricao, tb_aluno_id_aluno, tb_categoria_id_categoria) VALUES
(1, 'Livro de Algoritmos em Java', 'Livro usado, em ótimo estado. Ideal para iniciantes no curso de DS.', 1, 2),
(2, 'Placa Arduino Uno R3', 'Placa funcionando perfeitamente, acompanha cabo USB.', 1, 3),
(3, 'Multímetro Digital Minipa', 'Multímetro profissional, com pontas de prova novas.', 2, 1),
(4, 'Protoboard 830 Furos', 'Pouco uso, contatos firmes.', 2, 3),
(5, 'Paquímetro Universal Metal', 'Paquímetro de precisão de 150mm. Marca Mitutoyo.', 3, 1),
(6, 'Apostila de Desenho Técnico', 'Apostila do Senai, bem conservada.', 3, 2),
(7, 'Calculadora Científica Casio', 'Excelente para cálculos matemáticos e estatística.', 4, 4),
(8, 'Livro Introdução à Administração', 'Livro de Chiavenato, capa comum.', 4, 2),
(9, 'Kit de Sensores 37 em 1', 'Kit completo de sensores para Arduino e Raspberry Pi.', 5, 3),
(10, 'Teclado Mecânico RGB', 'Teclado compacto, switch azul, padrão ABNT2.', 5, 4)
ON CONFLICT (id_item) DO NOTHING;

-- Trocas
INSERT INTO tb_troca (id_troca, status, data_criacao, tb_aluno_id_solicitante, tb_aluno_id_receptor, tb_item_id_item_ofertado, tb_item_id_item_desejado) VALUES
(1, 'PENDENTE', '2026-06-10 14:00:00', 5, 1, 9, 2),
(2, 'ACEITA', '2026-06-08 10:30:00', 2, 3, 3, 5),
(3, 'RECUSADA', '2026-06-05 16:15:00', 4, 1, 8, 1),
(4, 'FINALIZADA', '2026-06-01 09:00:00', 4, 2, 7, 3)
ON CONFLICT (id_troca) DO NOTHING;

-- Mensagens
INSERT INTO tb_mensagem (id_mensagem, mensagem, data_envio, tb_aluno_id_remetente, tb_aluno_id_destinatario, tb_troca_id_troca) VALUES
(1, 'Olá Ana, tudo bem? Tenho interesse na sua placa Arduino. Gostaria de trocar pelo meu Kit de Sensores 37 em 1?', '2026-06-10 14:01:00', 5, 1, 1),
(2, 'Olá Carla, gostaria de trocar meu multímetro pelo seu paquímetro. Está em bom estado?', '2026-06-08 10:31:00', 2, 3, 2),
(3, 'Oi Bruno, sim! Está ótimo. O multímetro está funcionando certinho?', '2026-06-08 10:45:00', 3, 2, 2),
(4, 'Está sim, com pontas novas. Podemos combinar a troca amanhã no Senai?', '2026-06-08 10:50:00', 2, 3, 2),
(5, 'Combinado! Nos vemos no intervalo.', '2026-06-08 11:00:00', 3, 2, 2),
(6, 'Oi Ana, aceita trocar o livro de Java pelo meu livro de Administração?', '2026-06-05 16:16:00', 4, 1, 3),
(7, 'Oi Daniela, obrigada pelo interesse, mas no momento preciso de componentes eletrônicos. Desculpe!', '2026-06-05 17:00:00', 1, 4, 3),
(8, 'Oi Bruno, aceita a calculadora em troca do multímetro?', '2026-06-01 09:05:00', 4, 2, 4),
(9, 'Aceito sim! Fechado.', '2026-06-01 09:12:00', 2, 4, 4)
ON CONFLICT (id_mensagem) DO NOTHING;

-- Ajusta os contadores de sequência após inserções manuais de ID
SELECT setval(pg_get_serial_sequence('tb_curso', 'id_curso'), COALESCE(max(id_curso), 1)) FROM tb_curso;
SELECT setval(pg_get_serial_sequence('tb_categoria', 'id_categoria'), COALESCE(max(id_categoria), 1)) FROM tb_categoria;
SELECT setval(pg_get_serial_sequence('tb_aluno', 'id_aluno'), COALESCE(max(id_aluno), 1)) FROM tb_aluno;
SELECT setval(pg_get_serial_sequence('tb_item', 'id_item'), COALESCE(max(id_item), 1)) FROM tb_item;
SELECT setval(pg_get_serial_sequence('tb_troca', 'id_troca'), COALESCE(max(id_troca), 1)) FROM tb_troca;
SELECT setval(pg_get_serial_sequence('tb_mensagem', 'id_mensagem'), COALESCE(max(id_mensagem), 1)) FROM tb_mensagem;

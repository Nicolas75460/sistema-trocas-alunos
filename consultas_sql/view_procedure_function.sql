--  VIEW - Resumo de itens disponíveis para troca

CREATE OR REPLACE VIEW vw_itens_disponiveis AS
SELECT
    i.id_item,
    i.nome_item,
    i.descricao,
    c.nome_categoria,
    a.nome_aluno  AS dono,
    cur.nome_curso AS curso_dono
FROM tb_item i
JOIN tb_aluno a     ON a.id_aluno      = i.tb_aluno_id_aluno
JOIN tb_categoria c ON c.id_categoria  = i.tb_categoria_id_categoria
JOIN tb_curso cur    ON cur.id_curso     = a.tb_curso_id_curso
ORDER BY c.nome_categoria, i.nome_item;


--  PROCEDURE - Cadastrar uma nova troca

CREATE OR REPLACE PROCEDURE sp_cadastrar_troca(
    p_id_item_ofertado  INTEGER,
    p_id_item_desejado  INTEGER,
    p_id_solicitante    INTEGER,
    p_id_receptor       INTEGER
)
LANGUAGE plpgsql AS $$
BEGIN
    -- Impede que o aluno abra uma troca consigo mesmo
    IF p_id_solicitante = p_id_receptor THEN
        RAISE EXCEPTION 'Um aluno não pode solicitar troca consigo mesmo.';
    END IF;
 
    INSERT INTO tb_troca (
        data_criacao,
        status,
        tb_item_id_item_ofertado,
        tb_item_id_item_desejado,
        tb_aluno_id_solicitante,
        tb_aluno_id_receptor
    ) VALUES (
        NOW(),
        'PENDENTE',
        p_id_item_ofertado,
        p_id_item_desejado,
        p_id_solicitante,
        p_id_receptor
    );
 
    RAISE NOTICE 'Troca cadastrada com sucesso entre aluno % e aluno %.', p_id_solicitante, p_id_receptor;
END;
$$;


--  FUNCTION - Buscar nome completo do aluno por id

CREATE OR REPLACE FUNCTION fn_nome_aluno(p_id_aluno INTEGER)
RETURNS VARCHAR AS $$
DECLARE
    v_nome VARCHAR;
BEGIN
    SELECT nome_aluno INTO v_nome
    FROM tb_aluno
    WHERE id_aluno = p_id_aluno;
 
    IF v_nome IS NULL THEN
        RAISE EXCEPTION 'Aluno de id % não encontrado.', p_id_aluno;
    END IF;
 
    RETURN v_nome;
END;
$$ LANGUAGE plpgsql;
 

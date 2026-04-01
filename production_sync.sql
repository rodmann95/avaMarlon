-- =========================================================
-- SYNC DE PRODUÇÃO: TABELAS FALTANTES E AJUSTES DE LÓGICA
-- =========================================================

-- 1. Tabela de Notificações (Realtime Ready)
CREATE TABLE IF NOT EXISTS public.notificacoes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  titulo text NOT NULL,
  mensagem text NOT NULL,
  lida boolean DEFAULT false,
  tipo text DEFAULT 'info', -- 'info', 'sucesso', 'alerta', 'erro'
  link text, -- Para onde ir ao clicar
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem suas próprias notificações" 
ON public.notificacoes FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários marcam suas notificações como lidas" 
ON public.notificacoes FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (lida IS NOT NULL);

-- 2. Ajuste na tabela de Usuários para facilitar o CRUD Administrativo
-- Adicionando metadata de status se não existir
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS ativo boolean DEFAULT true;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS ultima_atividade timestamp with time zone;

-- 3. Função para Atualizar Progresso do Curso Automaticamente
-- Quando uma aula é concluída, recalculamos o percentual do curso
CREATE OR REPLACE FUNCTION public.atualizar_progresso_curso()
RETURNS TRIGGER AS $$
DECLARE
    v_curso_id uuid;
    v_total_aulas bigint;
    v_aulas_concluidas bigint;
    v_percentual integer;
BEGIN
    -- Busca o curso_id através da aula
    SELECT m.curso_id INTO v_curso_id 
    FROM public.aulas a
    JOIN public.modulos m ON a.modulo_id = m.id
    WHERE a.id = NEW.aula_id;

    -- Conta total de aulas do curso
    SELECT COUNT(*) INTO v_total_aulas 
    FROM public.aulas a
    JOIN public.modulos m ON a.modulo_id = m.id
    WHERE m.curso_id = v_curso_id;

    -- Conta aulas concluídas pelo usuário no curso
    SELECT COUNT(*) INTO v_aulas_concluidas
    FROM public.progresso_aulas pa
    JOIN public.aulas a ON pa.aula_id = a.id
    JOIN public.modulos m ON a.modulo_id = m.id
    WHERE m.curso_id = v_curso_id AND pa.user_id = NEW.user_id AND pa.concluida = true;

    -- Lógica de percentual
    IF v_total_aulas > 0 THEN
        v_percentual := (v_aulas_concluidas * 100) / v_total_aulas;
    ELSE
        v_percentual := 0;
    END IF;

    -- Upsert no progresso_cursos
    INSERT INTO public.progresso_cursos (user_id, curso_id, percentual, concluido_em)
    VALUES (NEW.user_id, v_curso_id, v_percentual, CASE WHEN v_percentual = 100 THEN now() ELSE NULL END)
    ON CONFLICT (user_id, curso_id) 
    DO UPDATE SET 
        percentual = v_percentual,
        concluido_em = CASE WHEN v_percentual = 100 THEN now() ELSE public.progresso_cursos.concluido_em END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para disparar o cálculo após insert/update no progresso_aulas
DROP TRIGGER IF EXISTS tr_atualizar_progresso_curso ON public.progresso_aulas;
CREATE TRIGGER tr_atualizar_progresso_curso
AFTER INSERT OR UPDATE OF concluida ON public.progresso_aulas
FOR EACH ROW EXECUTE FUNCTION public.atualizar_progresso_curso();

-- 4. Notificações Automáticas (Exemplo: Ao concluir o curso)
CREATE OR REPLACE FUNCTION public.notificar_conclusao_curso()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.percentual = 100 AND (OLD.percentual < 100 OR OLD.percentual IS NULL) THEN
        INSERT INTO public.notificacoes (user_id, titulo, mensagem, tipo, link)
        VALUES (
            NEW.user_id, 
            'Parabéns! 🎓', 
            'Você concluiu 100% do curso. Seu certificado está sendo gerado.', 
            'sucesso',
            '/dashboard/certificados'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_notificar_conclusao_curso
AFTER UPDATE OF percentual ON public.progresso_cursos
FOR EACH ROW EXECUTE FUNCTION public.notificar_conclusao_curso();

-- POLÍTICAS DE SEGURANÇA (RLS) - EDUFORMAÇÃO SEMED (PRODUÇÃO)
-- Este script ativa a segurança de linha para garantir que cursistas só vejam seus dados 
-- e admins tenham acesso total de gestão.

-- 1. Habilitar RLS em todas as tabelas (incluindo as de gestão)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escolas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trilhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progresso_cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progresso_aulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens_forum ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topicos_forum ENABLE ROW LEVEL SECURITY;

-- FUNÇÃO AUXILIAR: Verificar se o usuário atual é ADMIN
-- (Baseado na coluna 'role' da nossa tabela users)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Políticas para 'users' (Perfil e Gestão)
DROP POLICY IF EXISTS "Visibilidade de Perfil" ON public.users;
CREATE POLICY "Visibilidade de Perfil" ON public.users 
  FOR SELECT USING (auth.uid() = id OR is_admin());

DROP POLICY IF EXISTS "Gestão de Usuários por Admin" ON public.users;
CREATE POLICY "Gestão de Usuários por Admin" ON public.users 
  FOR UPDATE USING (is_admin());

-- 3. Políticas para 'escolas' (Leitura Pública / Gestão Admin)
DROP POLICY IF EXISTS "Leitura de Escolas" ON public.escolas;
CREATE POLICY "Leitura de Escolas" ON public.escolas 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Gestão de Escolas por Admin" ON public.escolas;
CREATE POLICY "Gestão de Escolas por Admin" ON public.escolas 
  FOR ALL USING (is_admin());

-- 4. Políticas para 'cursos' e 'trilhas' (Leitura Pública / Gestão Admin)
DROP POLICY IF EXISTS "Leitura de Trilhas" ON public.trilhas;
CREATE POLICY "Leitura de Trilhas" ON public.trilhas FOR SELECT USING (true);
DROP POLICY IF EXISTS "Gestão de Trilhas Admin" ON public.trilhas;
CREATE POLICY "Gestão de Trilhas Admin" ON public.trilhas FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Leitura de Cursos" ON public.cursos;
CREATE POLICY "Leitura de Cursos" ON public.cursos FOR SELECT USING (true);
DROP POLICY IF EXISTS "Gestão de Cursos Admin" ON public.cursos;
CREATE POLICY "Gestão de Cursos Admin" ON public.cursos FOR ALL USING (is_admin());

-- 5. Políticas para 'progresso_cursos' e 'progresso_aulas'
DROP POLICY IF EXISTS "Meus Progressos" ON public.progresso_cursos;
CREATE POLICY "Meus Progressos" ON public.progresso_cursos FOR ALL USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Meus Progressos de Aula" ON public.progresso_aulas;
CREATE POLICY "Meus Progressos de Aula" ON public.progresso_aulas FOR ALL USING (auth.uid() = user_id OR is_admin());

-- 6. Políticas para Fórum (Leitura Pública / Escrita Autenticada / Remoção Admin)
DROP POLICY IF EXISTS "Acesso público tópicos" ON public.topicos_forum;
CREATE POLICY "Acesso público tópicos" ON public.topicos_forum FOR SELECT USING (true);

DROP POLICY IF EXISTS "Moderação tópicos Admin" ON public.topicos_forum;
CREATE POLICY "Moderação tópicos Admin" ON public.topicos_forum FOR DELETE USING (is_admin());

DROP POLICY IF EXISTS "Postagem tópicos" ON public.topicos_forum;
CREATE POLICY "Postagem tópicos" ON public.topicos_forum FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Notificações e Certificados
DROP POLICY IF EXISTS "Minhas Notificacoes" ON public.notificacoes;
CREATE POLICY "Minhas Notificacoes" ON public.notificacoes FOR ALL USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Meus Certificados" ON public.certificados;
CREATE POLICY "Meus Certificados" ON public.certificados FOR SELECT USING (auth.uid() = user_id OR is_admin());

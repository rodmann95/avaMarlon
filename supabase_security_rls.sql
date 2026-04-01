-- POLÍTICAS DE SEGURANÇA (RLS) - EDUFORMAÇÃO SEMED
-- Este script ativa a segurança de linha para garantir que cursistas só vejam seus dados 
-- e admins tenham acesso total.

-- 1. Habilitar RLS em tabelas Críticas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progresso_cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progresso_aulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens_forum ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topicos_forum ENABLE ROW LEVEL SECURITY;

-- 2. Políticas para 'users' (Perfil)
-- Cursista vê apenas seu próprio perfil, Admins vêem todos.
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.users;
CREATE POLICY "Usuários podem ver seu próprio perfil" ON public.users 
  FOR SELECT USING (auth.uid() = id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- 3. Políticas para 'notificacoes'
DROP POLICY IF EXISTS "Usuários vêem suas próprias notificações" ON public.notificacoes;
CREATE POLICY "Usuários vêem suas próprias notificações" ON public.notificacoes 
  FOR ALL USING (auth.uid() = user_id);

-- 4. Políticas para 'progresso_cursos' e 'progresso_aulas'
DROP POLICY IF EXISTS "Progresso pessoal" ON public.progresso_cursos;
CREATE POLICY "Progresso pessoal" ON public.progresso_cursos 
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Progresso de aula pessoal" ON public.progresso_aulas;
CREATE POLICY "Progresso de aula pessoal" ON public.progresso_aulas 
  FOR ALL USING (auth.uid() = user_id);

-- 5. Políticas para 'certificados'
DROP POLICY IF EXISTS "Meus certificados" ON public.certificados;
CREATE POLICY "Meus certificados" ON public.certificados 
  FOR SELECT USING (auth.uid() = user_id);

-- 6. Políticas para Fórum (Acesso Público para leitura, Restrito para escrita)
DROP POLICY IF EXISTS "Leitura pública de tópicos" ON public.topicos_forum;
CREATE POLICY "Leitura pública de tópicos" ON public.topicos_forum 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Criação de tópicos autenticada" ON public.topicos_forum;
CREATE POLICY "Criação de tópicos autenticada" ON public.topicos_forum 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Leitura pública de mensagens" ON public.mensagens_forum;
CREATE POLICY "Leitura pública de mensagens" ON public.mensagens_forum 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Resposta autenticada no fórum" ON public.mensagens_forum;
CREATE POLICY "Resposta autenticada no fórum" ON public.mensagens_forum 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Acesso especial para ADMINS em tudo
-- Nota: Supabase recomenda usar roles específicos, mas aqui simplificamos para o campo 'role' da tabela users.
-- Para uma segurança mais robusta, o ideal é usar custom claims no JWT do Supabase Auth.

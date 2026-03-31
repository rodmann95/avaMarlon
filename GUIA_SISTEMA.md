# 📘 Guia Master: Rotas e Gestão de Usuários (EduFormação)

Neste documento estão mapeadas todas as rotas de telas do sistema e o passo a passo de como fabricar perfis (Cursista x Administrador) usando o Supabase.

---

## 🗺️ 1. Mapa de Rotas e Telas (O que faz o quê?)

Certifique-se de estar rodando `npm run dev`. O seu domínio base local é `http://localhost:3000`.

### 🏢 Portão Central (Livre Acesso)
- **Login:** [http://localhost:3000/login](http://localhost:3000/login)
  - *Função:* Porta de entrada. Redireciona alunos pro `/dashboard` e chefia para o `/admin` baseando-se na _role_ do banco.
- **Cadastro (LGPD):** [http://localhost:3000/cadastro](http://localhost:3000/cadastro)
  - *Função:* Onde novos professores de Colombo se matriculam. Tem o bloqueio vital de concordância com a coleta de CPF (LGPD).
- **Verificador de Certificado Público:** [http://localhost:3000/validar/123XYZ](http://localhost:3000/validar/123XYZ)
  - *Função:* Rota onde as secretarias digitam a Hash de QR Code para auditar se o certificado do cursista é verdadeiro sem precisarem estar logadas!

### 🎓 Área do Educador Municipal (Visão Cursista)
Estas rotas são bloqueadas e exclusivas. Se um admin entrar, ele vê a visão "Aluno" dele.

- **Dashboard Inicial:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
  - *Função:* Visão de progresso de aulas, horas concluídas com Recharts de mapas de calor.
- **Catálogo & Cursos:** [http://localhost:3000/dashboard/cursos](http://localhost:3000/dashboard/cursos)
  - *Função:* Listagem Netflix-style dos módulos e Trilhas formativas matriculadas.
- **Sala de Aula Virtual:** [http://localhost:3000/dashboard/cursos/1/aula/2](http://localhost:3000/dashboard/cursos/1/aula/2)
  - *Função:* Player de vídeo, apostilas PDF, e as interrupções de Provas (QuizRunner) de tempo limite.
- **Fóruns Pedagógicos:** [http://localhost:3000/dashboard/foruns](http://localhost:3000/dashboard/foruns)
  - *Função:* Hub de conversas e threads de mensagens para os educadores.
- **Diplomas (A4):** [http://localhost:3000/dashboard/certificados](http://localhost:3000/dashboard/certificados)
  - *Função:* Histórico visual de certificados emitidos de modo dinâmico.
- **Histórico Oficial PDF:** [http://localhost:3000/dashboard/historico](http://localhost:3000/dashboard/historico)
  - *Função:* Linha do tempo homologando o currículo daquele professor (Emite PDF para impressão).
- **Análises Pessoais:** [http://localhost:3000/dashboard/indicadores](http://localhost:3000/dashboard/indicadores)
  - *Função:* Gráficos gigantes apenas com o desempenho individual do aluno logado.
- **Centro de Preferências (Perfil):** [http://localhost:3000/dashboard/perfil](http://localhost:3000/dashboard/perfil)
  - *Função:* Troca de senhas, avatar e dados cadastrais.

### 🏛️ Área Governamental (Visão Controle SEMED)
Rotas vitais para cumprimento do item 4 do Edital. Completamente isoladas do módulo aluno.

- **Torre de Controle Base:** [http://localhost:3000/admin](http://localhost:3000/admin)
  - *Função:* Visão executiva. Avisos se há professores faltosos há 30 dias e número de certificados emitidos ontem.
- **Gestão de Cursistas / Polos:** [http://localhost:3000/admin/cursistas](http://localhost:3000/admin/cursistas)
  - *Função:* Tabela de altíssima densidade mapeando progresso. Contém botão Nativo (Client-Side) que gera e baixa as planilhas _.CSV_ dos alunos pro seu Desktop.
- **Métricas de Escolas:** [http://localhost:3000/admin/escolas](http://localhost:3000/admin/escolas)
  - *Função:* Ranqueamento de Engajamento de todas as unidades (escolas) no programa formador.
- **Coração do Edital (Relatórios):** [http://localhost:3000/admin/relatorios](http://localhost:3000/admin/relatorios)
  - *Função:* Hub de impressão dos 5 Cadernos Analíticos. O relatório Nº 5 desdobra um complexo motor que imprime Múltiplas Páginas A4 carimbadas via Browser nativo.
- **Engine de Configurações:** [http://localhost:3000/admin/configuracoes](http://localhost:3000/admin/configuracoes)
  - *Função:* Local do temido Botão Kill-Switch de Acionamento de Manutenção, trocas de remetentes de e-mail institucionais etc.

---

## 👥 2. Como criar e escalar os Perfis de Acesso?

Por premissa de segurança bancária, o seu sistema nunca permite que o "Administrador" se feche e se crie via Tela de Cadastro por conta do grave risco de vulnerabilidade pública. 

### A) Criação de Professor (Cursista Padrão)
1. Basta o professor acessar [http://localhost:3000/cadastro](http://localhost:3000/cadastro).
2. O professor preencherá CPF, escolherá a Unidade, dará o Confere no box de proteção da LGPD.
3. No momento final, a aplicação salva na nuvem. A sua **Trigger SQL** (programada pela nossa inteligência lá no Bloco 1) imediatamente pesca o cadastro, acopla ele na tabela segura `public.users` e carimba as costas dele automaticamente informando: `role = 'cursista'`.
4. Pronto. No login, ele verá os vídeos.

### B) Criação do "Gestor Absoluto" (Admin SEMED)
Como criar a primeira conta da Chefia (Exemplo do Master `gabriellerelias@gmail.com`) ou promover outros funcionários a Admin:

1. Acesse ou oriente a chefia a ir na tela de **[Cadastro de aluno e criar uma conta normalmente lá](http://localhost:3000/cadastro)** com o e-mail dela.
2. A conta será criada nas sombras inicialmente como *'cursista'*.
3. Agora, você (Dona da Instância / Programadora Líder) deve entrar no painel do **Supabase**.
4. Entre no Menu Lateral Esquerdo: `SQL Editor` e cole este comando mágico para promover o usuário:

\`\`\`sql
-- Promove a usuária Gabrielle ao patamar de dona da prefeitura na plataforma
UPDATE users 
SET role = 'admin' 
WHERE email = 'gabriellerelias@gmail.com';
\`\`\`

5. Clique em `RUN`. Ao fazer isso, o controle do banco muda a _Role_.
6. Quando você (Gabrielle) logar com este e-mail no `localhost:3000/login`, a lógica de autenticação irá interceptá-la e ver o selo "ADMIN". Magicamente ela será teleguiada para `/admin` em vez do dashboard de aluno!

*(Dica: Se preferir revogar os acessos dela ou rebaixá-la de volta, basta repetir o código mas jogando `SET role = 'cursista'`)*.

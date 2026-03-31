"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  PlayCircle, FileText, CheckCircle2, Lock, ArrowLeft, 
  ArrowRight, Menu, X, Video, Paperclip, CheckSquare,
  Clock, AlertTriangle, ShieldCheck, XCircle, RefreshCcw
} from "lucide-react";

// ==========================================
// COMPONENTE SECUNDÁRIO: MOTOR DO QUIZ
// ==========================================
function QuizRunner({ onAprovar }: { onAprovar: () => void }) {
  const [iniciado, setIniciado] = useState(false);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [finalizado, setFinalizado] = useState(false);
  const [nota, setNota] = useState(0);

  const mockProva = {
    titulo: "Avaliação de Conhecimento - Módulo 1",
    tempo_limite: 15, // minutos
    nota_minima: 70,
    questoes: [
      {
        id: "q1",
        enunciado: "Qual é o principal objetivo da visão sistêmica na gestão escolar?",
        tipo: "multipla",
        alternativas: [
           { id: "a1", texto: "Focar em um único problema isolado de um aluno." },
           { id: "a2", texto: "Compreender a escola como um ecossistema com partes interligadas.", correta: true },
           { id: "a3", texto: "Terceirizar a gestão financeira do município." },
        ]
      },
      {
        id: "q2",
        enunciado: "O Diretor moderno não deve delegar tarefas burocráticas.",
        tipo: "vf",
        alternativas: [
           { id: "v1", texto: "Verdadeiro" },
           { id: "f1", texto: "Falso", correta: true },
        ]
      }
    ]
  };

  const calcularNota = () => {
    let acertos = 0;
    mockProva.questoes.forEach((q, index) => {
       const respSelecionada = respostas[index];
       const altCorreta = q.alternativas.find(a => a.correta)?.id;
       if (respSelecionada === altCorreta) acertos++;
    });
    const final = (acertos / mockProva.questoes.length) * 100;
    setNota(final);
    setFinalizado(true);
    if (final >= mockProva.nota_minima) {
       onAprovar(); // Destrava conclusao e certificado
    }
  };

  if (!iniciado) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 h-full w-full rounded-[2rem]">
         <CheckSquare className="w-16 h-16 text-primary mb-6" />
         <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{mockProva.titulo}</h2>
         <p className="text-slate-500 mb-6 max-w-md text-center">
           Esta é uma atividade obrigatória. Você precisa atingir {mockProva.nota_minima}% para avançar na trilha.
         </p>
         
         <div className="flex gap-4 mb-8">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300">
               <Clock className="w-4 h-4" /> {mockProva.tempo_limite} min
            </div>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300">
               <FileText className="w-4 h-4" /> {mockProva.questoes.length} Questões
            </div>
         </div>

         <button onClick={() => setIniciado(true)} className="px-8 py-4 bg-primary text-white rounded-xl font-black shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all text-lg flex items-center gap-2">
            Iniciar Avaliação
         </button>
      </div>
    );
  }

  if (finalizado) {
    const aprovado = nota >= mockProva.nota_minima;
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 h-full w-full rounded-[2rem] text-center">
         {aprovado ? (
           <ShieldCheck className="w-20 h-20 text-green-500 mb-6" />
         ) : (
           <XCircle className="w-20 h-20 text-red-500 mb-6" />
         )}
         
         <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            {aprovado ? "Aprovado!" : "Você não atingiu a média."}
         </h2>
         <p className="text-slate-500 mb-8 max-w-md">
            Sua nota final foi <span className="font-black text-slate-800 dark:text-slate-200">{nota}%</span> (Mínimo requerido: {mockProva.nota_minima}%).
         </p>

         {!aprovado && (
           <button onClick={() => { setIniciado(false); setFinalizado(false); setRespostas({}); setPerguntaAtual(0); }} className="px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" /> Tentar Novamente
           </button>
         )}
      </div>
    );
  }

  const q = mockProva.questoes[perguntaAtual];

  return (
    <div className="flex flex-col p-8 bg-white dark:bg-slate-900 h-full w-full rounded-[2rem] transition-all relative overflow-y-auto">
       <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100 dark:border-slate-800 absolute top-8 left-8 right-8 bg-white dark:bg-slate-900 z-10">
          <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Questão {perguntaAtual + 1} de {mockProva.questoes.length}</span>
          <span className="flex items-center gap-2 text-primary font-bold bg-primary/10 px-3 py-1 rounded-lg text-sm">
             <Clock className="w-4 h-4" /> 14:59s
          </span>
       </div>

       <div className="flex-1 mt-20 mb-24 max-w-3xl mx-auto w-full">
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-8 leading-snug">
             {q.enunciado}
          </h3>

          <div className="space-y-4">
             {q.alternativas.map((alt) => {
               const isSelected = respostas[perguntaAtual] === alt.id;
               return (
                 <label key={alt.id} className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-primary bg-primary' : 'border-slate-300 dark:border-slate-700'}`}>
                       {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{alt.texto}</span>
                 </label>
               )
             })}
          </div>
       </div>

       <div className="absolute bottom-8 left-8 right-8 bg-white dark:bg-slate-900 flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button 
             onClick={() => setPerguntaAtual(prev => Math.max(0, prev - 1))}
             disabled={perguntaAtual === 0}
             className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
             Voltar
          </button>
          
          {perguntaAtual < mockProva.questoes.length - 1 ? (
             <button 
                onClick={() => setPerguntaAtual(prev => prev + 1)}
                disabled={!respostas[perguntaAtual]}
                className="px-8 py-3 bg-secondary text-white rounded-xl font-bold flex items-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-secondary/90 transition-all shadow-md"
             >
                Avançar <ArrowRight className="w-4 h-4" />
             </button>
          ) : (
             <button 
                onClick={calcularNota}
                disabled={!respostas[perguntaAtual]}
                className="px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-primary/90 transition-all shadow-md"
             >
                Finalizar Prova <CheckCircle2 className="w-4 h-4" />
             </button>
          )}
       </div>
    </div>
  )
}


// ==========================================
// COMPONENTE PRINCIPAL: PLAYER PAGE
// ==========================================
export default function AulaPlayerPage({ params }: { params: { id: string, aulaId: string } }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [concluida, setConcluida] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // MOCK DATA
  const cursoMock = { id: params.id, titulo: "Liderança e Gestão Escolar" };
  const aulaAtual = {
    id: params.aulaId,
    titulo: "Atividade Final de Fixação",
    tipo: "atividade", // AGORA É UMA ATIVIDADE TESTE
    conteudo_url: "", 
    duracao_minutos: 15,
  };

  const proximaAula = { id: "aula-2", bloqueada: !concluida };
  const aulaAnterior = { id: "mock" }; 

  const arvoreModulos = [
    {
      id: "mod-1", titulo: "Módulo 1: Avaliações Vivas",
      aulas: [
        { id: params.aulaId, titulo: "Atividade Final de Fixação", concluida: concluida, tipo: "atividade" },
        { id: "aula-2", titulo: "Conclusão e Certificado", concluida: false, tipo: "texto" }
      ]
    }
  ];

  const getIconPorTipo = (tipo: string, w="w-4", h="h-4") => {
    switch(tipo) {
      case 'video': return <Video className={`${w} ${h}`}/>;
      case 'texto': return <FileText className={`${w} ${h}`}/>;
      case 'pdf': return <Paperclip className={`${w} ${h}`}/>;
      case 'atividade': return <CheckSquare className={`${w} ${h}`}/>;
      default: return <PlayCircle className={`${w} ${h}`}/>;
    }
  };

  const marcarComoConcluido = () => {
    if(aulaAtual.tipo === 'atividade') return; // Quizzes tem regra própria
    setLoading(true);
    setTimeout(() => {
      setConcluida(true);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950">
      
      {/* HEADER MOBILE */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 p-4 text-white z-20">
        <div className="flex items-center gap-3 w-[80%]">
          <Link href={`/dashboard/cursos/${cursoMock.id}`} className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-sm font-bold truncate">{cursoMock.titulo}</h1>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* SIDEBAR DE MODULOS */}
      <aside className={`
        ${mobileMenuOpen ? "flex" : "hidden"} 
        absolute md:relative top-16 md:top-0 left-0 w-full md:w-80 h-[calc(100vh-64px)] md:h-full 
        bg-slate-900 md:flex flex-col border-r border-slate-800 z-10 transition-transform
      `}>
        <div className="hidden md:flex flex-col p-6 border-b border-slate-800 text-white flex-shrink-0">
          <Link href={`/dashboard/cursos/${cursoMock.id}`} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium mb-4 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Curso
          </Link>
          <h2 className="font-bold text-lg leading-tight line-clamp-2">{cursoMock.titulo}</h2>
          
          <div className="mt-4 bg-slate-800 rounded-full h-1.5 w-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: concluida ? '50%' : '10%' }}></div>
          </div>
          <p className="text-slate-400 text-xs mt-2 text-right">{concluida ? '50%' : '10%'} concluído</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {arvoreModulos.map((mod, mIndex) => (
            <div key={mod.id} className="space-y-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-2 mb-2">
                {mod.titulo}
              </h3>
              <ul className="space-y-1">
                {mod.aulas.map((aula, aIndex) => {
                  const isCurrent = aula.id === aulaAtual.id;
                  const isTravada = (!concluida && aIndex > 0);
                  
                  return (
                    <li key={aula.id}>
                      <Link 
                        href={isTravada ? '#' : `/dashboard/cursos/${cursoMock.id}/aula/${aula.id}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors
                          ${isCurrent ? "bg-primary/20 text-primary-foreground border border-primary/30" : "text-slate-300"}
                          ${isTravada ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-800"}
                        `}
                      >
                        <div className="flex-shrink-0">
                           {aula.concluida ? (
                             <CheckCircle2 className="w-4 h-4 text-secondary" />
                           ) : isTravada ? (
                             <Lock className="w-4 h-4 text-slate-500" />
                           ) : (
                             getIconPorTipo(aula.tipo, "w-4", "h-4")
                           )}
                        </div>
                        <span className={`line-clamp-2 ${isCurrent ? "font-bold" : "font-medium"}`}>
                          {aula.titulo}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* ÁREA CENTRAL - PLAYER OU AVALIAÇÃO */}
      <main className="flex-1 h-[calc(100vh-64px)] md:h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 flex flex-col relative">
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 md:p-8">
          
          <div className="mb-6 flex justify-between items-start">
            <div>
               <div className="inline-flex items-center justify-center px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wide mb-3 gap-1.5">
                 {getIconPorTipo(aulaAtual.tipo)} {aulaAtual.tipo}
               </div>
               <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                 {aulaAtual.titulo}
               </h1>
            </div>
          </div>

          {/* RENDERIZADOR: AVALIAÇÃO VS VÍDEO/PDF */}
          {aulaAtual.tipo === 'atividade' ? (
             <div className="flex-1 h-full shadow-2xl relative w-full mb-8">
                <QuizRunner onAprovar={() => setConcluida(true)} />
             </div>
          ) : (
             <div className="w-full aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative z-0 flex items-center justify-center">
                 {/* Video Play */}
             </div>
          )}

          {/* Rodapé do Player / Navegação */}
          <div className="mt-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              {concluida ? (
                <div className="flex items-center gap-2 text-secondary font-bold bg-secondary/10 px-6 py-3.5 rounded-xl border border-secondary/20 w-full justify-center">
                  <CheckCircle2 className="w-5 h-5" /> Concluída - Liberado!
                </div>
              ) : (
                <button 
                  onClick={marcarComoConcluido}
                  disabled={loading || aulaAtual.tipo === 'atividade'}
                  className="w-full md:w-auto flex items-center justify-center gap-2 text-slate-700 dark:text-slate-200 font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-6 py-3.5 rounded-xl transition-all disabled:opacity-50"
                  title={aulaAtual.tipo === 'atividade' ? 'Responda a atividade no painel acima para concluir.' : ''}
                >
                  {loading ? "Registrando..." : "Aprovação Necessária"}
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link 
                href={proximaAula.bloqueada ? '#' : `/dashboard/cursos/${cursoMock.id}/aula/${proximaAula.id}`}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold rounded-xl transition-all shadow-md
                  ${proximaAula.bloqueada ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed border-transparent" : "bg-primary text-white hover:bg-primary/90"}`}
              >
                Gerar Certificado de Fim de Curso
                {proximaAula.bloqueada ? <Lock className="w-4 h-4 ml-1 opacity-50" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}

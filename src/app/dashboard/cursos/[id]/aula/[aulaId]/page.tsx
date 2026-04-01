"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { 
  PlayCircle, FileText, CheckCircle2, Lock, ArrowLeft, 
  ArrowRight, Menu, X, Video, Paperclip, CheckSquare,
  Clock, AlertTriangle, ShieldCheck, XCircle, RefreshCcw, Loader2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// ==========================================
// COMPONENTE: MOTOR DO QUIZ (DINÂMICO)
// ==========================================
function QuizRunner({ avaliacao, onAprovar }: { avaliacao: any, onAprovar: (nota: number) => void }) {
  const [iniciado, setIniciado] = useState(false);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [finalizado, setFinalizado] = useState(false);
  const [nota, setNota] = useState(0);

  if (!avaliacao || !avaliacao.questoes) return <div className="p-8 text-center text-slate-400">Avaliação não configurada.</div>;

  const calcularNota = () => {
    let acertos = 0;
    avaliacao.questoes.forEach((q: any) => {
       const respSelecionada = respostas[q.id];
       const altCorreta = q.alternativas.find((a: any) => a.correta)?.id;
       if (respSelecionada === altCorreta) acertos++;
    });
    const final = (acertos / avaliacao.questoes.length) * 100;
    setNota(final);
    setFinalizado(true);
    if (final >= (avaliacao.nota_minima || 70)) {
       onAprovar(final);
    }
  };

  if (!iniciado) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 h-full w-full rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl">
         <CheckSquare className="w-16 h-16 text-primary mb-6" />
         <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{avaliacao.titulo}</h2>
         <p className="text-slate-500 mb-6 max-w-md text-center font-medium">
           Esta é uma atividade obrigatória. Você precisa atingir {avaliacao.nota_minima || 70}% para avançar na trilha.
         </p>
         
         <div className="flex gap-4 mb-8">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300">
               <Clock className="w-4 h-4" /> {avaliacao.tempo_limite_min || 15} min
            </div>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300">
               <FileText className="w-4 h-4" /> {avaliacao.questoes.length} Questões
            </div>
         </div>

         <button onClick={() => setIniciado(true)} className="px-10 py-4 bg-primary text-white rounded-2xl font-black shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all text-lg flex items-center gap-2 hover:scale-105">
            Iniciar Avaliação
         </button>
      </div>
    );
  }

  if (finalizado) {
    const aprovado = nota >= (avaliacao.nota_minima || 70);
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 h-full w-full rounded-[2rem] text-center border-2 border-slate-100 dark:border-slate-800 shadow-2xl">
         {aprovado ? (
           <div className="bg-emerald-500/10 p-6 rounded-3xl mb-6">
             <ShieldCheck className="w-20 h-20 text-emerald-500" />
           </div>
         ) : (
           <div className="bg-red-500/10 p-6 rounded-3xl mb-6">
             <XCircle className="w-20 h-20 text-red-500" />
           </div>
         )}
         
         <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">
            {aprovado ? "Aprovado!" : "Tente Novamente"}
         </h2>
         <p className="text-slate-500 mb-8 max-w-md font-bold">
            Sua nota final foi <span className={aprovado ? "text-emerald-500 text-2xl" : "text-red-500 text-2xl"}>{Math.round(nota)}%</span>
         </p>

         {!aprovado && (
           <button onClick={() => { setIniciado(false); setFinalizado(false); setRespostas({}); setPerguntaAtual(0); }} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg">
              <RefreshCcw className="w-5 h-5" /> Tentar Outra Vez
           </button>
         )}
      </div>
    );
  }

  const q = avaliacao.questoes[perguntaAtual];

  return (
    <div className="flex flex-col p-8 bg-white dark:bg-slate-900 h-full w-full rounded-[2rem] transition-all relative overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
       <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100 dark:border-slate-800 absolute top-8 left-8 right-8 bg-white dark:bg-slate-900 z-10">
          <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Questão {perguntaAtual + 1} de {avaliacao.questoes.length}</span>
          <span className="flex items-center gap-2 text-primary font-black bg-primary/10 px-4 py-2 rounded-xl text-xs uppercase">
             <Clock className="w-4 h-4" /> {avaliacao.tempo_limite_min || 15}:00
          </span>
       </div>

       <div className="flex-1 mt-24 mb-24 max-w-3xl mx-auto w-full overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 mb-10 leading-tight">
             {q.enunciado}
          </h3>

          <div className="space-y-4">
             {q.alternativas.map((alt: any) => {
               const isSelected = respostas[q.id] === alt.id;
               return (
                 <label 
                   key={alt.id} 
                   onClick={() => setRespostas({...respostas, [q.id]: alt.id})}
                   className={`flex items-center gap-5 p-6 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5 shadow-md -translate-y-1' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}
                 >
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? 'border-primary bg-primary' : 'border-slate-300 dark:border-slate-700'}`}>
                       {isSelected && <div className="w-3 h-3 bg-white rounded-full"></div>}
                    </div>
                    <span className={`font-bold transition-colors ${isSelected ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`}>{alt.texto}</span>
                 </label>
               )
             })}
          </div>
       </div>

       <div className="absolute bottom-8 left-8 right-8 bg-white dark:bg-slate-900 flex justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
          <button 
             onClick={() => setPerguntaAtual(prev => Math.max(0, prev - 1))}
             disabled={perguntaAtual === 0}
             className="px-7 py-3.5 font-black text-slate-400 hover:text-slate-900 dark:hover:text-white uppercase tracking-widest text-[11px] disabled:opacity-30 transition-all"
          >
             Anterior
          </button>
          
          {perguntaAtual < avaliacao.questoes.length - 1 ? (
             <button 
                onClick={() => setPerguntaAtual(prev => prev + 1)}
                disabled={!respostas[q.id]}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg"
             >
                Próxima <ArrowRight className="w-5 h-5" />
             </button>
          ) : (
             <button 
                onClick={calcularNota}
                disabled={!respostas[q.id]}
                className="px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg"
             >
                Finalizar <CheckCircle2 className="w-5 h-5" />
             </button>
          )}
       </div>
    </div>
  )
}


// ==========================================
// COMPONENTE PRINCIPAL: PLAYER PAGE
// ==========================================
export default function AulaPlayerPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [curso, setCurso] = useState<any>(null);
  const [aula, setAula] = useState<any>(null);
  const [modulos, setModulos] = useState<any[]>([]);
  const [avaliacao, setAvaliacao] = useState<any>(null);
  
  const [concluida, setConcluida] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Busca Curso, Módulos e Aulas
      const { data: cursoData } = await supabase
        .from('cursos')
        .select(`
          id, titulo,
          modulos (
            id, titulo, ordem,
            aulas (id, titulo, tipo, duracao_minutos, ordem)
          )
        `)
        .eq('id', params.id)
        .single();
      
      if (cursoData) {
        setCurso(cursoData);
        // Ordenação
        const sortedModulos = cursoData.modulos.sort((a: any, b: any) => a.ordem - b.ordem);
        sortedModulos.forEach((m: any) => m.aulas.sort((a: any, b: any) => a.ordem - b.ordem));
        setModulos(sortedModulos);
      }

      // 2. Busca Aula Atual e eventual Avaliação
      const { data: aulaData } = await supabase
        .from('aulas')
        .select(`
          *,
          avaliacoes (*)
        `)
        .eq('id', params.aulaId)
        .single();
      
      if (aulaData) {
        setAula(aulaData);
        if (aulaData.tipo === 'atividade' && aulaData.avaliacoes?.[0]) {
           // Busca questões da avaliação
           const { data: questoes } = await supabase
             .from('questoes')
             .select('*, alternativas(*)')
             .eq('avaliacao_id', aulaData.avaliacoes[0].id)
             .order('ordem');
           
           setAvaliacao({ ...aulaData.avaliacoes[0], questoes });
        }
      }

      // 3. Busca status de conclusão real
      const { data: prog } = await supabase
        .from('progresso_aulas')
        .select('concluida')
        .eq('user_id', user.id)
        .eq('aula_id', params.aulaId)
        .single();
      
      if (prog) setConcluida(prog.concluida);

      setLoading(false);
    }

    loadData();
  }, [params.id, params.aulaId]);

  const handleMarcarConcluido = async (notaQuiz?: number) => {
    setSavingProgress(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('progresso_aulas')
      .upsert({
        user_id: user.id,
        aula_id: params.aulaId,
        concluida: true,
        concluida_em: new Date().toISOString(),
        percentual_assistido: 100
      }, { onConflict: 'user_id, aula_id' });

    if (!error) {
      setConcluida(true);
    }
    setSavingProgress(false);
  };

  const getIconPorTipo = (tipo: string, w="w-4", h="h-4") => {
    switch(tipo) {
      case 'video': return <Video className={`${w} ${h}`}/>;
      case 'texto': return <FileText className={`${w} ${h}`}/>;
      case 'pdf': return <Paperclip className={`${w} ${h}`}/>;
      case 'atividade': return <CheckSquare className={`${w} ${h}`}/>;
      default: return <PlayCircle className={`${w} ${h}`}/>;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-900 z-[100]">
         <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
         <span className="text-white font-black uppercase tracking-widest text-sm">Carregando sala de aula...</span>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 overflow-hidden">
      
      {/* SIDEBAR (Desktop e Mobile Overflow) */}
      <aside className={`
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} 
        absolute md:relative top-0 left-0 w-80 h-full bg-slate-900 flex flex-col border-r border-slate-800 z-50 transition-transform duration-300 shadow-2xl
      `}>
        <div className="p-6 border-b border-slate-800 flex flex-col">
          <button 
            onClick={() => router.push(`/dashboard/cursos/${params.id}`)}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-[11px] font-black uppercase tracking-widest mb-6 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Painel do Curso
          </button>
          <h2 className="font-black text-white text-xl leading-tight line-clamp-2">{curso?.titulo}</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar-dark">
          {modulos.map((mod) => (
            <div key={mod.id} className="space-y-2">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-3 mb-3">
                {mod.titulo}
              </h3>
              <ul className="space-y-1">
                {mod.aulas.map((a: any) => {
                  const isCurrent = a.id === params.aulaId;
                  return (
                    <li key={a.id}>
                      <Link 
                        href={`/dashboard/cursos/${params.id}/aula/${a.id}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] transition-all
                          ${isCurrent ? "bg-primary text-white shadow-xl shadow-primary/20 font-bold" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 font-medium"}
                        `}
                      >
                        <div className="flex-shrink-0">
                           {a.concluida ? (
                             <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                           ) : (
                             getIconPorTipo(a.tipo, "w-4", "h-4")
                           )}
                        </div>
                        <span className="line-clamp-2">{a.titulo}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* ÁREA CENTRAL */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        {/* HEADER MOBILE & NAVEGAÇÃO SUPERIOR */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 md:p-6 z-20 shadow-sm">
           <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl">
             <Menu className="w-6 h-6" />
           </button>
           <div className="hidden md:flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aula Atual</span>
              <h1 className="text-xl font-black text-slate-900 dark:text-white truncate max-w-xl">{aula?.titulo}</h1>
           </div>
           <div className="flex gap-2">
              <button className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors shadow-sm"><ArrowLeft className="w-5 h-5"/></button>
              <button className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"><ArrowRight className="w-5 h-5"/></button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
           <div className="max-w-5xl mx-auto w-full h-full flex flex-col">
              
              {/* RENDERIZADOR DINÂMICO */}
              {aula?.tipo === 'atividade' ? (
                 <div className="flex-1 min-h-[500px]">
                    <QuizRunner 
                      avaliacao={avaliacao} 
                      onAprovar={() => handleMarcarConcluido()} 
                    />
                 </div>
              ) : (
                 <div className="space-y-8 flex-1">
                     <div className="w-full aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 relative group">
                        {(() => {
                           const videoUrl = aula?.conteudo_url || "https://youtu.be/IXdNnw99-Ic?list=RDIXdNnw99-Ic";
                           // Converte links normais e curtos (youtu.be) para embed
                           let embedUrl = videoUrl
                             .replace("watch?v=", "embed/")
                             .replace("youtu.be/", "www.youtube.com/embed/")
                             .split("&")[0]; // Remove parâmetros extras que podem quebrar o embed simples
                           
                           return (
                             <iframe 
                               src={embedUrl} 
                               className="w-full h-full"
                               allowFullScreen
                               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                             ></iframe>
                           );
                        })()}
                     </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <div className="md:col-span-2 space-y-6">
                          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Conteúdo de Apoio</h2>
                          <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                             {aula?.conteudo_texto || "Sem material adicional cadastrado para esta lição."}
                          </div>
                       </div>
                       
                       <div className="space-y-6">
                          <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">Painel de Ação</h3>
                          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                             {concluida ? (
                                <div className="text-center space-y-4">
                                   <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
                                      <ShieldCheck className="w-9 h-9" />
                                   </div>
                                   <p className="font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest text-[11px]">Aula Completada</p>
                                   <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/20">Avançar</button>
                                </div>
                             ) : (
                                <button 
                                   onClick={() => handleMarcarConcluido()}
                                   disabled={savingProgress}
                                   className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                   {savingProgress ? <Loader2 className="w-5 h-5 animate-spin" /> : "Marcar como Concluída"}
                                </button>
                             )}
                          </div>
                       </div>
                    </div>
                 </div>
              )}

           </div>
        </div>
      </main>

    </div>
  );
}

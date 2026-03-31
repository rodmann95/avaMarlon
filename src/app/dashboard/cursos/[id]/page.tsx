import Link from "next/link";
import { notFound } from "next/navigation";
import { PlayCircle, Clock, BookOpen, Lock, CheckCircle2, Video, FileText, Paperclip, CheckSquare, ChevronDown } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

export default async function DetalheCursoPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = await params;

  // Busca o curso e preenche seus módulos e aulas
  const { data: curso, error } = await supabase
    .from("cursos")
    .select(`
      *,
      trilhas (titulo),
      modulos (
        id, titulo, descricao, ordem,
        aulas (
          id, titulo, tipo, duracao_minutos, ordem
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error || !curso) {
    return notFound();
  }

  // Ordena os módulos
  const modulosOrdenados = curso.modulos?.sort((a: any, b: any) => a.ordem - b.ordem) || [];
  
  // Ordena aulas dentro dos módulos
  modulosOrdenados.forEach((mod: any) => {
    mod.aulas = mod.aulas?.sort((a: any, b: any) => a.ordem - b.ordem) || [];
  });

  // TODO: Buscar de fato o progresso local quando Auth estiver ativo.
  // Mockamos um cenário onde a primeira aula está completada, a segunda liberada e a terceira com cadeado.
  const progresso = 15; // 15% 
  
  // Helpers visuais
  const getIconPorTipo = (tipo: string, w="w-5", h="h-5") => {
    switch(tipo) {
      case 'video': return <Video className={`${w} ${h}`}/>;
      case 'texto': return <FileText className={`${w} ${h}`}/>;
      case 'pdf': return <Paperclip className={`${w} ${h}`}/>;
      case 'atividade': return <CheckSquare className={`${w} ${h}`}/>;
      default: return <BookOpen className={`${w} ${h}`}/>;
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in relative max-w-5xl mx-auto">
      
      {/* Resumo do Curso (Hero) */}
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 border border-slate-800 shadow-2xl">
        {/* Imagem de Fundo Borrada */}
        <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
          {curso.thumbnail_url ? (
             <img src={curso.thumbnail_url} alt="" className="w-full h-full object-cover blur-sm" />
          ) : (
             <div className="w-full h-full bg-gradient-to-r from-primary to-secondary"></div>
          )}
        </div>

        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start md:items-end w-full">
           <div className="flex-1 text-white">
             {curso.trilhas && (
               <span className="inline-block px-3 py-1 bg-white/10 text-white backdrop-blur-md font-semibold text-xs tracking-wider rounded-full uppercase mb-4 shadow-sm border border-white/10">
                 Trilha: {curso.trilhas.titulo}
               </span>
             )}
             <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">{curso.titulo}</h1>
             <p className="text-slate-300 md:text-lg mb-6 max-w-2xl">{curso.descricao}</p>
             
             <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-secondary" /> {curso.carga_horaria_horas} horas
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> {curso.modulos?.length || 0} módulos
                </div>
             </div>
           </div>

           {/* Card Dinâmico de Continuar / Progresso Hover */}
           <div className="w-full md:w-80 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Seu Progresso</h3>
              
              <div className="flex items-end justify-between mb-2">
                <p className="text-3xl font-black text-primary">{progresso}%</p>
                <p className="text-xs text-slate-500 font-medium mb-1">Módulo 1 de {modulosOrdenados.length}</p>
              </div>
              
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mb-6 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full" style={{ width: `${progresso}%` }}></div>
              </div>

              <Link 
                href={`/dashboard/cursos/${curso.id}/aula/mock`} // Link temporário
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-bold shadow-md hover:shadow-xl transition-all"
              >
                <PlayCircle className="w-5 h-5" /> Continuar Curso
              </Link>
           </div>
        </div>
      </div>

      {/* Grid de Módulos (Acordeão) */}
      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          Conteúdo do Curso
        </h2>
        
        {modulosOrdenados.length === 0 ? (
          <p className="text-slate-500">Este curso ainda não possui módulos registrados.</p>
        ) : (
          <div className="space-y-4">
            {modulosOrdenados.map((modulo: any, index: number) => (
              <details 
                key={modulo.id} 
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden"
                open={index === 0} // Abre o primeiro módulo por padrão
              >
                {/* Cabeçalho do Acordeão */}
                <summary className="flex items-center justify-between p-5 md:p-6 cursor-pointer list-none hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-open:text-primary transition-colors">
                        {modulo.titulo}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
                        {modulo.aulas.length} aulas • {modulo.descricao}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className="w-6 h-6 text-slate-400 group-open:rotate-180 transition-transform duration-300" />
                </summary>

                {/* Corpo (Lista de Aulas) */}
                <div className="bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800">
                  <ul className="divide-y divide-slate-100 dark:divide-slate-800/50 p-2 md:p-4">
                    {modulo.aulas.map((aula: any, aulaIndex: number) => {
                       
                       // SIMULADOR DE TRAVA APENAS PARA VISUALIZAÇÃO NO FRONT
                       const aulaConcluida = index === 0 && aulaIndex === 0;
                       const aulaLiberada = (index === 0 && aulaIndex === 1) || aulaConcluida;
                       const aulaTravada = !aulaLiberada;

                       return (
                         <li key={aula.id}>
                           <Link 
                             href={aulaTravada ? '#' : `/dashboard/cursos/${curso.id}/aula/${aula.id}`}
                             className={`flex items-center p-3 md:p-4 rounded-xl transition-all ${
                                aulaTravada 
                                  ? "opacity-60 cursor-not-allowed" 
                                  : "hover:bg-white dark:hover:bg-slate-900 hover:shadow-sm"
                             }`}
                           >
                             <div className="w-10 flex-shrink-0 flex justify-center">
                                {aulaConcluida ? (
                                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                                ) : aulaTravada ? (
                                  <Lock className="w-4 h-4 text-slate-400" />
                                ) : (
                                  <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-full"></div>
                                )}
                             </div>
                             
                             <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 ml-2">
                               <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium">
                                 <div className="p-1.5 bg-slate-200 dark:bg-slate-800 rounded-md text-slate-500 dark:text-slate-400">
                                   {getIconPorTipo(aula.tipo)}
                                 </div>
                                 <span className={aulaConcluida ? "line-through text-slate-400" : ""}>
                                   {aula.titulo}
                                 </span>
                               </div>
                               
                               <div className="ml-9 sm:ml-auto text-xs text-slate-400 flex items-center gap-1.5">
                                 {aula.duracao_minutos > 0 && <span>{aula.duracao_minutos} min</span>}
                                 <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-semibold uppercase text-[10px]">
                                    {aula.tipo}
                                 </span>
                               </div>
                             </div>
                           </Link>
                         </li>
                       );
                    })}
                    
                    {modulo.aulas.length === 0 && (
                      <li className="p-4 text-sm text-slate-500 italic">Módulo sem aulas associadas.</li>
                    )}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

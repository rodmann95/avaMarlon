import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { CheckCircle2, Lock, ArrowLeft, Clock, Map as MapIcon, PlayCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function TrilhaDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: trilha, error } = await supabase
    .from("trilhas")
    .select(`
      *,
      cursos (*)
    `)
    .eq("id", id)
    .single();

  if (error || !trilha) {
    return notFound();
  }

  // Ordenar cursos por ordem
  const cursosOrdenados = trilha.cursos?.sort((a: any, b: any) => a.ordem - b.ordem) || [];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      
      <Link href="/dashboard/trilhas" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar para o mapa
      </Link>

      <header className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
          <MapIcon className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
          {trilha.titulo}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
          {trilha.descricao}
        </p>
      </header>

      {/* Stepper / Timeline de Cursos */}
      <div className="bg-slate-50 dark:bg-slate-950 p-4 md:p-12 rounded-3xl relative">
        <div className="absolute left-[39px] md:left-[83px] top-12 bottom-12 w-1 bg-slate-200 dark:bg-slate-800 rounded-full"></div>

        <div className="space-y-8 relative z-10">
          {cursosOrdenados.map((curso: any, index: number) => {
            
            // Lógica fictícia para mostrar o stepper visualmente
            const isCompleted = index === 0; // Primeiro curso concluído no mock
            const isCurrent = index === 1; // Segundo curso em andamento
            const isLocked = index > 1; // Resto bloqueado
            
            return (
              <div key={curso.id} className={`flex gap-6 md:gap-8 group ${isLocked ? 'opacity-60' : ''}`}>
                
                {/* Node Timeline */}
                <div className="relative flex flex-col items-center">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center z-10 border-4 ${
                    isCompleted 
                      ? "bg-secondary text-white border-white dark:border-slate-950" 
                      : isCurrent 
                        ? "bg-primary text-white border-white dark:border-slate-950 shadow-lg shadow-primary/30" 
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-white dark:border-slate-950"
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : isLocked ? <Lock className="w-6 h-6" /> : <span className="font-bold text-lg md:text-xl">{index + 1}</span>}
                  </div>
                </div>

                {/* Card do Curso na Timeline */}
                <div className="flex-1">
                  <Link 
                    href={isLocked ? '#' : `/dashboard/cursos/${curso.id}`}
                    className={`block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 transition-all duration-300 ${
                       isLocked ? "cursor-not-allowed" : "hover:shadow-xl hover:-translate-y-1"
                    } ${isCurrent ? "shadow-md border-primary/20" : "shadow-sm"}`}
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-48 h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0">
                         {curso.thumbnail_url ? (
                           <img src={curso.thumbnail_url} className="w-full h-full object-cover" alt="" />
                         ) : (
                           <div className="w-full h-full bg-gradient-to-tr from-primary/10 to-secondary/10 flex items-center justify-center text-primary/40 text-4xl font-black">
                             {curso.titulo.charAt(0)}
                           </div>
                         )}
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                           <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                             isCompleted ? "bg-secondary/10 text-secondary" : isCurrent ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                           }`}>
                             {isCompleted ? "Concluído" : isCurrent ? "Próximo Passo" : "Aguardando"}
                           </span>
                        </div>
                        <h3 className={`text-xl font-bold mb-2 ${isLocked ? 'text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                          {curso.titulo}
                        </h3>
                        <div className="flex items-center gap-4 text-sm font-semibold text-slate-500">
                          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {curso.carga_horaria_horas} horas</span>
                        </div>

                        {!isLocked && (
                           <div className="mt-4 flex items-center gap-2 text-primary font-bold text-sm">
                             {isCompleted ? "Revisar Curso" : "Continuar Aprendizado"} <PlayCircle className="w-4 h-4" />
                           </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>

              </div>
            );
          })}
          
          {cursosOrdenados.length === 0 && (
            <p className="pl-24 text-slate-500">Nenhum curso associado a esta trilha no momento.</p>
          )}

        </div>
      </div>
    </div>
  );
}

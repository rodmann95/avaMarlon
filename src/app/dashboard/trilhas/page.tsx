import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Map, Clock, BookOpen, Search, Filter } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function TrilhasIndexPage() {
  const supabase = await createClient();

  const { data: trilhas, error } = await supabase
    .from("trilhas")
    .select(`
      *,
      cursos (id, carga_horaria_horas)
    `)
    .eq("ativo", true);

  return (
    <div className="space-y-8 animate-fade-in relative max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Map className="w-8 h-8 text-primary" /> Trilhas Formativas
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
            Caminhos estruturados de ponta a ponta. Avance com método pelas seleções de cursos essenciais que a equipe da SEMED planejou.
          </p>
        </div>
      </header>

      {error ? (
        <div className="p-6 bg-red-50 text-red-600 rounded-2xl">Erro ao carregar: {error.message}</div>
      ) : trilhas && trilhas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trilhas.map((trilha: any) => {
             const qtdeCursos = trilha.cursos ? trilha.cursos.length : 0;
             const totalHoras = trilha.cursos ? trilha.cursos.reduce((acc: number, cur: any) => acc + (cur.carga_horaria_horas || 0), 0) : 0;

             return (
               <Link 
                 key={trilha.id}
                 href={`/dashboard/trilhas/${trilha.id}`}
                 className="group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 p-6 flex flex-col h-full relative overflow-hidden"
               >
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Map className="w-48 h-48 rotate-12 -mr-10 -mt-10" />
                 </div>
                 
                 <div className="flex-1 relative z-10">
                   <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                     <Map className="w-7 h-7" />
                   </div>
                   
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                     {trilha.titulo}
                   </h3>
                   <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-3">
                     {trilha.descricao}
                   </p>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 relative z-10">
                   <div className="flex flex-col gap-1">
                     <span className="text-xs text-slate-400 font-semibold uppercase">Carga Horária</span>
                     <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
                       <Clock className="w-4 h-4 text-secondary" /> {totalHoras}h
                     </div>
                   </div>
                   <div className="flex flex-col gap-1">
                     <span className="text-xs text-slate-400 font-semibold uppercase">Composição</span>
                     <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
                       <BookOpen className="w-4 h-4 text-primary" /> {qtdeCursos} Cursos
                     </div>
                   </div>
                 </div>

                 {/* Barra de progresso mockada simulando visual */}
                 <div className="mt-6 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                   <div className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full w-[0%]"></div>
                 </div>
               </Link>
             )
          })}
        </div>
      ) : (
        <div className="w-full h-64 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
           Não há trilhas criadas no banco de dados.
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { Search, Filter, BookOpen, Clock, PlayCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

export default async function CursosIndexPage() {
  const supabase = await createClient();

  // Busca os cursos ativos no banco e suas trilhas
  const { data: cursos, error } = await supabase
    .from("cursos")
    .select(`
      *,
      trilhas (titulo)
    `)
    .eq("ativo", true)
    .order("created_at", { ascending: false });

  // Mock de contagem de módulos/status caso a tabela não tenha preenchido
  const mockProgress = "Não iniciado"; // Para V2 a gente busca na tabela progresso_cursos

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header do Catálogo */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            Catálogo de Cursos
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
            Explore dezenas de formações focadas na excelência do ensino municipal. Encontre a capacitação ideal para o seu momento de carreira.
          </p>
        </div>
        
        {/* Barra de Busca e Filtros */}
        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar curso..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center w-10 h-10 md:w-auto md:px-4 md:py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium transition-colors shadow-sm gap-2">
            <Filter className="w-4 h-4" />
            <span className="hidden md:inline">Filtros</span>
          </button>
        </div>
      </header>

      {/* Grid de Cursos */}
      {error ? (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl border border-red-100 dark:border-red-800">
          Erro ao carregar os cursos do Supabase: {error.message}
        </div>
      ) : cursos && cursos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cursos.map((curso: any) => (
            <Link 
              key={curso.id} 
              href={`/dashboard/cursos/${curso.id}`}
              className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {/* Imagem real ou placeholder gradiente */}
                {curso.thumbnail_url ? (
                  <img src={curso.thumbnail_url} alt={curso.titulo} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center p-6 text-center transform group-hover:scale-105 transition-transform duration-500">
                    <span className="text-white/30 text-5xl font-black">{curso.titulo.charAt(0)}</span>
                  </div>
                )}
                
                {/* Badges Opcionais sobre a imagem */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-white bg-black/50 backdrop-blur-md rounded-full uppercase">
                    {curso.trilhas ? curso.trilhas.titulo : 'Eletiva'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col flex-1 p-5">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors">
                  {curso.titulo}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 flex-1">
                  {curso.descricao || "Nenhuma descrição informada para este curso."}
                </p>

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-primary/80">
                    <Clock className="w-4 h-4" />
                    {curso.carga_horaria_horas}h
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                  <div className="flex items-center gap-1.5 hover:text-secondary transition-colors">
                    <PlayCircle className="w-4 h-4" /> {/* Poderia ser contagem de módulos */}
                    Acessar Curso
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="w-full h-64 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <BookOpen className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Nenhum curso disponível</h3>
          <p>Não há cursos publicados no momento. Em breve a SEMED disponibilizará novas aulas!</p>
        </div>
      )}
    </div>
  );
}

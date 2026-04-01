"use client";

import { Search, Plus, PlayCircle, LibraryBig, MoreVertical, Edit2, Archive, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";

export default function GestaoCursosAdminPage() {
  const supabase = createClient();
  const [trilhas, setTrilhas] = useState<any[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // Busca Trilhas com contagem de cursos
      const { data: trilhasData } = await supabase
        .from('trilhas')
        .select(`
          id, titulo, ativo,
          cursos:cursos(count)
        `)
        .order('titulo');
      
      if (trilhasData) {
        setTrilhas(trilhasData.map(t => ({
          id: t.id,
          nome: t.titulo,
          cursos: t.cursos?.[0]?.count || 0,
          alunos: 0, // Mockado até termos tabela de matrículas real
          status: t.ativo ? 'Publicada' : 'Arquivada'
        })));
      }

      // Busca Cursos com contagem de módulos
      const { data: cursosData } = await supabase
        .from('cursos')
        .select(`
          id, titulo, carga_horaria_horas, ativo,
          modulos:modulos(count)
        `)
        .order('titulo');

      if (cursosData) {
        setCursos(cursosData.map(c => ({
          id: c.id,
          nome: c.titulo,
          modulos: c.modulos?.[0]?.count || 0,
          autor: 'SEMED Colombo',
          carga: `${c.carga_horaria_horas}h`,
          status: c.ativo ? 'Ativo' : 'Arquivado',
          ativo: c.ativo
        })));
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  const filteredCursos = useMemo(() => {
    return cursos.filter(c => 
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.id.includes(searchTerm)
    );
  }, [cursos, searchTerm]);

  const handleArquivarCurso = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('cursos')
      .update({ ativo: !currentStatus })
      .eq('id', id);

    if (!error) {
      setCursos(prev => prev.map(c => 
        c.id === id ? { ...c, ativo: !currentStatus, status: !currentStatus ? 'Ativo' : 'Arquivado' } : c
      ));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Repositório de Trilhas & Cursos</h1>
           <p className="text-slate-500 text-sm mt-1">Gestão pedagógica da matriz curricular oficial da SEMED Colombo.</p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
           <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold transition-all shadow-sm">
             <LibraryBig className="w-4 h-4" /> Nova Trilha
           </button>
           <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold transition-all shadow-md">
             <Plus className="w-4 h-4" /> Novo Curso
           </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 text-slate-400">
           <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
           <p className="font-bold">Acessando acervo pedagógico...</p>
        </div>
      ) : (
        <>
          {/* DASHBOARD DE TRILHAS FORMATIVAS */}
          <div>
             <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <LibraryBig className="w-5 h-5 text-secondary" /> Trilhas Formativas Ativas
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trilhas.map((trilha) => (
                   <div key={trilha.id} className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border 
                               ${trilha.status === 'Publicada' 
                                  ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                                  : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}>
                               {trilha.status}
                            </span>
                         </div>
                         <button className="text-slate-400 hover:text-primary"><Edit2 className="w-4 h-4" /></button>
                      </div>
                      
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">{trilha.nome}</h3>
                      
                      <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                         <span className="flex items-center gap-1.5"><PlayCircle className="w-4 h-4" /> {trilha.cursos} Cursos</span>
                         <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                         <span>{trilha.alunos} Alunos</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* PAINEL DE BUSCA DE CURSOS */}
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[1.5rem] overflow-hidden shadow-sm mt-8">
             <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 uppercase tracking-wide">
                   Catálogo de Cursos
                </h2>
                <div className="relative w-full sm:w-72">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input 
                      type="text" 
                      placeholder="Pesquisar por nome ou ID..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
                   />
                </div>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                   <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                      <tr>
                         <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Cod</th>
                         <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Nome do Curso</th>
                         <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Estrutura</th>
                         <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Carga</th>
                         <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] text-right">Ações</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {filteredCursos.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">Nenhum curso encontrado no catálogo.</td>
                        </tr>
                      ) : (
                        filteredCursos.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors group">
                             <td className="px-6 py-4 font-mono text-slate-400 text-[10px]">#{c.id.slice(0, 8)}</td>
                             <td className="px-6 py-4">
                                <span className="font-bold text-slate-900 dark:text-white mr-2">{c.nome}</span>
                                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                                   c.ativo ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                                }`}>
                                   {c.status}
                                </span>
                             </td>
                             <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                                {c.modulos} Módulos
                             </td>
                             <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-mono text-xs border border-slate-200 dark:border-slate-700">
                                   {c.carga}
                                </span>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 text-sm font-semibold">
                                   <button className="px-3 py-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-1.5 focus:outline-none">
                                      <Edit2 className="w-3.5 h-3.5" /> Editar
                                   </button>
                                   <button 
                                      onClick={() => handleArquivarCurso(c.id, c.ativo)}
                                      className={`p-1.5 rounded-lg transition-colors focus:outline-none ${c.ativo ? 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10' : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/10'}`} 
                                      title={c.ativo ? "Arquivar Curso" : "Ativar Curso"}
                                   >
                                      {c.ativo ? <Archive className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                   </button>
                                   <button className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none">
                                      <MoreVertical className="w-4 h-4" />
                                   </button>
                                </div>
                             </td>
                          </tr>
                        ))
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        </>
      )}

    </div>
  );
}

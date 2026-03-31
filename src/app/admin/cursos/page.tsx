"use client";

import { Search, Plus, PlayCircle, LibraryBig, MoreVertical, Edit2, Archive } from "lucide-react";

export default function GestaoCursosAdminPage() {
  const trilhas = [
    { id: 1, nome: "Trilha Inclusão Digital", cursos: 4, alunos: 1250, status: "Publicada" },
    { id: 2, nome: "Gestão Escolar Avançada", cursos: 2, alunos: 400, status: "Rascunho" },
  ];

  const cursos = [
    { id: '101', nome: 'Introdução ao AVA', modulos: 3, autor: 'SEMED Colombo', carga: '20h', status: 'Ativo' },
    { id: '102', nome: 'Educação Inclusiva', modulos: 5, autor: 'Prof. Marina', carga: '40h', status: 'Ativo' },
    { id: '103', nome: 'Liderança Pedagógica', modulos: 2, autor: 'SEMED Colombo', carga: '10h', status: 'Arquivado' },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-black text-slate-900 dark:text-white">Repositório de Cursos & Trilhas</h1>
           <p className="text-slate-500 text-sm mt-1">Gerencie a matriz curricular, adicione aulas e atrele exames (Quiz).</p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
           <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold transition-all shadow-sm">
             <LibraryBig className="w-4 h-4" /> Nova Trilha
           </button>
           <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold transition-all shadow-md">
             <Plus className="w-4 h-4" /> Cadastrar Curso
           </button>
        </div>
      </div>

      {/* DASHBOARD DE TRILHAS FORMATIVAS */}
      <div>
         <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <LibraryBig className="w-5 h-5 text-secondary" /> Trilhas Formativas Oficiais
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
                  
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{trilha.nome}</h3>
                  
                  <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                     <span className="flex items-center gap-1.5"><PlayCircle className="w-4 h-4" /> {trilha.cursos} Cursos</span>
                     <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                     <span>{trilha.alunos} Matriculados</span>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* PAINEL DE BUSCA DE CURSOS */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[1.5rem] overflow-hidden shadow-sm mt-8">
         <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
               Catálogo de Cursos Base
            </h2>
            <div className="relative w-full sm:w-72">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                  type="text" 
                  placeholder="Buscar curso por nome ou ID..." 
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
                     <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Estruturação</th>
                     <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Carga</th>
                     <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] text-right">Ações</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {cursos.map((c) => (
                     <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors group">
                        <td className="px-6 py-4 font-mono text-slate-400 text-xs">#{c.id}</td>
                        <td className="px-6 py-4">
                           <span className="font-bold text-slate-900 dark:text-white mr-2">{c.nome}</span>
                           <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              c.status === 'Ativo' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                           }`}>
                              {c.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                           {c.modulos} Módulos Acoplados
                        </td>
                        <td className="px-6 py-4">
                           <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-mono text-xs border border-slate-200 dark:border-slate-700">
                              {c.carga}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2 text-sm font-semibold">
                              <button className="px-3 py-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-1.5 focus:outline-none">
                                 <Edit2 className="w-3.5 h-3.5" /> Editar Grade
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus:outline-none" title="Arquivar Modulo">
                                 <Archive className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none">
                                 <MoreVertical className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

    </div>
  );
}

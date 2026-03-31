"use client";

import { FileEdit, CheckCircle2, Clock, Search, Filter, MessageSquare, AlertCircle } from "lucide-react";

export default function AvaliacoesAdminPage() {
  const avaliacoesPendentes = [
    { id: 'AV-1092', exame: 'Questionário de Inclusão', aluno: 'Eduardo Pereira', lote: 'CMEI Cantinho', enviada: 'Hoje, 09:41', tipo: 'Dissertativa', status: 'Aguardando Correção' },
    { id: 'AV-1093', exame: 'Redação: Gestão de Crise', aluno: 'Marina Santos', lote: 'EM Gabriel de Lara', enviada: 'Ontem', tipo: 'Híbrida', status: 'Aguardando Correção' },
  ];

  const avaliacoesConcluidas = [
    { id: 'AV-0988', exame: 'Prova Nivelamento Digital', aluno: 'João Marcos', lote: 'Sede SEMED', enviada: 'Segunda-feira', tipo: 'Múltipla Escolha', nota: 95 },
    { id: 'AV-0941', exame: 'Questionário de Inclusão', aluno: 'Gabrielle Silva', lote: 'EM Zumbi Palmares', enviada: 'Semana Passada', tipo: 'Múltipla Escolha', nota: 100 },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
               <FileEdit className="w-4 h-4" />
             </span>
             <h1 className="text-2xl font-black text-slate-900 dark:text-white">Central de Avaliações</h1>
           </div>
           <p className="text-slate-500 text-sm max-w-xl">
              Monitore os resultados do Quiz Automático e realize as correções manuais das provas de textos abertos enviadas pelos alunos.
           </p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Buscar exame ou aluno..." className="pl-9 pr-4 py-2 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-secondary/50 placeholder:text-slate-400 dark:text-white transition-all w-64" />
           </div>
           <button className="px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
             <Filter className="w-4 h-4" /> Exportar Planilha
           </button>
        </div>
      </div>

      {/* BLOCO: FILA DE CORREÇÃO (DISSERTATIVAS) */}
      <section>
         <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 animate-pulse" /> Atividades Aguardando Revisão
            <span className="bg-red-100 text-red-600 dark:bg-red-900/40 px-2 py-0.5 rounded-full text-xs ml-2">2 na fila</span>
         </h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {avaliacoesPendentes.map(prova => (
               <div key={prova.id} className="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 p-5 rounded-[1.5rem] flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-3">
                     <span className="px-2 py-1 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500 rounded-md shadow-sm">
                        {prova.tipo}
                     </span>
                     <span className="text-xs font-medium text-slate-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {prova.enviada}</span>
                  </div>
                  
                  <h3 className="font-black text-slate-900 dark:text-white text-lg mb-1">{prova.exame}</h3>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                     {prova.aluno} <span className="text-slate-300 dark:text-slate-700">•</span> <span className="font-normal text-xs">{prova.lote}</span>
                  </p>

                  <div className="mt-5 pt-4 border-t border-red-200 dark:border-red-900/30 flex justify-end">
                     <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-md transition-colors flex items-center gap-2">
                        <MessageSquare className="w-4 h-4"/> Avaliar Resposta
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* BLOCO: HISTÓRICO CORRIGIDAS */}
      <section className="pt-6">
         <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Corrigidas (Automático e Manual)
         </h2>

         <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[1.5rem] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                     <tr>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Prova ID</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Nome da Avaliação</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Cursista</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Metodologia</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] text-right">Nota Final</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                     {avaliacoesConcluidas.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors cursor-pointer group">
                           <td className="px-6 py-4 font-mono text-slate-400 text-xs">{req.id}</td>
                           <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{req.exame}</td>
                           <td className="px-6 py-4">
                              <div className="font-semibold text-slate-800 dark:text-slate-200">{req.aluno}</div>
                              <div className="text-xs text-slate-500">{req.lote}</div>
                           </td>
                           <td className="px-6 py-4">
                              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                                 {req.tipo}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <span className={`inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-lg font-black text-sm
                                 ${req.nota >= 70 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-red-100 text-red-700 dark:bg-red-900/30'}
                              `}>
                                 {req.nota} %
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </section>

    </div>
  );
}

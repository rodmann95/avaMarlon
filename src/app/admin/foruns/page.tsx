"use client";

import { MessageSquare, ShieldAlert, TrendingUp, Users, Search, Trash2, CheckCircle, EyeOff } from "lucide-react";

export default function ForunsAdminPage() {
  const metricas = [
    { label: "Tópicos Ativos", valor: "142", trend: "+12%", icon: <MessageSquare className="w-5 h-5 text-blue-500" /> },
    { label: "Alertas de Moderação", valor: "4", trend: "-2", icon: <ShieldAlert className="w-5 h-5 text-red-500" /> },
    { label: "Engajamento Diário", valor: "8.5k", trend: "+24%", icon: <TrendingUp className="w-5 h-5 text-emerald-500" /> },
    { label: "Educadores Silenciados", valor: "2", trend: "0", icon: <EyeOff className="w-5 h-5 text-slate-500" /> },
  ];

  const reportes = [
     { id: 'T-8821', assunto: 'Dúvida sobre Material em PDF (Erro 404)', curso: 'Gestão Escolar', autor: 'João Mendes', data: 'Há 10 min', status: 'Denúncia: Spam', gravidade: 'Baixa' },
     { id: 'T-8822', assunto: 'Como aplico a lei Maria da Penha na sala?', curso: 'Educação Inclusiva', autor: 'Carla Dias', data: 'Ontem', status: 'Debate Quente', gravidade: 'Normal' },
     { id: 'T-8810', assunto: 'A prefeitura não vai pagar esse piso!', curso: 'Geral', autor: 'Marcos A.', data: 'Terça-feira', status: 'Discurso de Ódio', gravidade: 'Alta' }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
               <MessageSquare className="w-4 h-4" />
             </span>
             <h1 className="text-2xl font-black text-slate-900 dark:text-white">Central de Moderação</h1>
           </div>
           <p className="text-slate-500 text-sm max-w-2xl">
              Monitore a rede de Fóruns Pedagógicos da plataforma. Acompanhe os debates, silencie usuários infratores e responda à Dúvidas Oficiais da Secretaria.
           </p>
        </div>
      </div>

      {/* MÉTRICAS RÁPIDAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {metricas.map((m, idx) => (
            <div key={idx} className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform">
               <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">{m.icon}</div>
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${m.trend.startsWith('+') ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : m.trend === '0' ? 'text-slate-400 bg-slate-100 dark:bg-slate-800' : 'text-red-600 bg-red-50 dark:bg-red-900/20'}`}>
                     {m.trend}
                  </span>
               </div>
               <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{m.valor}</h3>
               <p className="text-sm font-semibold text-slate-500">{m.label}</p>
            </div>
         ))}
      </div>

      {/* FILA DE MODERAÇÃO */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mt-8">
         <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
               Radar de Tópicos
            </h2>
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
               <input type="text" placeholder="Filtrar Threads..." className="pl-9 pr-4 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <tr>
                     <th className="px-5 py-4 font-bold uppercase tracking-wider text-[10px]">Tópico / Discussão</th>
                     <th className="px-5 py-4 font-bold uppercase tracking-wider text-[10px]">Contexto Base</th>
                     <th className="px-5 py-4 font-bold uppercase tracking-wider text-[10px]">Autor</th>
                     <th className="px-5 py-4 font-bold uppercase tracking-wider text-[10px]">Alertas</th>
                     <th className="px-5 py-4 font-bold uppercase tracking-wider text-[10px] text-right">Ação Moderadora</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {reportes.map((rep) => (
                     <tr key={rep.id} className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors ${rep.gravidade === 'Alta' ? 'bg-red-50/30 dark:bg-red-900/5' : ''}`}>
                        <td className="px-5 py-4">
                           <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              {rep.assunto}
                           </div>
                           <div className="text-xs font-mono text-slate-400 mt-1">{rep.id} <span className="mx-1">•</span> {rep.data}</div>
                        </td>
                        <td className="px-5 py-4">
                           <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px] rounded tracking-wider border border-slate-200 dark:border-slate-700">
                              {rep.curso}
                           </span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                           <Users className="w-3.5 h-3.5 text-slate-400" /> {rep.autor}
                        </td>
                        <td className="px-5 py-4">
                           <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full border
                              ${rep.gravidade === 'Alta' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:border-red-800' : 
                                rep.status.includes('Denúncia') ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800' : 
                                'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'}
                           `}>
                              {rep.gravidade === 'Alta' && <ShieldAlert className="w-3 h-3" />}
                              {rep.status}
                           </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                           <div className="flex items-center justify-end gap-2 text-sm font-semibold">
                              <button className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors focus:outline-none" title="Aprovar/Manter">
                                 <CheckCircle className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none" title="Silenciar Aluno">
                                 <EyeOff className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus:outline-none" title="Apagar Tópico">
                                 <Trash2 className="w-4 h-4" />
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

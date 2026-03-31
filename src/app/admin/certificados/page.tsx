"use client";

import { Award, ShieldAlert, FileBadge, CheckCircle, Search, Calendar, ChevronRight } from "lucide-react";

export default function CertificadosAdminPage() {
  const lotesRecentes = [
    { id: 'LT-2026-A', modulo: 'Trilha Inclusão Digital', total: 450, data: '30 Mar 2026', status: 'Processado' },
    { id: 'LT-2026-B', modulo: 'Gestão Escolar Avançada', total: 120, data: 'Hoje', status: 'Aguardando Assinatura' }
  ];

  const logEmissoes = [
    { id: 'CERT-90A1B2', aluno: 'Gabrielle Silva', curso: 'Educação Inclusiva', carga: '40h', data: '31/03/2026' },
    { id: 'CERT-8F3C99', aluno: 'Marlon Costa', curso: 'Introdução ao AVA', carga: '20h', data: 'Ontem' },
    { id: 'CERT-1E2X44', aluno: 'Eduardo Pereira', curso: 'Gestão de Crise', carga: '10h', data: '28/03/2026' }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto pb-12">
      
      {/* HEADER DA SECRETARIA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5">
        <div>
           <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <Award className="w-7 h-7 text-emerald-500" />
              Gestão de Diplomas & Certificados
           </h1>
           <p className="text-slate-500 text-sm mt-2 max-w-2xl">
              Auditoria de certificação (Diário Eletrônico). Valide a autenticidade, aprove os lotes de diplomas gerados das novas trilhas e visualize os comprovantes emitidos pelo sistema.
           </p>
        </div>

        <button className="flex items-center gap-3 px-6 py-3 bg-[#0F172A] hover:bg-slate-800 text-white dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900 rounded-xl text-sm font-bold shadow-lg transition-transform hover:-translate-y-1">
           <FileBadge className="w-4 h-4" /> Layout do Certificado SEMED
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* LADO ESQUERDO: LOTES DE ASSINATURA */}
         <div className="lg:col-span-1 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
               Lotes de Emissão
            </h2>

            <div className="space-y-4">
               {lotesRecentes.map((lote) => (
                  <div key={lote.id} className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group">
                     
                     <div className="flex justify-between items-start mb-3">
                        <span className="font-mono text-xs font-bold text-slate-400">{lote.id}</span>
                        {lote.status === 'Processado' 
                           ? <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest"><CheckCircle className="w-3 h-3"/> Concluído</span>
                           : <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 rounded uppercase tracking-widest"><ShieldAlert className="w-3 h-3"/> Revisar Lote</span>
                        }
                     </div>

                     <h3 className="font-black text-slate-900 dark:text-white text-[15px] mb-1 leading-tight">{lote.modulo}</h3>
                     
                     <div className="flex items-center justify-between mt-4">
                        <div className="text-sm font-bold text-slate-500">{lote.total} Alunos</div>
                        <div className="text-xs font-semibold text-slate-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/> {lote.data}</div>
                     </div>
                  </div>
               ))}
               
               <button className="w-full py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                  Ver Histórico de Lotes <ChevronRight className="w-4 h-4"/>
               </button>
            </div>
         </div>

         {/* LADO DIREITO: DIÁRIO DE AUDITORIA CONTÍNUA */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center mb-1">
               <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  Transações Oficiais do Sistema
               </h2>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input type="text" placeholder="Hash do QR Code..." className="pl-9 pr-4 py-2 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary w-52" />
               </div>
            </div>

            <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                     <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                        <tr>
                           <th className="px-5 py-4 font-bold uppercase tracking-wider text-[10px]">Cód. Validação</th>
                           <th className="px-5 py-4 font-bold uppercase tracking-wider text-[10px]">Profissional Avaliado</th>
                           <th className="px-5 py-4 font-bold uppercase tracking-wider text-[10px]">Módulo Cursado</th>
                           <th className="px-5 py-4 font-bold uppercase tracking-wider text-[10px] text-right">Homologação</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {logEmissoes.map((log) => (
                           <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors">
                              <td className="px-5 py-4 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                 <FileBadge className="w-3.5 h-3.5 text-slate-400" /> {log.id}
                              </td>
                              <td className="px-5 py-4 font-bold text-slate-900 dark:text-white text-[13px]">{log.aluno}</td>
                              <td className="px-5 py-4">
                                 <span className="block font-semibold text-slate-700 dark:text-slate-200 text-[13px]">{log.curso}</span>
                                 <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded font-mono text-[9px] uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                                    {log.carga} Certificada
                                 </span>
                              </td>
                              <td className="px-5 py-4 text-right">
                                 <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">{log.data}</div>
                                 <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Válido</div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
            
            <p className="text-xs text-slate-400 text-right pr-2">
               Auditoria requerida pelo item 4.2 do Edital. Exportações são restritas ao menu <span className="font-bold underline cursor-pointer hover:text-slate-600">Relatórios</span>.
            </p>
         </div>

      </div>

    </div>
  );
}

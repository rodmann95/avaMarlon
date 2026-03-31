"use client";

import { Save, ShieldAlert, ServerCog, Palette, BellRing, DatabaseBackup, Power } from "lucide-react";
import { useState } from "react";

export default function GlobalSettingsPage() {
  const [manutencaoAtiva, setManutencaoAtiva] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const mockSave = () => {
     setSalvando(true);
     setTimeout(() => setSalvando(false), 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-[1000px] mx-auto pb-12">
      
      <div className="flex justify-between items-end mb-8">
        <div>
           <h1 className="text-2xl font-black text-slate-900 dark:text-white">Ajustes & Motores do AVA</h1>
           <p className="text-slate-500 text-sm mt-1">Configurações críticas, envio de e-mails sistêmicos e bloqueios.</p>
        </div>
        <button 
           onClick={mockSave}
           disabled={salvando}
           className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-bold shadow-md transition-all disabled:opacity-50"
        >
           {salvando ? "Sincronizando..." : <><Save className="w-4 h-4"/> Salvar Configurações</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         
         {/* MENU LATERAL ANCORADO */}
         <div className="space-y-2">
            <button className="w-full text-left px-5 py-3.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold rounded-xl flex items-center gap-3 shadow-sm border-l-4 border-l-secondary">
               <ServerCog className="w-5 h-5 text-secondary" /> Parâmetros Base
            </button>
            <button className="w-full text-left px-5 py-3.5 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent text-slate-600 dark:text-slate-400 font-bold rounded-xl flex items-center gap-3 transition-colors">
               <Palette className="w-5 h-5" /> Identidade Visual
            </button>
            <button className="w-full text-left px-5 py-3.5 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent text-slate-600 dark:text-slate-400 font-bold rounded-xl flex items-center gap-3 transition-colors">
               <BellRing className="w-5 h-5" /> Sistema de Notificações
            </button>
            <button className="w-full text-left px-5 py-3.5 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent text-slate-600 dark:text-slate-400 font-bold rounded-xl flex items-center gap-3 transition-colors">
               <DatabaseBackup className="w-5 h-5" /> Backups do Banco
            </button>
         </div>

         {/* FORMULÁRIO CENTRAL */}
         <div className="md:col-span-2 space-y-6">
            
            {/* Bloco 1 */}
            <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-8 rounded-[1.5rem] shadow-sm">
               <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">Informações Matrizes</h3>
               
               <div className="space-y-5">
                  <div>
                     <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nome Oficial da Instância</label>
                     <input type="text" defaultValue="EduFormação" className="w-full mt-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none font-medium text-slate-900 dark:text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                     <div>
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Remetente dos E-mails (SMTP)</label>
                        <input type="email" defaultValue="nao-responda@semed.edu.br" className="w-full mt-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-600 dark:text-slate-400 text-sm font-mono" />
                     </div>
                     <div>
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">E-mail Visível do Suporte</label>
                        <input type="email" defaultValue="rh.suporte@colombo.pr.gov.br" className="w-full mt-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-600 dark:text-slate-400 text-sm font-mono" />
                     </div>
                  </div>
               </div>
            </div>

            {/* DANGER ZONE - Bloco 2 */}
            <div className="border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-8 rounded-[1.5rem] shadow-sm">
               <h3 className="text-lg font-black text-red-700 dark:text-red-400 mb-6 flex items-center gap-2">
                 <ShieldAlert className="w-5 h-5"/> Zona Perigosa (Downtime)
               </h3>
               
               <div className="flex items-center justify-between">
                  <div>
                     <h4 className="font-bold text-slate-900 dark:text-white">Modo Manutenção (Kill-Switch)</h4>
                     <p className="text-sm text-slate-500 max-w-sm mt-1">Ao ativar, todos os alunos serão deslogados imediatamente e verão apenas uma tela de "Volto Logo". Apenas gestores conseguirão logar.</p>
                  </div>
                  
                  <button 
                     onClick={() => setManutencaoAtiva(!manutencaoAtiva)}
                     className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
                     ${manutencaoAtiva 
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg' 
                        : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'}
                  `}>
                     <Power className={`w-5 h-5 ${manutencaoAtiva ? 'animate-pulse' : ''}`} /> 
                     {manutencaoAtiva ? "Desligar Sistema" : "Sistema Online"}
                  </button>
               </div>
               
               {manutencaoAtiva && (
                  <div className="mt-6">
                     <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Mensagem que será exibida para os alunos:</label>
                     <textarea rows={3} defaultValue="Estamos atualizando os servidores da SEMED. Voltamos em 3 horas." className="w-full mt-2 bg-white dark:bg-slate-900 border border-red-300 dark:border-red-800 p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-medium text-slate-900 dark:text-white resize-none" />
                  </div>
               )}
            </div>

         </div>

      </div>

    </div>
  );
}

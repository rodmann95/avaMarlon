"use client";

import { MessageSquare, Search, PlusCircle, Users, Clock, Hash, ChevronRight, ThumbsUp } from "lucide-react";

export default function ForumAcademicoPage() {
  const categorias = [
    { id: 1, nome: "Dúvidas Gerais da Trilha", icon: <Hash className="w-5 h-5"/>, threads: 142, last: "Há 10 min" },
    { id: 2, nome: "Casos Reais & Debates (Educação Inclusiva)", icon: <Users className="w-5 h-5"/>, threads: 84, last: "Há 1 hora" },
    { id: 3, nome: "Suporte Técnico (Erros no AVA)", icon: <MessageSquare className="w-5 h-5"/>, threads: 23, last: "Ontem" },
  ];

  const threadsQuentes = [
    { id: '10A', titulo: 'Dicas para aplicar Gamificação em sala de aula?', autor: 'Gabrielle Silva', respostas: 12, curtidas: 45, tempo: '2 horas' },
    { id: '10B', titulo: 'Onde baixo as Diretrizes Municipais atualizadas?', autor: 'Marcos Costa', respostas: 4, curtidas: 8, tempo: '1 dia' },
    { id: '10C', titulo: 'Meu player de vídeo não passa pra próxima aula!', autor: 'Ana L.', respostas: 1, curtidas: 0, tempo: '3 dias' },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto pb-12">
      
      {/* HEADER ALUNO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
               <MessageSquare className="w-4 h-4" />
             </span>
             <h1 className="text-2xl font-black text-slate-900 dark:text-white">Fórum Pedagógico</h1>
           </div>
           <p className="text-slate-500 text-sm max-w-xl">
              Comunidade oficial da SEMED Colombo. Tire dúvidas com os tutores e compartilhe suas vivências escolares com outros educadores.
           </p>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white dark:text-slate-900 rounded-xl text-sm font-bold shadow-md transition-transform hover:-translate-y-1">
           <PlusCircle className="w-4 h-4" /> Abrir Novo Debate
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* ÁREA COAR: THREADS QUENTES */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center mb-2">
               <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  Discussões em Alta 🔥
               </h2>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Buscar assuntos..." className="pl-9 pr-4 py-2 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary w-64" />
               </div>
            </div>

            <div className="space-y-4">
               {threadsQuentes.map(thread => (
                  <div key={thread.id} className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group flex gap-4">
                     
                     <div className="hidden sm:flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 w-16 h-16 rounded-xl border border-slate-100 dark:border-slate-800 flex-shrink-0">
                        <span className="text-lg font-black text-primary">{thread.respostas}</span>
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">respostas</span>
                     </div>

                     <div className="flex-1 flex flex-col justify-between">
                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors text-base mb-1">
                           {thread.titulo}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-2">
                           <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5"/> {thread.autor}</span>
                           <span className="text-slate-300 dark:text-slate-700">•</span>
                           <span className="flex items-center gap-1 outline-none"><Clock className="w-3.5 h-3.5"/> a {thread.tempo}</span>
                           <span className="text-slate-300 dark:text-slate-700">•</span>
                           <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500"><ThumbsUp className="w-3.5 h-3.5"/> {thread.curtidas} apoios</span>
                        </div>
                     </div>

                  </div>
               ))}
               
               <button className="w-full py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl text-sm font-semibold transition-colors mt-2">
                  Carregar mais discussões
               </button>
            </div>
         </div>

         {/* SIDEBAR: ESTRUTURAS E ASSUNTOS */}
         <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
               Categorias Oficiais
            </h2>

            <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-2 rounded-2xl shadow-sm">
               {categorias.map(cat => (
                  <div key={cat.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-xl cursor-pointer group flex items-center justify-between transition-colors">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                           {cat.icon}
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">{cat.nome}</h4>
                           <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3"/> Atualizado {cat.last}</span>
                        </div>
                     </div>
                     <div className="text-right">
                        <span className="text-xs font-black text-slate-600 dark:text-slate-300 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                           {cat.threads}
                        </span>
                     </div>
                  </div>
               ))}
               
               <div className="mt-4 p-4 bg-secondary/10 border border-secondary/20 rounded-xl flex flex-col gap-2 cursor-pointer group">
                  <h4 className="font-bold text-secondary text-sm flex items-center gap-2">
                     Falar com a Mentoria (SME) <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform"/>
                  </h4>
                  <p className="text-xs text-secondary/80 leading-relaxed">O canal direto e privado para tirar dúvidas conteudistas da sua trilha.</p>
               </div>
            </div>

            {/* Aviso Regras */}
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/40 p-5 rounded-2xl text-amber-800 dark:text-amber-400">
               <h4 className="font-bold text-sm mb-2 flex items-center gap-2"> Regras da Comunidade</h4>
               <ul className="text-xs space-y-1.5 opacity-80 list-disc pl-4">
                  <li>Respeite o código de ética do servidor.</li>
                  <li>Evite compartilhar links externos.</li>
                  <li>Dúvidas técnicas? Marque a tag #Suporte.</li>
               </ul>
            </div>
         </div>

      </div>

    </div>
  );
}

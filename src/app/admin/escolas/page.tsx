import { Building2, Search, Plus, MapPin, TrendingUp, Users } from "lucide-react";

export default function GestaoEscolasPage() {
  const escolas = [
    { id: '1', nome: 'EM Gabriel de Lara', endereco: 'Rua Principal, 123 - Centro', zona: 'Urbana', cursistas: 124, conclusoes: '82%' },
    { id: '2', nome: 'CMEI Cantinho Sagrado', endereco: 'Av da Paz, 400 - Roça Grande', zona: 'Urbana', cursistas: 45, conclusoes: '90%' },
    { id: '3', nome: 'EM Zumbi dos Palmares', endereco: 'Est. Rural, S/N', zona: 'Rural', cursistas: 20, conclusoes: '65%' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-[1400px] mx-auto pb-12">
      
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-black text-slate-900 dark:text-white">Rede de Lotação (Escolas)</h1>
           <p className="text-slate-500 text-sm mt-1">Gerencie os polos, agrupe professores e avalie o engajamento por unidade.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md">
           <Plus className="w-4 h-4" /> Nova Unidade
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {escolas.map((esc) => (
            <div key={esc.id} className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-6 shadow-sm group hover:-translate-y-1 transition-all">
               
               <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                     <Building2 className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px] rounded-lg border border-slate-200 dark:border-slate-700">
                     Lotação {esc.zona}
                  </span>
               </div>
               
               <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1 line-clamp-1">{esc.nome}</h3>
               <p className="text-sm text-slate-500 flex items-center gap-1.5 line-clamp-1 truncate min-h-[20px]">
                  <MapPin className="flex-shrink-0 w-3.5 h-3.5" /> {esc.endereco}
               </p>

               <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/50 flex items-end justify-between">
                  <div>
                     <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Engajamento Atual</span>
                     <div className="flex items-center gap-1.5 text-secondary font-black text-xl">
                        <TrendingUp className="w-4 h-4" /> {esc.conclusoes}
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Muitos Vínculos</span>
                     <div className="flex items-center gap-1.5 justify-end text-slate-900 dark:text-white font-black text-xl">
                        <Users className="w-4 h-4 text-slate-400" /> {esc.cursistas}
                     </div>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}

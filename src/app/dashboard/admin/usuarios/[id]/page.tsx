import { BookOpen, Star, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminUsuarioEspelhoPage({ params }: { params: { id: string } }) {
  // Mockamos os dados pois a página renderiza estatísticas similares a página /dashboard
  // Na versão com DB os dados vêm da progresso_cursos onde "user_id" = params.id
  
  return (
    <div className="space-y-6">
      
      <Link href="/dashboard/admin/usuarios" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar para Auditores
      </Link>

      <header className="bg-slate-900 text-white rounded-[2rem] p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Star className="w-64 h-64 -mt-20 -mr-20 text-white" />
         </div>
         
         <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
               <AlertTriangle className="w-3.5 h-3.5" /> Visão Administrativa (Acesso Auditado)
            </span>
            <h1 className="text-3xl font-black mb-2">Painel de Eduardo Professor</h1>
            <p className="text-slate-400">Acompanhamento e suporte da jornada (ID: {params.id})</p>
         </div>
         
         <div className="relative z-10 flex gap-4 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 w-32">
               <span className="block text-4xl font-black mb-1 text-secondary">40</span>
               <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Horas Reais</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 w-32">
               <span className="block text-4xl font-black mb-1">2</span>
               <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Cursos Fim</span>
            </div>
         </div>
      </header>

      {/* Grid Simplificado do Cursista */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">Cursos Concluídos Recentemente</h3>
            <ul className="space-y-4">
               {['Diversidade e Inclusão - 20h', 'BNCC e Tecnologia - 20h'].map((curso, i) => (
                 <li key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center text-primary"><BookOpen className="w-5 h-5"/></div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{curso}</h4>
                      <p className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-bold">Nota: 100%</p>
                    </div>
                 </li>
               ))}
            </ul>
         </section>

         <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Anotações do Gestor</h3>
            <textarea 
              className="w-full h-40 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none resize-none"
              placeholder="Adicione observações particulares sobre o andamento e dúvidas que este educador reportou à SEMED..."
            ></textarea>
            <button className="mt-4 w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all">
               Salvar Ficha do Funcionário
            </button>
         </section>
      </div>

    </div>
  );
}

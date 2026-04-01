"use client";

import { FileEdit, CheckCircle2, Clock, Search, Filter, MessageSquare, AlertCircle, Loader2, X, Save, HelpCircle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AvaliacoesAdminPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [pendentes, setPendentes] = useState<any[]>([]);
  const [concluidas, setConcluidas] = useState<any[]>([]);
  const [selectedResposta, setSelectedResposta] = useState<any | null>(null);
  const [notaManual, setNotaManual] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    
    // 1. Busca Respostas Pendentes (Dissertativas não corrigidas)
    const { data: pData } = await supabase
      .from('respostas_questoes')
      .select(`
        id, resposta_texto, corrigida,
        questao:questoes(enunciado, tipo, avaliacao:avaliacoes(titulo)),
        tentativa:tentativas(id, user:users(nome, role))
      `)
      .eq('corrigida', false)
      .not('resposta_texto', 'is', null);

    if (pData) setPendentes(pData);

    // 2. Busca Histórico (Corrigidas)
    const { data: cData } = await supabase
      .from('respostas_questoes')
      .select(`
        id, nota_manual, corrigida,
        questao:questoes(enunciado, avaliacao:avaliacoes(titulo)),
        tentativa:tentativas(id, user:users(nome))
      `)
      .eq('corrigida', true)
      .limit(10);

    if (cData) setConcluidas(cData);

    setLoading(false);
  }

  const handleReview = (resp: any) => {
    setSelectedResposta(resp);
    setNotaManual(0);
    setFeedback("");
  };

  const saveReview = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('respostas_questoes')
      .update({
        nota_manual: notaManual,
        feedback_corretor: feedback,
        corrigida: true
      })
      .eq('id', selectedResposta.id);

    if (!error) {
       setSelectedResposta(null);
       fetchData();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div><div className="flex items-center gap-2 mb-2"><span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center"><FileEdit className="w-4 h-4" /></span><h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Central de Avaliações SEMED</h1></div><p className="text-slate-500 font-bold text-sm">Auditoria e correção manual de provas dissertativas e híbridas.</p></div>
        <div className="flex items-center gap-3"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Buscar..." className="pl-9 pr-4 py-3 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold shadow-sm" /></div></div>
      </div>

      {loading ? (
        <div className="flex justify-center p-32"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
      ) : (
        <>
          {/* FILA DE CORREÇÃO */}
          <section>
             <h2 className="text-xl font-black text-red-600 dark:text-red-400 mb-6 flex items-center gap-3 uppercase tracking-tight">
                <AlertCircle className="w-6 h-6 animate-pulse" /> Atividades Aguardando Revisão
                {pendentes.length > 0 && <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-black">{pendentes.length} na fila</span>}
             </h2>
             
             {pendentes.length === 0 ? (
               <div className="p-20 bg-slate-50 dark:bg-[#0F172A] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] text-center text-slate-400 font-bold uppercase tracking-widest opacity-40">Tudo em dia por aqui!</div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                  {pendentes.map(prova => (
                     <div key={prova.id} className="bg-white dark:bg-[#0F172A] border-2 border-red-100 dark:border-red-900/30 p-8 rounded-[3rem] shadow-sm flex flex-col justify-between hover:shadow-xl transition-all border-l-8 border-l-red-500">
                        <div className="mb-6"><div className="flex justify-between items-start mb-4"><span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-red-100">{prova.questao?.tipo}</span><span className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase"><Clock className="w-4 h-4"/> Pendente</span></div><h3 className="font-black text-slate-900 dark:text-white text-xl mb-2 line-clamp-1">{prova.questao?.avaliacao?.titulo}</h3><p className="text-sm font-black text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-widest">{prova.tentativa?.user?.nome} <span className="text-slate-200 dark:text-slate-800">•</span> <span className="font-bold text-xs">{prova.tentativa?.user?.role}</span></p></div>
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end"><button onClick={() => handleReview(prova)} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"><MessageSquare className="w-5 h-5"/> Avaliar Resposta</button></div>
                     </div>
                  ))}
               </div>
             )}
          </section>

          {/* HISTÓRICO */}
          <section className="pt-12">
             <h2 className="text-xl font-black text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3 uppercase tracking-tight"><CheckCircle2 className="w-6 h-6 text-emerald-500" /> Corrigidas Recentemente</h2>
             <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[3rem] overflow-hidden shadow-sm pt-4"><div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                   <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 uppercase font-black text-[9px] tracking-widest">
                      <tr><th className="px-8 py-6">Prova / Questão</th><th className="px-8 py-6">Cursista</th><th className="px-8 py-6 text-right">Nota Dada</th></tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 dark:divide-slate-800/30">
                      {concluidas.map((req) => (
                         <tr key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-all">
                            <td className="px-8 py-6"><div className="font-black text-slate-900 dark:text-white text-base mb-1">{req.questao?.avaliacao?.titulo}</div><div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate max-w-xs">{req.questao?.enunciado}</div></td>
                            <td className="px-8 py-6 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest text-xs">{req.tentativa?.user?.nome}</td>
                            <td className="px-8 py-6 text-right"><span className="px-4 py-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 rounded-xl font-black text-sm">{req.nota_manual} %</span></td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div></div>
          </section>
        </>
      )}

      {/* MODAL DE CORREÇÃO */}
      {selectedResposta && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
           <div className="bg-white dark:bg-[#0F172A] w-full max-w-2xl rounded-[3rem] shadow-2xl p-12 border border-slate-200 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setSelectedResposta(null)} className="absolute top-10 right-10 p-2 text-slate-400 hover:text-slate-900 transition-colors"><X className="w-8 h-8" /></button>
              
              <div className="mb-10"><div className="flex items-center gap-3 text-red-500 mb-2"><HelpCircle className="w-6 h-6"/><span className="font-black uppercase tracking-widest text-xs">Correção Dissertativa</span></div><h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedResposta.questao?.enunciado}</h2></div>

              <div className="space-y-10 group">
                 <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 italic text-lg leading-relaxed text-slate-600 dark:text-slate-300 font-medium">"{selectedResposta.resposta_texto}"</div>
                 
                 <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Nota Atribuída (0-100)</label>
                    <div className="flex items-center gap-4"><input type="range" min="0" max="100" value={notaManual} onChange={e => setNotaManual(parseInt(e.target.value))} className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none accent-primary cursor-pointer" /><span className="text-3xl font-black text-primary min-w-[3.5rem]">{notaManual}%</span></div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Feedback de Correção (Opcional)</label>
                    <textarea rows={4} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Dicas de melhoria para o cursista..." className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl font-bold focus:ring-2 focus:ring-primary outline-none" />
                 </div>

                 <button onClick={saveReview} disabled={saving} className="w-full py-6 bg-primary text-white rounded-3xl font-black shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3 mt-4">{saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Efetivar Avaliação <CheckCircle className="w-6 h-6"/></>}</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

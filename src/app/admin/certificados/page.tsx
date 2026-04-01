"use client";

import { Award, ShieldAlert, FileBadge, CheckCircle, Search, Calendar, ChevronRight, Loader2, X, CheckCircle2, UserCheck, UserX, ExternalLink, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function CertificadosAdminPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [certificados, setCertificados] = useState<any[]>([]);
  const [submissoes, setSubmissoes] = useState<any[]>([]);
  const [selectedSubmissao, setSelectedSubmissao] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    
    // 1. Busca Certificados Emitidos pelo Sistema
    const { data: certData } = await supabase
      .from('certificados')
      .select(`*, user:users(nome)`)
      .order('emitido_em', { ascending: false })
      .limit(20);
    
    if (certData) setCertificados(certData);

    // 2. Busca Submissões de Títulos (Externos)
    const { data: subData } = await supabase
      .from('submissoes_titulos')
      .select(`*, user:users(nome)`)
      .order('created_at', { ascending: false });

    if (subData) setSubmissoes(subData);
    
    setLoading(false);
  }

  const handleUpdateStatus = async (id: string, status: 'aprovado' | 'rejeitado') => {
    setSaving(true);
    const { error } = await supabase
      .from('submissoes_titulos')
      .update({ 
        status, 
        analisado_em: new Date().toISOString()
      })
      .eq('id', id);

    if (!error) fetchData();
    setSaving(false);
  };

  return (
    <div className="space-y-10 animate-fade-in max-w-[1400px] mx-auto pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center"><Award className="w-6 h-6" /></div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Gestão de Certificação SEMED</h1>
           </div>
           <p className="text-slate-500 font-bold text-sm max-w-2xl">Homologação de títulos externos e auditoria de diplomas emitidos via EduFormação.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-32"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LADO ESQUERDO: SUBMISSÕES DE TÍTULOS (FILA DE HOMOLOGAÇÃO) */}
          <div className="lg:col-span-1 space-y-6">
             <h2 className="text-xl font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-amber-500" /> Títulos Externos
             </h2>

             <div className="space-y-4">
                {submissoes.length === 0 ? <div className="p-10 border-2 border-dashed border-slate-200 rounded-[2rem] text-center text-slate-400 font-bold text-xs uppercase tracking-widest opacity-40">Fila Vazia</div> : submissoes.map((sub) => (
                   <div key={sub.id} className={`bg-white dark:bg-[#0F172A] border-2 p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border-l-8 ${sub.status === 'pendente' ? 'border-l-amber-500 bg-amber-50/10' : sub.status === 'aprovado' ? 'border-l-emerald-500' : 'border-l-red-500 opacity-60'}`}>
                      <div className="flex justify-between items-start mb-4">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{new Date(sub.created_at).toLocaleDateString()}</span>
                         <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border ${sub.status === 'pendente' ? 'bg-amber-100 text-amber-700 border-amber-200' : sub.status === 'aprovado' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'}`}>{sub.status}</span>
                      </div>
                      <h3 className="font-black text-slate-900 dark:text-white text-lg leading-tight mb-2 uppercase tracking-tight">{sub.titulo_curso}</h3>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">{sub.user?.nome} <span className="mx-2">•</span> {sub.carga_horaria_horas}h</p>
                      
                      {sub.status === 'pendente' && (
                        <div className="flex gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                           <button onClick={() => handleUpdateStatus(sub.id, 'aprovado')} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"><UserCheck className="w-4 h-4"/> Aprovar</button>
                           <button onClick={() => handleUpdateStatus(sub.id, 'rejeitado')} className="flex-1 py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"><UserX className="w-4 h-4"/> Rejeitar</button>
                        </div>
                      )}
                      <a href={sub.url_arquivo} target="_blank" className="mt-4 w-full py-2.5 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">Ver Documento <ExternalLink className="w-3 h-3"/></a>
                   </div>
                ))}
             </div>
          </div>

          {/* LADO DIREITO: HISTÓRICO DE CERTIFICADOS SISTEMICOS */}
          <div className="lg:col-span-2 space-y-6">
             <h2 className="text-xl font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight flex items-center gap-3">
                <FileBadge className="w-6 h-6 text-primary" /> Diário de Transações Reais
             </h2>

             <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[3rem] overflow-hidden shadow-sm pt-4">
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 text-slate-500 uppercase font-black text-[9px] tracking-widest">
                         <tr><th className="px-8 py-5">Hash / Profissional</th><th className="px-8 py-5">Curso Homologado</th><th className="px-8 py-5 text-right">Emissão</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800/30">
                         {certificados.length === 0 ? <tr><td colSpan={3} className="px-8 py-20 text-center text-slate-300 font-bold uppercase tracking-widest opacity-30 italic">Sem registros no sistema</td></tr> : certificados.map((cert) => (
                            <tr key={cert.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-all">
                               <td className="px-8 py-6"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-[10px] shadow-lg">#{cert.id.slice(0, 3)}</div><div className="flex flex-col"><span className="font-black text-slate-900 dark:text-white text-base">{cert.user?.nome}</span><span className="text-[9px] font-mono font-bold text-slate-300 uppercase">{cert.codigo_validacao}</span></div></div></td>
                               <td className="px-8 py-6"><span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-100">{cert.carga_horaria}h Certificadas</span></td>
                               <td className="px-8 py-6 text-right"><div className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{new Date(cert.emitido_em).toLocaleDateString()}</div><div className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] mt-1 flex items-center justify-end gap-1"><CheckCircle2 className="w-3 h-3"/> Válido</div></td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>

        </div>
      )}
    </div>
  );
}

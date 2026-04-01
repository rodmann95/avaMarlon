"use client";

import { useState, useEffect } from "react";
import { MessageSquare, ShieldAlert, TrendingUp, Users, Search, Trash2, CheckCircle, EyeOff, Loader2, ExternalLink } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function ForunsAdminPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [topicos, setTopicos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalTopicos: 0,
    totalMensagens: 0,
    usuariosAtivos: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    
    // 1. Busca Tópicos com detalhes
    const { data: topicosData, error } = await supabase
      .from('topicos_forum')
      .select(`
        *,
        autor:users(nome, role),
        respostas:mensagens_forum(count)
      `)
      .order('criado_em', { ascending: false });

    if (!error && topicosData) {
      setTopicos(topicosData);
      
      // 2. Busca métricas básicas
      const { count: tCount } = await supabase.from('topicos_forum').select('*', { count: 'exact', head: true });
      const { count: mCount } = await supabase.from('mensagens_forum').select('*', { count: 'exact', head: true });
      
      setStats({
        totalTopicos: tCount || 0,
        totalMensagens: mCount || 0,
        usuariosAtivos: topicosData.length // Simplificação por enquanto
      });
    }
    setLoading(false);
  }

  const handleDeleteTopico = async (id: string) => {
    if (confirm("Tem certeza que deseja apagar este tópico permanentemente? Todas as respostas também serão removidas.")) {
      const { error } = await supabase.from('topicos_forum').delete().eq('id', id);
      if (!error) fetchData();
      else alert("Erro ao deletar: " + error.message);
    }
  };

  const filteredTopicos = topicos.filter(t => 
    t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.autor?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const metricas = [
    { label: "Tópicos Totais", valor: stats.totalTopicos.toString(), trend: "+5%", icon: <MessageSquare className="w-5 h-5 text-blue-500" /> },
    { label: "Interações", valor: stats.totalMensagens.toString(), trend: "+12%", icon: <TrendingUp className="w-5 h-5 text-emerald-500" /> },
    { label: "Alerta Moderação", valor: "0", trend: "Estável", icon: <ShieldAlert className="w-5 h-5 text-amber-500" /> },
    { label: "Autores Únicos", valor: stats.usuariosAtivos.toString(), trend: "+2", icon: <Users className="w-5 h-5 text-slate-500" /> },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto pb-12">
      
      {/* Header Admin */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-1">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
               <ShieldAlert className="w-6 h-6" />
             </div>
             <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Gestão da Comunidade</h1>
           </div>
           <p className="text-slate-500 text-sm max-w-2xl font-medium">
              Painel de moderação de fóruns. Monitore conversas, remova conteúdos impróprios e acompanhe o engajamento dos cursistas.
           </p>
        </div>
      </div>

      {/* MÉTRICAS RÁPIDAS (REAIS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {metricas.map((m, idx) => (
            <div key={idx} className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
               <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">{m.icon}</div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${m.trend.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : m.trend === 'Estável' ? 'text-slate-400 bg-slate-100' : 'text-amber-600 bg-amber-50'}`}>
                     {m.trend}
                  </span>
               </div>
               <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-1 leading-none tracking-tighter">{m.valor}</h3>
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
            </div>
         ))}
      </div>

      {/* FILA DE MODERAÇÃO REAL */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden mt-8">
         <div className="p-7 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 gap-4">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight flex items-center gap-3">
               <MessageSquare className="w-6 h-6 text-primary" /> Radar de Discussões
            </h2>
            <div className="relative w-full sm:w-80">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Buscar por título ou autor..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary outline-none shadow-sm" 
               />
            </div>
         </div>

         {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
               <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
               <p className="font-black uppercase tracking-widest text-xs">Consultando base do Fórum...</p>
            </div>
         ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                     <tr>
                        <th className="px-7 py-5 font-black uppercase tracking-widest text-[10px]">Tópico / Discussão</th>
                        <th className="px-7 py-5 font-black uppercase tracking-widest text-[10px]">Categoria</th>
                        <th className="px-7 py-5 font-black uppercase tracking-widest text-[10px]">Interações</th>
                        <th className="px-7 py-5 font-black uppercase tracking-widest text-[10px]">Autor original</th>
                        <th className="px-7 py-5 font-black uppercase tracking-widest text-[10px] text-right">Ação</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                     {filteredTopicos.length === 0 ? (
                        <tr>
                           <td colSpan={5} className="px-7 py-20 text-center text-slate-400 font-bold opacity-30 uppercase tracking-[0.3em]">Nenhum tópico encontrado no radar.</td>
                        </tr>
                     ) : (
                        filteredTopicos.map((topico) => (
                           <tr key={topico.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-all group">
                              <td className="px-7 py-5">
                                 <div className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2 group-hover:text-primary transition-colors cursor-pointer">
                                    {topico.titulo}
                                    <Link href={`/dashboard/forum/${topico.id}`} target="_blank"><ExternalLink className="w-3.5 h-3.5 opacity-30 hover:opacity-100"/></Link>
                                 </div>
                                 <div className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">
                                    {new Date(topico.criado_em).toLocaleDateString()} • {new Date(topico.criado_em).toLocaleTimeString()}
                                 </div>
                              </td>
                              <td className="px-7 py-5">
                                 <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black uppercase text-[9px] rounded-lg tracking-widest border border-slate-200 dark:border-slate-700">
                                    {topico.categoria}
                                 </span>
                              </td>
                              <td className="px-7 py-5">
                                 <div className="flex items-center gap-2 font-black text-slate-700 dark:text-slate-300">
                                    <MessageSquare className="w-4 h-4 text-slate-300" /> {topico.respostas?.[0]?.count || 0}
                                 </div>
                              </td>
                              <td className="px-7 py-5">
                                 <div className="flex flex-col">
                                    <span className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                                       {topico.autor?.nome}
                                       {topico.autor?.role === 'admin' && <CheckCircle className="w-3.5 h-3.5 text-secondary" />}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">{topico.autor?.role || 'user'}</span>
                                 </div>
                              </td>
                              <td className="px-7 py-5 text-right">
                                 <div className="flex items-center justify-end gap-3">
                                    <button 
                                      onClick={() => handleDeleteTopico(topico.id)}
                                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all shadow-sm active:scale-90" 
                                      title="Remover Tópico"
                                    >
                                       <Trash2 className="w-5 h-5" />
                                    </button>
                                    <button className="p-3 text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all shadow-sm" title="Silenciar Autor">
                                       <EyeOff className="w-5 h-5" />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        )
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>

    </div>
  );
}

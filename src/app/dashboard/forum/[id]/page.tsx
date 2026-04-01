"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Send, User, Clock, MessageSquare, Loader2, ShieldCheck, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function DetalheTopicoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [topico, setTopico] = useState<any>(null);
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  async function fetchData() {
    setLoading(true);
    
    // 1. Busca Detalhes do Tópico
    const { data: topicoData, error: tError } = await supabase
      .from('topicos_forum')
      .select(`
        *,
        autor:users(nome, cargo, role)
      `)
      .eq('id', params.id)
      .single();

    if (tError || !topicoData) {
       router.push('/dashboard/forum');
       return;
    }
    setTopico(topicoData);

    // 2. Busca Mensagens (Respostas)
    const { data: mensagensData } = await supabase
      .from('mensagens_forum')
      .select(`
        *,
        autor:users(nome, cargo, role)
      `)
      .eq('topico_id', params.id)
      .order('criado_em', { ascending: true });

    if (mensagensData) setMensagens(mensagensData);
    setLoading(false);
  }

  const handleEnviarResposta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaMensagem.trim()) return;

    setEnviando(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('mensagens_forum')
      .insert([{
        topico_id: params.id,
        user_id: user.id,
        mensagem: novaMensagem
      }]);

    if (!error) {
      setNovaMensagem("");
      fetchData(); // Recarrega para mostrar a nova mensagem
    } else {
      alert("Erro ao enviar resposta: " + error.message);
    }
    setEnviando(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
         <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
         <p className="font-bold uppercase tracking-widest text-xs">Carregando debate...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-fade-in px-4">
      
      {/* Botão Voltar */}
      <button 
        onClick={() => router.push('/dashboard/forum')}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao Fórum
      </button>

      {/* Card do Tópico Principal (Abertura) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden">
         <div className="p-8 md:p-12 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
               <span className="px-3 py-1 bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] rounded-full">{topico.categoria}</span>
               <span className="text-slate-300 dark:text-slate-700 font-bold">•</span>
               <span className="text-slate-400 font-bold text-[11px] uppercase tracking-widest">{new Date(topico.criado_em).toLocaleString()}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-8">
               {topico.titulo}
            </h1>
            
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl mb-8 border border-slate-100 dark:border-slate-800">
               <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-primary">
                  <User className="w-7 h-7" />
               </div>
               <div>
                  <p className="font-black text-slate-900 dark:text-white leading-none mb-1 flex items-center gap-2">
                     {topico.autor?.nome} 
                     {topico.autor?.role === 'admin' && <ShieldCheck className="w-4 h-4 text-secondary" />}
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{topico.autor?.cargo || 'Educador(a)'}</p>
               </div>
            </div>

            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 font-medium md:text-lg leading-relaxed whitespace-pre-wrap">
               {topico.mensagem}
            </div>
         </div>

         <div className="px-8 py-5 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between">
            <div className="flex items-center gap-6">
               <button className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-colors font-bold text-xs uppercase tracking-widest">
                  <Heart className="w-5 h-5" /> 0 Apoios
               </button>
               <button className="flex items-center gap-2 text-slate-400 transition-colors font-bold text-xs uppercase tracking-widest">
                  <MessageSquare className="w-5 h-5" /> {mensagens.length} Respostas
               </button>
            </div>
         </div>
      </section>

      {/* Lista de Respostas (Fio) */}
      <div className="space-y-6 relative">
         <div className="absolute left-[30px] top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 opacity-30"></div>
         
         {mensagens.map((msg, index) => (
            <div key={msg.id} className="relative pl-16 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
               {/* Avatar da Bolha */}
               <div className="absolute left-0 top-0 w-[62px] h-[62px] rounded-[22px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-center z-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${msg.autor?.role === 'admin' ? 'bg-secondary/10 text-secondary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                     <User className="w-6 h-6" />
                  </div>
               </div>

               <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-6 md:p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                     <span className="font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                        {msg.autor?.nome}
                        {msg.autor?.role === 'admin' && <span className="text-[9px] bg-secondary text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Tutor SME</span>}
                     </span>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {new Date(msg.criado_em).toLocaleString()}
                     </span>
                  </div>
                  
                  <div className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-wrap">
                     {msg.mensagem}
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* Caixa de Resposta (Footer) */}
      <section className="bg-slate-900 text-white rounded-[3rem] p-8 md:p-12 shadow-2xl mt-12 relative overflow-hidden group">
         <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <MessageSquare className="w-64 h-64" />
         </div>
         
         <h3 className="text-2xl font-black mb-6 flex items-center gap-3 relative z-10">
            Sua Resposta <span className="text-slate-500 font-medium">|</span> <span className="text-primary text-sm uppercase tracking-widest font-black">Colabore</span>
         </h3>
         
         <form onSubmit={handleEnviarResposta} className="relative z-10 space-y-6">
            <textarea 
               value={novaMensagem}
               onChange={(e) => setNovaMensagem(e.target.value)}
               placeholder="Escreva aqui sua contribuição para o debate..."
               className="w-full bg-slate-800/50 border border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary rounded-[2rem] p-6 text-white placeholder:text-slate-500 outline-none transition-all font-medium leading-relaxed"
               rows={6}
               required
            />
            
            <div className="flex justify-end">
               <button 
                  type="submit"
                  disabled={enviando || !novaMensagem.trim()}
                  className="px-10 py-4 bg-primary text-white rounded-2xl font-black flex items-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
               >
                  {enviando ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Enviar Resposta</>}
               </button>
            </div>
         </form>
      </section>

    </div>
  );
}

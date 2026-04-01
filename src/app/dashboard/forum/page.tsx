"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Search, PlusCircle, Users, Clock, Hash, ChevronRight, ThumbsUp, Loader2, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function ForumAcademicoPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [topicos, setTopicos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({ titulo: '', mensagem: '', categoria: 'Dúvidas Gerais' });
  const [saving, setSaving] = useState(false);

  const categorias = [
    { id: 1, nome: "Dúvidas Gerais", icon: <Hash className="w-5 h-5"/> },
    { id: 2, nome: "Casos Reais & Debates", icon: <Users className="w-5 h-5"/> },
    { id: 3, nome: "Suporte Técnico", icon: <MessageSquare className="w-5 h-5"/> },
  ];

  useEffect(() => {
    fetchTopicos();
  }, []);

  async function fetchTopicos() {
    setLoading(true);
    const { data, error } = await supabase
      .from('topicos_forum')
      .select(`
        *,
        autor:users(nome),
        respostas:mensagens_forum(count)
      `)
      .order('criado_em', { ascending: false });

    if (!error && data) {
      setTopicos(data.map(t => ({
        ...t,
        autor_nome: t.autor?.nome || 'Usuário SEMED',
        respostas_count: t.respostas?.[0]?.count || 0,
        curtidas: 0 // Mock de curtidas por enquanto
      })));
    }
    setLoading(false);
  }

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('topicos_forum')
      .insert([{
        titulo: newTopic.titulo,
        mensagem: newTopic.mensagem,
        categoria: newTopic.categoria,
        user_id: user.id
      }]);

    if (!error) {
      setIsModalOpen(false);
      setNewTopic({ titulo: '', mensagem: '', categoria: 'Dúvidas Gerais' });
      fetchTopicos();
    } else {
      alert("Erro ao criar tópico: " + error.message);
    }
    setSaving(false);
  };

  const filteredTopicos = topicos.filter(t => 
    t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.mensagem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="space-y-3">
           <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
               <MessageSquare className="w-6 h-6" />
             </div>
             <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Fórum de Educadores</h1>
           </div>
           <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
              Troque experiências, tire dúvidas sobre as trilhas e colabore com a rede de ensino de Colombo.
           </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
           <PlusCircle className="w-5 h-5" /> Iniciar Conversa
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         
         <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
               <h2 className="text-xl font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                  Discussões Recentes
               </h2>
               <div className="relative w-full sm:w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar assunto..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm" 
                  />
               </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                 <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                 <p className="font-bold uppercase tracking-widest text-xs">Conectando à Comunidade...</p>
              </div>
            ) : (
              <div className="space-y-5">
                 {filteredTopicos.map(topic => (
                    <Link 
                      key={topic.id} 
                      href={`/dashboard/forum/${topic.id}`}
                      className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer group flex gap-6"
                    >
                       <div className="hidden sm:flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 w-20 h-20 rounded-[1.5rem] border border-slate-100 dark:border-slate-800/50 flex-shrink-0 group-hover:bg-primary/5 transition-colors">
                          <span className="text-2xl font-black text-primary">{topic.respostas_count}</span>
                          <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest">respostas</span>
                       </div>

                       <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-3 mb-1">
                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black uppercase text-[9px] rounded-lg tracking-widest">{topic.categoria}</span>
                             </div>
                             <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight">
                                {topic.titulo}
                             </h3>
                          </div>
                          
                          <div className="flex items-center gap-5 text-[11px] font-black text-slate-400 uppercase tracking-wider mt-4">
                             <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Users className="w-4 h-4 text-primary"/> {topic.autor_nome}</span>
                             <span className="text-slate-200 dark:text-slate-800">•</span>
                             <span className="flex items-center gap-2"><Clock className="w-4 h-4"/> {new Date(topic.criado_em).toLocaleDateString()}</span>
                             <span className="hidden sm:flex ml-auto items-center gap-1.5 text-emerald-500"><ThumbsUp className="w-4 h-4"/> 0</span>
                          </div>
                       </div>
                    </Link>
                 ))}
                 
                 {filteredTopicos.length === 0 && (
                   <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem]">
                     <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-10" />
                     <p className="text-slate-400 font-bold">Nenhuma discussão encontrada.</p>
                   </div>
                 )}
              </div>
            )}
         </div>

         {/* SIDEBAR */}
         <div className="space-y-8">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">
               Salas de Discussão
            </h2>

            <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-4 rounded-[2.5rem] shadow-sm">
               {categorias.map(cat => (
                  <div key={cat.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-2xl cursor-pointer group flex items-center justify-between transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 text-slate-400 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm">
                           {cat.icon}
                        </div>
                        <div>
                           <h4 className="font-black text-slate-800 dark:text-slate-200 text-sm uppercase tracking-tight">{cat.nome}</h4>
                           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Acessar Sala</span>
                        </div>
                     </div>
                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
               ))}
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                  <PlusCircle className="w-48 h-48 -mr-16 -mt-16" />
               </div>
               <h4 className="text-xl font-black mb-3">Sua voz importa!</h4>
               <p className="text-slate-400 font-medium text-sm leading-relaxed mb-6">
                  Não encontrou o que procurava? Crie um novo debate e ajude outros educadores da rede.
               </p>
               <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest"
               >
                  Novo Tópico
               </button>
            </div>
         </div>
      </div>

      {/* Modal de Novo Tópico */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
           <div className="bg-white dark:bg-[#0F172A] w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 border border-slate-200 dark:border-slate-800 relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="mb-10 text-center">
                 <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Novo Debate</h2>
                 <p className="text-slate-500 font-medium">Compartilhe sua dúvida ou conhecimento com a comunidade.</p>
              </div>

              <form onSubmit={handleCreateTopic} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Categoria</label>
                       <select 
                          value={newTopic.categoria}
                          onChange={e => setNewTopic({...newTopic, categoria: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none font-black"
                       >
                          {categorias.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Título do Assunto</label>
                       <input 
                          required
                          value={newTopic.titulo}
                          onChange={e => setNewTopic({...newTopic, titulo: e.target.value})}
                          placeholder="Ex: Como baixar o material do Módulo 2?"
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none font-black"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Sua Mensagem / Dúvida</label>
                    <textarea 
                       required
                       rows={5}
                       value={newTopic.mensagem}
                       onChange={e => setNewTopic({...newTopic, mensagem: e.target.value})}
                       className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none font-medium leading-relaxed"
                       placeholder="Descreva detalhadamente seu ponto de vista ou dúvida para que outros possam ajudar."
                    />
                 </div>

                 <button 
                    type="submit"
                    disabled={saving}
                    className="w-full py-5 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/30 hover:bg-primary/90 flex items-center justify-center gap-3 transition-all text-sm uppercase tracking-widest"
                 >
                    {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : "Publicar Discussão"}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

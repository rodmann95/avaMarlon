"use client";

import { Search, Plus, PlayCircle, LibraryBig, MoreVertical, Edit2, Archive, Loader2, CheckCircle2, X, PlusCircle, LayoutGrid } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";

export default function GestaoCursosAdminPage() {
  const supabase = createClient();
  const [trilhas, setTrilhas] = useState<any[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados dos Modais
  const [isTrilhaModalOpen, setIsTrilhaModalOpen] = useState(false);
  const [isCursoModalOpen, setIsCursoModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newTrilha, setNewTrilha] = useState({ titulo: '', descricao: '' });
  const [newCurso, setNewCurso] = useState({ titulo: '', carga_horaria_horas: 40, trilha_id: '' });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    
    // 1. Busca Trilhas com contagem de cursos e matrículas (Real)
    const { data: trilhasData } = await supabase
      .from('trilhas')
      .select(`
        id, titulo, ativo,
        cursos:cursos(count),
        matriculas_trilha:user_escola(count) 
      `)
      .order('titulo');
    
    if (trilhasData) {
      setTrilhas(trilhasData.map(t => ({
        id: t.id,
        nome: t.titulo,
        cursos: t.cursos?.[0]?.count || 0,
        alunos: t.matriculas_trilha?.[0]?.count || 0, 
        status: t.ativo ? 'Publicada' : 'Arquivada'
      })));
    }

    // 2. Busca Cursos com contagem de módulos
    const { data: cursosData } = await supabase
      .from('cursos')
      .select(`
        id, titulo, carga_horaria_horas, ativo,
        modulos:modulos(count)
      `)
      .order('titulo');

    if (cursosData) {
      setCursos(cursosData.map(c => ({
        id: c.id,
        nome: c.titulo,
        modulos: c.modulos?.[0]?.count || 0,
        autor: 'SEMED Colombo',
        carga: `${c.carga_horaria_horas}h`,
        status: c.ativo ? 'Ativo' : 'Arquivado',
        ativo: c.ativo
      })));
    }
    setLoading(false);
  }

  const handleCreateTrilha = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('trilhas').insert([newTrilha]);
    if (!error) {
      setIsTrilhaModalOpen(false);
      setNewTrilha({ titulo: '', descricao: '' });
      fetchData();
    } else {
      alert("Erro ao criar trilha: " + error.message);
    }
    setSaving(false);
  };

  const handleCreateCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCurso.trilha_id) return alert("Selecione uma trilha para o curso!");
    
    setSaving(true);
    const { error } = await supabase.from('cursos').insert([newCurso]);
    if (!error) {
      setIsCursoModalOpen(false);
      setNewCurso({ titulo: '', carga_horaria_horas: 40, trilha_id: '' });
      fetchData();
    } else {
      alert("Erro ao criar curso: " + error.message);
    }
    setSaving(false);
  };

  const handleArquivarCurso = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('cursos')
      .update({ ativo: !currentStatus })
      .eq('id', id);

    if (!error) {
      setCursos(prev => prev.map(c => 
        c.id === id ? { ...c, ativo: !currentStatus, status: !currentStatus ? 'Ativo' : 'Arquivado' } : c
      ));
    }
  };

  const filteredCursos = useMemo(() => {
    return cursos.filter(c => 
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.id.includes(searchTerm)
    );
  }, [cursos, searchTerm]);

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
           <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Matriz Formativa SEMED</h1>
           <p className="text-slate-500 font-medium text-sm">Gestão central de Trilhas Pedagógicas e Cursos da rede municipal.</p>
        </div>

        <div className="flex gap-4 w-full sm:w-auto">
           <button 
             onClick={() => setIsTrilhaModalOpen(true)}
             className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm"
           >
             <LibraryBig className="w-5 h-5" /> Nova Trilha
           </button>
           <button 
             onClick={() => setIsCursoModalOpen(true)}
             className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95"
           >
             <PlusCircle className="w-5 h-5" /> Novo Curso
           </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-32 text-slate-400">
           <Loader2 className="w-12 h-12 animate-spin mb-6 text-primary" />
           <p className="font-black uppercase tracking-widest text-[10px]">Acessando acervo pedagógico...</p>
        </div>
      ) : (
        <>
          {/* DASHBOARD DE TRILHAS */}
          <div className="space-y-6">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                   <LibraryBig className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Trilhas de Aprendizagem</h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trilhas.map((trilha) => (
                   <div key={trilha.id} className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-2xl hover:border-primary/20 transition-all cursor-pointer group relative overflow-hidden">
                      <div className="flex justify-between items-start mb-6 relative z-10">
                         <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg border 
                            ${trilha.status === 'Publicada' 
                               ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' 
                               : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}>
                            {trilha.status}
                         </span>
                         <button className="p-2 text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                      </div>
                      
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight relative z-10 line-clamp-2">{trilha.nome}</h3>
                      
                      <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-slate-400 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50 relative z-10">
                         <span className="flex items-center gap-2"><PlayCircle className="w-5 h-5 text-primary" /> {trilha.cursos} Cursos</span>
                         <span className="flex items-center gap-2"><LayoutGrid className="w-5 h-5 text-secondary" /> {trilha.alunos} Alunos</span>
                      </div>

                      <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                         <LibraryBig className="w-48 h-48" />
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* CATÁLOGO DE CURSOS */}
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-sm mt-12 overflow-hidden">
             <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row gap-6 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight flex items-center gap-3">
                   <LayoutGrid className="w-6 h-6 text-primary" /> Catálogo de Cursos Individuais
                </h2>
                <div className="relative w-full lg:w-96">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                   <input 
                      type="text" 
                      placeholder="Pesquisar por nome ou ID..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                   />
                </div>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                   <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-slate-400">
                      <tr>
                         <th className="px-8 py-6 font-black uppercase tracking-widest text-[9px]">Código ID</th>
                         <th className="px-8 py-6 font-black uppercase tracking-widest text-[9px]">Curso / Status</th>
                         <th className="px-8 py-6 font-black uppercase tracking-widest text-[9px]">Estrutura</th>
                         <th className="px-8 py-6 font-black uppercase tracking-widest text-[9px]">Carga Horária</th>
                         <th className="px-8 py-6 font-black uppercase tracking-widest text-[9px] text-right">Controles</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 dark:divide-slate-800/30">
                      {filteredCursos.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-all group">
                           <td className="px-8 py-6 font-mono text-slate-300 text-[10px]">#{c.id.slice(0, 8)}</td>
                           <td className="px-8 py-6">
                              <div className="flex flex-col gap-1.5">
                                 <span className="font-black text-slate-900 dark:text-white text-lg group-hover:text-primary transition-all cursor-pointer">{c.nome}</span>
                                 <span className={`inline-block w-max px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] ${
                                    c.ativo ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'
                                 }`}>
                                    {c.status}
                                 </span>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-slate-600 dark:text-slate-400 font-bold">
                              {c.modulos} Módulos Pedagógicos
                           </td>
                           <td className="px-8 py-6">
                              <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black rounded-xl text-xs tracking-tighter border border-slate-200 dark:border-slate-800">
                                 {c.carga}
                              </span>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-3">
                                 <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-700 transition-all">
                                    Editar
                                 </button>
                                 <button 
                                    onClick={() => handleArquivarCurso(c.id, c.ativo)}
                                    className={`p-3 rounded-2xl transition-all shadow-sm ${c.ativo ? 'text-slate-300 hover:text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`} 
                                    title={c.ativo ? "Arquivar Curso" : "Ativar/Restaurar"}
                                 >
                                    {c.ativo ? <Archive className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                                 </button>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </>
      )}

      {/* Modal Nova Trilha */}
      {isTrilhaModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white dark:bg-[#0F172A] w-full max-w-xl rounded-[3rem] shadow-2xl p-10 border border-slate-200 dark:border-slate-800 relative">
              <button onClick={() => setIsTrilhaModalOpen(false)} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-white transition-colors">
                <X className="w-8 h-8" />
              </button>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">Nova Trilha Formativa</h2>
              <form onSubmit={handleCreateTrilha} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Título da Trilha</label>
                    <input required value={newTrilha.titulo} onChange={e => setNewTrilha({...newTrilha, titulo: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none font-bold shadow-sm" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Descrição Breve</label>
                    <textarea rows={3} value={newTrilha.descricao} onChange={e => setNewTrilha({...newTrilha, descricao: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none font-bold shadow-sm" />
                 </div>
                 <button disabled={saving} type="submit" className="w-full py-5 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all uppercase tracking-widest text-sm">
                    {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : "Criar Trilha Oficial"}
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* Modal Novo Curso */}
      {isCursoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white dark:bg-[#0F172A] w-full max-w-xl rounded-[3rem] shadow-2xl p-10 border border-slate-200 dark:border-slate-800 relative">
              <button onClick={() => setIsCursoModalOpen(false)} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-white transition-colors">
                <X className="w-8 h-8" />
              </button>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">Novo Curso Matriz</h2>
              <form onSubmit={handleCreateCurso} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Vincular à Trilha</label>
                    <select required value={newCurso.trilha_id} onChange={e => setNewCurso({...newCurso, trilha_id: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none font-black shadow-sm appearance-none">
                       <option value="">Selecione uma Trilha...</option>
                       {trilhas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Título do Curso</label>
                    <input required value={newCurso.titulo} onChange={e => setNewCurso({...newCurso, titulo: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none font-bold shadow-sm" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Carga Horária (Horas)</label>
                    <input type="number" required value={newCurso.carga_horaria_horas} onChange={e => setNewCurso({...newCurso, carga_horaria_horas: parseInt(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none font-bold shadow-sm" />
                 </div>
                 <button disabled={saving} type="submit" className="w-full py-5 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all uppercase tracking-widest text-sm">
                    {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : "Publicar Curso"}
                 </button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}

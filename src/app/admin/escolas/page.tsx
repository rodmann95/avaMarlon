"use client";

import { Search, Plus, School, Users, Activity, MoreVertical, Edit2, Trash2, Loader2, X, CheckCircle2, Globe, MapPin } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";

export default function GestaoEscolasPage() {
  const supabase = createClient();
  const [escolas, setEscolas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEscolaId, setCurrentEscolaId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newEscola, setNewEscola] = useState({ nome: '', zona: 'Urbana', ativa: true });

  useEffect(() => {
    fetchEscolas();
  }, []);

  async function fetchEscolas() {
    setLoading(true);
    // Busca escolas com contagem de cursistas vinculados (Real)
    const { data, error } = await supabase
      .from('escolas')
      .select(`
        id, nome, zona, ativa,
        user_escola:user_escola(count)
      `)
      .order('nome');

    if (data) {
      setEscolas(data.map(e => ({
        ...e,
        cursistas: e.user_escola?.[0]?.count || 0,
        engajamento: Math.floor(Math.random() * 40) + 60 // Mock de engajamento (V3: basear em horas cursadas)
      })));
    }
    setLoading(false);
  }

  const handleOpenCreate = () => {
    setNewEscola({ nome: '', zona: 'Urbana', ativa: true });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (escola: any) => {
    setNewEscola({ nome: escola.nome, zona: escola.zona, ativa: escola.ativa });
    setCurrentEscolaId(escola.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSaveEscola = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    if (isEditing && currentEscolaId) {
      const { error } = await supabase
        .from('escolas')
        .update(newEscola)
        .eq('id', currentEscolaId);
      
      if (!error) {
        setIsModalOpen(false);
        fetchEscolas();
      } else {
        alert("Erro ao atualizar escola: " + error.message);
      }
    } else {
      const { error } = await supabase
        .from('escolas')
        .insert([newEscola]);
      
      if (!error) {
        setIsModalOpen(false);
        fetchEscolas();
      } else {
        alert("Erro ao cadastrar escola: " + error.message);
      }
    }
    setSaving(false);
  };

  const filteredEscolas = useMemo(() => {
    return escolas.filter(e => 
      e.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [escolas, searchTerm]);

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
           <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <School className="w-8 h-8" />
           </div>
           <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">Rede de Escolas (Polos)</h1>
              <p className="text-slate-500 font-bold text-sm">Unidades de lotação oficial da SEMED Colombo.</p>
           </div>
        </div>

        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest"
        >
          <Plus className="w-5 h-5" /> Cadastrar Nova Unidade
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white dark:bg-[#0F172A] p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative">
           <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
           <input 
              type="text" 
              placeholder="Pesquisar por nome da escola ou zona..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-sm font-black focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
           />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
           <Loader2 className="w-12 h-12 animate-spin mb-6 text-primary" />
           <p className="font-black uppercase tracking-widest text-[10px]">Mapeando unidades escolares...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEscolas.map((escola) => (
            <div key={escola.id} className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 shadow-sm hover:shadow-2xl transition-all border-b-8 border-b-primary group">
              <div className="flex justify-between items-start mb-6">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                       <MapPin className="w-5 h-5 text-slate-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{escola.zona}</span>
                 </div>
                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenEdit(escola)} className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"><Edit2 className="w-4.5 h-4.5" /></button>
                 </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white capitalize mb-8 line-clamp-2 min-h-[4rem] group-hover:text-primary transition-colors">{escola.nome}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                       <Users className="w-3.5 h-3.5" /> Alunos
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">{escola.cursistas}</div>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest mb-1">
                       <Activity className="w-3.5 h-3.5" /> Engajamento
                    </div>
                    <div className="text-2xl font-black text-primary">{escola.engajamento}%</div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CADASTRAR / EDITAR ESCOLA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
           <div className="bg-white dark:bg-[#0F172A] w-full max-w-xl rounded-[3rem] shadow-2xl p-12 border border-slate-200 dark:border-slate-800 relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 p-2 text-slate-400 hover:text-white transition-colors">
                 <X className="w-8 h-8" />
              </button>
              
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <School className="w-7 h-7" />
                 </div>
                 <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{isEditing ? "Editar Unidade" : "Nova Unidade"}</h2>
              </div>

              <form onSubmit={handleSaveEscola} className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome Oficial da Escola</label>
                    <input 
                      required 
                      value={newEscola.nome} 
                      onChange={e => setNewEscola({...newEscola, nome: e.target.value})} 
                      placeholder="Ex: Escola Municipal Monteiro Lobato"
                      className="w-full px-7 py-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] focus:ring-2 focus:ring-primary outline-none font-bold shadow-sm" 
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Zona / Localização</label>
                    <div className="grid grid-cols-2 gap-4">
                       {['Urbana', 'Rural'].map(z => (
                          <button 
                             key={z}
                             type="button"
                             onClick={() => setNewEscola({...newEscola, zona: z})}
                             className={`py-4 rounded-2xl font-black uppercase tracking-widest text-xs border-2 transition-all ${newEscola.zona === z ? 'bg-primary border-primary text-white shadow-lg' : 'bg-transparent border-slate-100 dark:border-slate-800 text-slate-400'}`}
                          >
                             {z}
                          </button>
                       ))}
                    </div>
                 </div>

                 <button 
                   disabled={saving} 
                   type="submit" 
                   className="w-full py-6 bg-primary text-white rounded-3xl font-black shadow-2xl shadow-primary/30 hover:scale-[1.03] active:scale-95 transition-all text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 mt-4"
                 >
                    {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <>{isEditing ? "Salvar Alterações" : "Efetivar Cadastro"} <CheckCircle2 className="w-6 h-6" /></>}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

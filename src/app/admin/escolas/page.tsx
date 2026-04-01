"use client";

import { useState, useEffect } from "react";
import { Building2, Search, Plus, MapPin, TrendingUp, Users, Loader2, Trash2, Edit2, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function GestaoEscolasPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [escolas, setEscolas] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEscola, setNewEscola] = useState({ nome: '', endereco: '', zona: 'Urbana' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEscolas();
  }, []);

  async function fetchEscolas() {
    setLoading(true);
    // Busca escolas e conta cursistas via join (contagem aproximada via logic de app se deep join for complexo)
    const { data, error } = await supabase
      .from('escolas')
      .select(`
        *,
        user_escola:user_escola (count)
      `)
      .order('nome');

    if (!error && data) {
      setEscolas(data.map(e => ({
        ...e,
        cursistas: e.user_escola?.[0]?.count || 0,
        conclusoes: '75%' // Mock de engajamento por enquanto
      })));
    }
    setLoading(false);
  }

  const handleAddEscola = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase
      .from('escolas')
      .insert([newEscola]);

    if (!error) {
      setIsModalOpen(false);
      setNewEscola({ nome: '', endereco: '', zona: 'Urbana' });
      fetchEscolas();
    } else {
      alert("Erro ao salvar unidade: " + error.message);
    }
    setSaving(false);
  };

  const handleDeleteEscola = async (id: string, cursistas: number) => {
    if (cursistas > 0) {
      alert("Não é possível excluir uma unidade que possui cursistas vinculados. Transfira os usuários primeiro.");
      return;
    }
    
    if (confirm("Deseja realmente remover esta unidade do sistema?")) {
      const { error } = await supabase.from('escolas').delete().eq('id', id);
      if (!error) fetchEscolas();
    }
  };

  const filteredEscolas = escolas.filter(e => 
    e.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.endereco.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-[1400px] mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Rede de Lotação (Escolas)</h1>
           <p className="text-slate-500 text-sm mt-1">Gerenciamento oficial das unidades de ensino vinculadas à SEMED.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105"
        >
           <Plus className="w-5 h-5" /> Nova Unidade
        </button>
      </div>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Filtrar por nome ou endereço..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
           <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
           <p className="font-bold uppercase tracking-widest text-xs">Sincronizando Rede Municipal...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredEscolas.map((esc) => (
              <div key={esc.id} className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[2rem] p-7 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden">
                 
                 <div className="flex justify-between items-start mb-5">
                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-slate-100 dark:border-slate-800">
                       <Building2 className="w-7 h-7" />
                    </div>
                    <div className="flex items-center gap-2">
                       <button className="p-2 text-slate-300 hover:text-slate-600 dark:hover:text-white transition-colors"><Edit2 className="w-4 h-4"/></button>
                       <button 
                         onClick={() => handleDeleteEscola(esc.id, esc.cursistas)}
                         className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4"/>
                       </button>
                    </div>
                 </div>
                 
                 <div className="absolute top-7 right-16">
                    <span className={`px-2.5 py-1 font-black uppercase tracking-widest text-[9px] rounded-lg border 
                       ${esc.zona === 'Rural' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                       Zona {esc.zona}
                    </span>
                 </div>

                 <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">{esc.nome}</h3>
                 <p className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                    <MapPin className="flex-shrink-0 w-4 h-4 text-slate-300" /> {esc.endereco || 'Endereço não cadastrado'}
                 </p>

                 <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50 flex items-end justify-between">
                    <div>
                       <span className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-1">Impacto</span>
                       <div className="flex items-center gap-1.5 text-secondary font-black text-2xl">
                          <TrendingUp className="w-5 h-5" /> {esc.conclusoes}
                       </div>
                    </div>
                    <div className="text-right">
                       <span className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-1">Cursistas</span>
                       <div className="flex items-center gap-2 justify-end text-slate-900 dark:text-white font-black text-2xl">
                          <Users className="w-5 h-5 text-slate-300" /> {esc.cursistas}
                       </div>
                    </div>
                 </div>
              </div>
           ))}
           
           {filteredEscolas.length === 0 && (
             <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem]">
               <Building2 className="w-12 h-12 mx-auto mb-4 opacity-10" />
               <p className="text-slate-400 font-bold">Nenhuma unidade encontrada.</p>
             </div>
           )}
        </div>
      )}

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white dark:bg-[#0F172A] w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800 relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8">
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                   <Plus className="w-6 h-6 text-primary" /> Nova Unidade
                 </h2>
                 <p className="text-slate-500 text-sm mt-1">Registre uma nova escola ou polo de lotação na rede.</p>
              </div>

              <form onSubmit={handleAddEscola} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome da Unidade</label>
                    <input 
                       required
                       value={newEscola.nome}
                       onChange={e => setNewEscola({...newEscola, nome: e.target.value})}
                       placeholder="Ex: EM Gabriel de Lara"
                       className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none font-bold"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Localização (Endereço)</label>
                    <input 
                       required
                       value={newEscola.endereco}
                       onChange={e => setNewEscola({...newEscola, endereco: e.target.value})}
                       placeholder="Rua, Número - Bairro"
                       className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none font-bold"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Zona de Localização</label>
                    <select 
                       value={newEscola.zona}
                       onChange={e => setNewEscola({...newEscola, zona: e.target.value})}
                       className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none font-black"
                    >
                       <option value="Urbana">Urbana</option>
                       <option value="Rural">Rural</option>
                    </select>
                 </div>

                 <button 
                    type="submit"
                    disabled={saving}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2 transition-all"
                 >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Gravar Unidade Policial"}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

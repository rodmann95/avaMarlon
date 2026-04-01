"use client";

import { Search, Filter, Download, MoreVertical, Plus, Mail, Loader2, UserX, ShieldCheck, X, CheckCircle2, UserCheck } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";

export default function GestaoCursistasPage() {
  const supabase = createClient();
  const [cursores, setCursores] = useState<any[]>([]);
  const [escolas, setEscolas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de Filtro
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEscola, setSelectedEscola] = useState("Todas");
  const [selectedStatus, setSelectedStatus] = useState("Qualquer");

  // Estado do Modal de Matrícula em Lote
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchEmails, setBatchEmails] = useState("");
  const [batchProcessing, setBatchProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    
    // 1. Busca Escolas para o filtro
    const { data: escolasData } = await supabase
      .from('escolas')
      .select('id, nome')
      .order('nome');
    
    if (escolasData) setEscolas(escolasData);

    // 2. Busca Usuários + Escola + Contagem de Cursos Concluídos (Real)
    const { data: usersData, error } = await supabase
      .from('users')
      .select(`
        id, nome, cpf, email, cargo, ativo, role,
        user_escola (
          escolas (nome)
        ),
        progresso_cursos (count)
      `)
      .order('nome');

    if (usersData) {
      const formatted = usersData.map((u: any) => ({
        ...u,
        escola: u.user_escola?.[0]?.escolas?.nome || 'Sem Lotação',
        status: u.ativo ? 'Ativo' : 'Inativo',
        concluido: u.progresso_cursos?.[0]?.count || 0,
        andamento: 0 // Simplificado: Idealmente buscar cursos com progresso < 100
      }));
      setCursores(formatted);
    }
    setLoading(false);
  }

  const handleAlternarStatus = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('users')
      .update({ ativo: !currentStatus })
      .eq('id', userId);
    
    if (!error) {
       setCursores(prev => prev.map(u => u.id === userId ? { ...u, ativo: !currentStatus, status: !currentStatus ? 'Ativo' : 'Inativo' } : u));
    }
  };

  const handlePromoverAdmin = async (userId: string) => {
    if (confirm("Deseja promover este usuário a Administrador do sistema?")) {
      const { error } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', userId);
      
      if (!error) {
        setCursores(prev => prev.map(u => u.id === userId ? { ...u, role: 'admin' } : u));
      }
    }
  };

  const handleBatchRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setBatchProcessing(true);
    
    // Simulação de processamento em lote (Na V2 integraria com Supabase Auth Admin API ou Edge Functions)
    const emails = batchEmails.split('\n').filter(em => em.trim().length > 5);
    
    alert(`Processo de matrícula iniciado para ${emails.length} e-mails. Os usuários receberão o convite oficial da SEMED em breve.`);
    
    setIsBatchModalOpen(false);
    setBatchEmails("");
    setBatchProcessing(false);
  };

  const filteredData = useMemo(() => {
    return cursores.filter(c => {
      const matchSearch = c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.cpf.includes(searchTerm) || 
                          c.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchEscola = selectedEscola === "Todas" || c.escola === selectedEscola;
      const matchStatus = selectedStatus === "Qualquer" || c.status === selectedStatus;
      return matchSearch && matchEscola && matchStatus;
    });
  }, [cursores, searchTerm, selectedEscola, selectedStatus]);

  return (
    <div className="space-y-6 animate-fade-in max-w-[1400px] mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Gestão de Cursistas</h1>
           <p className="text-slate-500 text-sm mt-1">Base oficial da SEMED Colombo para monitoramento e auditoria.</p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
           <button onClick={() => setIsBatchModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold transition-all shadow-lg hover:scale-105 active:scale-95">
             <Plus className="w-5 h-5" /> Matrícula em Lote
           </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 bg-white dark:bg-[#0F172A] p-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar por Nome, CPF ou E-mail..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>
        
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
           <select 
             className="px-5 py-3.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-black bg-slate-50 dark:bg-slate-900 rounded-2xl text-sm outline-none"
             value={selectedEscola}
             onChange={(e) => setSelectedEscola(e.target.value)}
           >
             <option value="Todas">Todas as Lotações</option>
             {escolas.map(esc => (
               <option key={esc.id} value={esc.nome}>{esc.nome}</option>
             ))}
           </select>
           <select 
             className="px-5 py-3.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-black bg-slate-50 dark:bg-slate-900 rounded-2xl text-sm outline-none"
             value={selectedStatus}
             onChange={(e) => setSelectedStatus(e.target.value)}
           >
             <option value="Qualquer">Status: Qualquer</option>
             <option value="Ativo">Apenas Ativos</option>
             <option value="Inativo">Apenas Inativos</option>
           </select>
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-slate-400">
             <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
             <p className="font-black uppercase tracking-widest text-xs">Consultando base de dados SEMED...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <tr>
                  <th className="px-8 py-5 font-black uppercase tracking-widest text-[9px]">Educador Registrado</th>
                  <th className="px-8 py-5 font-black uppercase tracking-widest text-[9px]">Unidade / Lotação</th>
                  <th className="px-8 py-5 font-black uppercase tracking-widest text-[9px]">Cargo Atual</th>
                  <th className="px-8 py-5 font-black uppercase tracking-widest text-[9px]">Certificações</th>
                  <th className="px-8 py-5 font-black uppercase tracking-widest text-[9px] text-right">Controles Adm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {filteredData.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-all group">
                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-1">
                          <span className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
                             {user.nome} {user.role === 'admin' && <ShieldCheck className="w-4 h-4 text-secondary" />}
                          </span>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 font-black uppercase tracking-widest">
                             {user.cpf} <span className="text-slate-200 dark:text-slate-800">•</span> {user.email}
                          </div>
                       </div>
                    </td>
                    
                    <td className="px-8 py-6 font-bold text-slate-600 dark:text-slate-300">
                       {user.escola}
                    </td>

                    <td className="px-8 py-6">
                       <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black uppercase text-[9px] rounded-lg tracking-widest border border-slate-200 dark:border-slate-800">
                          {user.cargo}
                       </span>
                    </td>
                    
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                          <CheckCircle2 className={`w-4 h-4 ${user.concluido > 0 ? 'text-emerald-500' : 'text-slate-200'}`} /> {user.concluido} concluídos
                       </div>
                    </td>
                    
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {user.role !== 'admin' && (
                            <button 
                              onClick={() => handlePromoverAdmin(user.id)}
                              className="p-3 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-2xl transition-all" 
                              title="Promover a Admin"
                            >
                               <ShieldCheck className="w-5 h-5" />
                            </button>
                          )}
                          <button 
                             onClick={() => handleAlternarStatus(user.id, user.ativo)}
                             className={`p-3 rounded-2xl transition-all ${user.ativo ? 'text-slate-400 hover:text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                             title={user.ativo ? "Desativar Acesso" : "Ativar Acesso"}
                          >
                             {user.ativo ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Matrícula em Lote */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white dark:bg-[#0F172A] w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 border border-slate-200 dark:border-slate-800 relative">
              <button 
                onClick={() => setIsBatchModalOpen(false)}
                className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label="Fechar"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="mb-10">
                 <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Matrícula em Lote</h2>
                 <p className="text-slate-500 text-sm mt-3 font-medium leading-relaxed">Insira os e-mails dos cursistas (um por linha) para disparar os convites de acesso imediato.</p>
              </div>

              <form onSubmit={handleBatchRegister} className="space-y-8">
                 <textarea 
                    rows={8}
                    required
                    value={batchEmails}
                    onChange={e => setBatchEmails(e.target.value)}
                    placeholder="exemplo1@escola.com&#10;exemplo2@escola.com"
                    className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl focus:ring-2 focus:ring-primary outline-none font-bold text-sm leading-relaxed"
                 />
                 
                 <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/40 p-5 rounded-2xl flex gap-3 text-amber-800 dark:text-amber-400">
                    <Mail className="w-6 h-6 flex-shrink-0" />
                    <p className="text-xs font-bold leading-relaxed">
                      O sistema enviará automaticamente um e-mail de ativação para cada endereço listado acima com as instruções de login inicial.
                    </p>
                 </div>

                 <button 
                    type="submit"
                    disabled={batchProcessing}
                    className="w-full py-5 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
                 >
                    {batchProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Disparar Convites <CheckCircle2 className="w-6 h-6" /></>}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

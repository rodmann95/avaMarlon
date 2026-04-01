"use client";

import { Search, Filter, Download, MoreVertical, Plus, Mail, Loader2, UserX, ShieldCheck } from "lucide-react";
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

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // Busca Escolas para o filtro
      const { data: escolasData } = await supabase
        .from('escolas')
        .select('id, nome')
        .order('nome');
      
      if (escolasData) setEscolas(escolasData);

      // Busca Usuários + Escola via user_escola
      const { data: usersData, error } = await supabase
        .from('users')
        .select(`
          id, nome, cpf, email, cargo, ativo, role,
          user_escola (
            escolas (nome)
          )
        `)
        .order('nome');

      if (usersData) {
        // Formata os dados para o padrão da tabela
        const formatted = usersData.map((u: any) => ({
          ...u,
          escola: u.user_escola?.[0]?.escolas?.nome || 'Sem Lotação',
          status: u.ativo ? 'Ativo' : 'Inativo',
          // Mocks temporários de progresso até termos as queries de agregação
          andamento: 0, 
          concluido: 0
        }));
        setCursores(formatted);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  // Lógica de Filtragem Local (Melhor performance para listas médias)
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

  const exportarCSV = () => {
    const cabecalho = "NOME,CPF,EMAIL,ESCOLA,CARGO,STATUS\n";
    const linhas = filteredData.map(c => 
      `"${c.nome}","${c.cpf}","${c.email}","${c.escola}","${c.cargo}","${c.status}"`
    ).join("\n");
    
    const blob = new Blob([cabecalho + linhas], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `SEMED_Cursistas_Export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePromoverAdmin = async (userId: string) => {
    const { error } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('id', userId);
    
    if (!error) {
      alert("Usuário promovido a administrador!");
      // Recarregar dados ou atualizar localmente
      setCursores(prev => prev.map(u => u.id === userId ? { ...u, role: 'admin' } : u));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-[1400px] mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Gestão de Cursistas</h1>
           <p className="text-slate-500 text-sm mt-1">Base oficial da SEMED Colombo para monitoramento e auditoria.</p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
           <button onClick={exportarCSV} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold transition-all shadow-sm">
             <Download className="w-4 h-4" /> Exportar Planilha
           </button>
           <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold transition-all shadow-md">
             <Plus className="w-4 h-4" /> Matrícula em Lote
           </button>
        </div>
      </div>

      {/* Painel de Filtros Avançados */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 bg-white dark:bg-[#0F172A] p-5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar por Nome, CPF ou E-mail..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
          />
        </div>
        
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
           <select 
             className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold bg-slate-50 dark:bg-slate-900 rounded-xl text-sm outline-none"
             value={selectedEscola}
             onChange={(e) => setSelectedEscola(e.target.value)}
           >
             <option value="Todas">Todas as Lotações</option>
             {escolas.map(esc => (
               <option key={esc.id} value={esc.nome}>{esc.nome}</option>
             ))}
           </select>
           <select 
             className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold bg-slate-50 dark:bg-slate-900 rounded-xl text-sm outline-none"
             value={selectedStatus}
             onChange={(e) => setSelectedStatus(e.target.value)}
           >
             <option value="Qualquer">Qualquer Status</option>
             <option value="Ativo">Ativos</option>
             <option value="Inativo">Inativos</option>
           </select>
        </div>
      </div>

      {/* Tabela de Dados Oficiais */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[1.5rem] overflow-hidden shadow-sm min-h-[400px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
             <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
             <p className="font-bold">Consultando base de dados SEMED...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-5 font-bold uppercase tracking-wider text-[11px]">Educador Registrado</th>
                  <th className="px-6 py-5 font-bold uppercase tracking-wider text-[11px]">Lotação / Escola</th>
                  <th className="px-6 py-5 font-bold uppercase tracking-wider text-[11px]">Cargo</th>
                  <th className="px-6 py-5 font-bold uppercase tracking-wider text-[11px]">Status / Perfil</th>
                  <th className="px-6 py-5 font-bold uppercase tracking-wider text-[11px] text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                       Nenhum cursista encontrado com os filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors group">
                      <td className="px-6 py-4">
                         <div className="flex flex-col">
                            <span className="font-bold text-slate-900 dark:text-white text-base">
                               {user.nome}
                            </span>
                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-mono">
                               {user.cpf} <span className="text-slate-300 dark:text-slate-700">|</span> <Mail className="w-3.5 h-3.5" /> {user.email}
                            </div>
                         </div>
                      </td>
                      
                      <td className="px-6 py-4">
                         <span className="font-bold text-slate-700 dark:text-slate-300">
                            {user.escola}
                         </span>
                      </td>

                      <td className="px-6 py-4">
                         <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-bold uppercase tracking-wider w-max border border-slate-200 dark:border-slate-700">
                            {user.cargo}
                         </span>
                      </td>
                      
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           {user.status === 'Ativo' ? (
                              <span className="flex items-center gap-1.5 text-green-600 dark:text-green-500 font-bold"><span className="w-2 h-2 rounded-full bg-green-500"></span> Ativo</span>
                           ) : (
                              <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 font-bold"><span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span> Inativo</span>
                           )}
                           <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                             {user.role}
                           </span>
                         </div>
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-2 text-sm font-semibold">
                            {user.role !== 'admin' && (
                              <button 
                                onClick={() => handlePromoverAdmin(user.id)}
                                className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-lg transition-colors" 
                                title="Promover a Admin"
                              >
                                 <ShieldCheck className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors" title="Desativar Conta">
                               <UserX className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                               <MoreVertical className="w-4 h-4" />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

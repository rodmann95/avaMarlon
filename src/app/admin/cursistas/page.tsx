"use client";

import { Search, Filter, Download, MoreVertical, Plus, Mail } from "lucide-react";
import { useState } from "react";

export default function GestaoCursistasPage() {
  const [cursores, setCursores] = useState([
    { id: '1', nome: 'Gabrielle Silva', cpf: '010.***.***-10', email: 'gabrielle@edu.br', escola: 'Sede SEMED', cargo: 'Coordenadora', andamento: 2, concluido: 4, status: 'Ativo' },
    { id: '2', nome: 'Eduardo Pereira', cpf: '080.***.***-60', email: 'eduardo@escola.br', escola: 'EM Gabriel de Lara', cargo: 'Professor(a)', andamento: 1, concluido: 10, status: 'Ativo' },
    { id: '3', nome: 'Marlon Teste', cpf: '090.***.***-99', email: 'marlon@teste.br', escola: 'CMEI Cantinho', cargo: 'Professor(a)', andamento: 0, concluido: 0, status: 'Inativo' },
  ]);

  const exportarCSV = () => {
    // Transforma a lista numa string formatada CSV padrão (campos delimitados por vírgula)
    const cabecalho = "NOME,CPF,EMAIL,ESCOLA,CARGO,CURSOS_EM_ANDAMENTO,CURSOS_CONCLUIDOS,STATUS\n";
    const linhas = cursores.map(c => 
      `"${c.nome}","${c.cpf}","${c.email}","${c.escola}","${c.cargo}",${c.andamento},${c.concluido},"${c.status}"`
    ).join("\n");
    
    // Processo de ancoragem e download via Blob (Forma mais nativa de entregar arquivo ao S.O)
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

  return (
    <div className="space-y-6 animate-fade-in max-w-[1400px] mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-black text-slate-900 dark:text-white">Base Nacional de Cursistas</h1>
           <p className="text-slate-500 text-sm mt-1">Gestão, alteração de senhas e matrículas em lote.</p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
           <button onClick={exportarCSV} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#0F172A] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold transition-all shadow-sm">
             <Download className="w-4 h-4" /> Exportar Planilha
           </button>
           <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold transition-all shadow-md">
             <Plus className="w-4 h-4" /> Nova Matrícula Lote (CSV)
           </button>
        </div>
      </div>

      {/* Painel de Filtros Avançados */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 bg-white dark:bg-[#0F172A] p-5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar por CPF, Matrícula ou E-mail..." 
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
          />
        </div>
        
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
           <select className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold bg-slate-50 dark:bg-slate-900 rounded-xl text-sm outline-none">
             <option>Todas as Escolas</option>
             <option>Sede SEMED</option>
           </select>
           <select className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold bg-slate-50 dark:bg-slate-900 rounded-xl text-sm outline-none">
             <option>Qualquer Status</option>
             <option>Apenas Ativos</option>
             <option>Suspensos / Inativos</option>
           </select>
           <button className="flex items-center justify-center w-12 h-12 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
              <Filter className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Tabela de Dados Oficiais */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[1.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-[11px] w-6">ID</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-[11px]">Educador Registrado</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-[11px]">Lotação / Cargo</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-[11px]">Progressão Turmas</th>
                <th className="px-6 py-5 font-bold uppercase tracking-wider text-[11px] text-right">Ações Logadas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {cursores.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-4 font-mono text-slate-400 text-xs">#{user.id}</td>
                  
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
                     <div className="flex flex-col">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                           {user.escola}
                        </span>
                        <span className="inline-block mt-1 px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-bold uppercase tracking-wider w-max border border-slate-200 dark:border-slate-700">
                           {user.cargo}
                        </span>
                     </div>
                  </td>
                  
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-1.5 min-w-[140px]">
                        <div className="flex items-center justify-between text-xs font-bold font-mono">
                           <span className="text-slate-500">Andamento</span>
                           <span className="text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 rounded-md">{user.andamento}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold font-mono">
                           <span className="text-slate-500">Concluídos</span>
                           <span className="text-green-600 bg-green-50 dark:bg-green-900/20 px-2 rounded-md border border-green-200 dark:border-green-800 flex items-center gap-1">
                             {user.concluido} 
                           </span>
                        </div>
                     </div>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end gap-3 text-sm font-semibold">
                        {user.status === 'Ativo' ? (
                           <span className="flex items-center gap-1.5 text-green-600 dark:text-green-500"><span className="w-2 h-2 rounded-full bg-green-500"></span> Ativo</span>
                        ) : (
                           <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500"><span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span> Inativo</span>
                        )}
                        <span className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1"></span>
                        <button className="text-primary hover:text-primary/70 transition-colors">Perfil Cursista</button>
                        <button className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                           <MoreVertical className="w-4 h-4" />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

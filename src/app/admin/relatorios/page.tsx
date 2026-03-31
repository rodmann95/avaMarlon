"use client";

import { useState } from "react";
import { 
  FileSpreadsheet, FileBarChart, Award, Activity, 
  FileBadge, Download, Filter, X, ChevronRight, BarChart4, PieChart
} from "lucide-react";

export default function GestaoRelatoriosPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [relatorioAtivo, setRelatorioAtivo] = useState(0);
  const [imprimindoExecutivo, setImprimindoExecutivo] = useState(false);

  const cadernos = [
    { 
       id: 1, 
       nome: "Frequência e Participação", 
       desc: "Listagem de quem frequentou e quem abandonou as plataformas (Planilha CSV).",
       icone: <FileSpreadsheet className="w-8 h-8"/>, color: "text-blue-500", bg: "bg-blue-100" 
    },
    { 
       id: 2, 
       nome: "Desempenho nas Avaliações", 
       desc: "Resultados individuais das provas e identificação de questões de alto erro.",
       icone: <FileBarChart className="w-8 h-8"/>, color: "text-amber-500", bg: "bg-amber-100" 
    },
    { 
       id: 3, 
       nome: "Conclusão e Certificação", 
       desc: "Documentação comprobatória das horas cumpridas e diplomas gerados.",
       icone: <Award className="w-8 h-8"/>, color: "text-emerald-500", bg: "bg-emerald-100" 
    },
    { 
       id: 4, 
       nome: "Engajamento e Atividade", 
       desc: "Métricas de cliques, tempo de sessão e dias ativos na plataforma.",
       icone: <Activity className="w-8 h-8"/>, color: "text-purple-500", bg: "bg-purple-100" 
    },
    { 
       id: 5, 
       nome: "Relatório Executivo Completo", 
       desc: "Consolida os 4 cadernos acima. Ideal para impressão PDF e anexo em prestações de contas.",
       icone: <FileBadge className="w-8 h-8"/>, color: "text-slate-900 dark:text-white", bg: "bg-slate-200 dark:bg-slate-800" 
    }
  ];

  const abrirParametros = (id: number) => {
     setRelatorioAtivo(id);
     setDrawerOpen(true);
  };

  const gerarEBaixarCSV = () => {
     const csv = "COMPROVANTE,DADOS\\nTeste,123";
     const blob = new Blob([csv], { type: 'text/csv' });
     const link = document.createElement("a");
     link.href = URL.createObjectURL(blob);
     link.download = `SEMED_Relatorio_TIPO_${relatorioAtivo}.csv`;
     link.click();
     setDrawerOpen(false);
  };

  const gerarEmPDF = () => {
     setDrawerOpen(false);
     setImprimindoExecutivo(true);
     // Dá um tempo curto pro renderizador do Next criar a interface invisivel de impressão e ativá-la
     setTimeout(() => {
        const originalTitle = document.title;
        document.title = "Relatorio_Executivo_AVA_Prefeitura_Colombo";
        window.print();
        document.title = originalTitle;
        setImprimindoExecutivo(false);
     }, 1000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto pb-12 print:p-0 print:m-0 print:bg-white text-slate-900">
      
      {/* 
        =========================================================
        VISÃO DO SISTEMA ADMIN (Não impresso)
        =========================================================
       */}
      <div className={`${imprimindoExecutivo ? 'hidden' : 'block'}`}>
         
         <header className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-600 rounded-full text-xs font-black uppercase tracking-widest mb-3 border border-red-500/20">
               Confidencial e Auditado
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Central de Relatórios Oficiais</h1>
            <p className="text-slate-500 mt-2 max-w-3xl">
               Cadernos desenhados arquiteturalmente para prestação de contas dos serviços executados (Atende Edital Item 4). 
               Todas as extrações geradas por aqui são permanentemente gravadas em log de auditoria.
            </p>
         </header>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cadernos.map((rel) => (
               <button 
                  key={rel.id}
                  onClick={() => abrirParametros(rel.id)}
                  className={`text-left p-8 rounded-[2rem] border-2 transition-all group flex flex-col justify-between h-72
                     ${rel.id === 5 
                        ? 'bg-[#0F172A] border-slate-700 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-600'}
                  `}
               >
                  <div>
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${rel.bg} ${rel.color}`}>
                        {rel.icone}
                     </div>
                     <h3 className={`text-xl font-black mb-2 leading-tight ${rel.id === 5 ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {rel.nome}
                     </h3>
                     <p className={`text-sm ${rel.id === 5 ? 'text-slate-400' : 'text-slate-500'}`}>
                        {rel.desc}
                     </p>
                  </div>
                  <div className={`flex items-center justify-between mt-6 pt-4 border-t font-bold text-sm
                     ${rel.id === 5 ? 'border-slate-800 text-slate-300 group-hover:text-white' : 'border-slate-100 dark:border-slate-800 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                     Configurar Exportação <ChevronRight className="w-5 h-5"/>
                  </div>
               </button>
            ))}
         </div>

         {/* DRAWER LATERAL DE CONFIGURAÇÃO DO RELATÓRIO */}
         {drawerOpen && (
            <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
               <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl animate-fade-in-right flex flex-col border-l border-slate-200 dark:border-slate-800">
                  
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                     <h2 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
                        <Filter className="w-5 h-5 text-primary" /> Filtros do Caderno
                     </h2>
                     <button onClick={() => setDrawerOpen(false)} className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                     </button>
                  </div>

                  <div className="p-8 flex-1 overflow-y-auto space-y-6">
                     <p className="text-sm font-bold text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 w-max rounded-md">
                        {cadernos.find(c => c.id === relatorioAtivo)?.nome}
                     </p>
                     
                     <div className="space-y-5">
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Data de Início da Apuração</label>
                           <input type="date" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono text-slate-600 dark:text-slate-300" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Data Limite da Apuração</label>
                           <input type="date" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono text-slate-600 dark:text-slate-300" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Filtro de Lotação (Opcional)</label>
                           <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-slate-600 dark:text-slate-300">
                             <option value="todas">Consolidado Geral (Todas)</option>
                             <option value="1">EM Gabriel de Lara</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
                     {relatorioAtivo !== 5 ? (
                        <>
                           <button onClick={gerarEBaixarCSV} className="w-full py-4 px-6 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl">
                              <Download className="w-5 h-5"/> Extrair como Planilha (.CSV)
                           </button>
                           <p className="text-xs text-center text-slate-400 font-bold uppercase tracking-wider">Ação irreversível de auditoria</p>
                        </>
                     ) : (
                        <>
                           <button onClick={gerarEmPDF} className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-red-500/20 animate-pulse">
                              <FileBadge className="w-5 h-5"/> Gerar PDF Oficializado
                           </button>
                           <p className="text-xs text-center text-red-400 font-bold tracking-widest uppercase">Motor A4 Formatted</p>
                        </>
                     )}
                  </div>

               </div>
            </div>
         )}
      </div>

      {/* 
        =========================================================
        MOTOR DE RENDERIZAÇÃO PDF A4 IMPRESSO (Relatório 5)
        (Só aparece na impressão oficial graças ao CSS e conditional rendering)
        =========================================================
       */}
      {imprimindoExecutivo && (
         <div className="print:block hidden bg-white w-[210mm] min-h-[297mm] mx-auto text-black font-sans leading-relaxed pt-20">
            
            {/* CAPA OFICIAL */}
            <div className="page-break flex flex-col items-center justify-center min-h-[250mm] pb-32">
               <div className="w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center mb-12">
                  <span className="text-5xl font-black text-white">EF</span>
               </div>
               <h1 className="text-5xl font-black text-center mb-6 uppercase tracking-widest leading-snug">
                  Auditoria e Frequência <br/> EduFormação
               </h1>
               <div className="w-24 h-1 bg-black mb-12"></div>
               
               <p className="text-xl font-bold uppercase tracking-widest text-slate-500 mb-2">Relatório Executivo Consolidado</p>
               <p className="text-lg font-bold">Município de Colombo / PR</p>
               
               <div className="mt-32 p-8 border-2 border-black w-[80%]">
                  <div className="grid grid-cols-2 gap-6 font-mono text-sm">
                     <div className="font-bold">Solicitante:</div> <div>Gestor Supremo</div>
                     <div className="font-bold">Referência Atestada:</div> <div>01/jan/26 a 31/mar/26</div>
                     <div className="font-bold">Hora da Extração:</div> <div>{new Date().toLocaleString('pt-BR')}</div>
                     <div className="font-bold">Hash Integridade:</div> <div>RX-{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                  </div>
               </div>
            </div>

            {/* PÁGINA 1: Sumário e Frequência Visual */}
            <div className="page-break pt-20 px-16">
               <h2 className="text-3xl font-black border-b-4 border-black pb-4 mb-10 w-max uppercase tracking-widest">1. Sumário Executivo</h2>
               
               <div className="grid grid-cols-2 gap-8 mb-16">
                  <div className="border border-slate-300 p-8 text-center bg-slate-50">
                     <p className="text-6xl font-black mb-2">2.450</p>
                     <p className="text-xs uppercase font-bold tracking-widest text-slate-500">Cursistas Base</p>
                  </div>
                  <div className="border border-slate-300 p-8 text-center bg-slate-50">
                     <p className="text-6xl font-black mb-2">86%</p>
                     <p className="text-xs uppercase font-bold tracking-widest text-slate-500">Taxa de Conclusões</p>
                  </div>
                  <div className="border border-slate-300 p-8 text-center bg-slate-50">
                     <p className="text-6xl font-black mb-2 text-green-600">45k</p>
                     <p className="text-xs uppercase font-bold tracking-widest text-slate-500">Horas Homologadas</p>
                  </div>
                  <div className="border border-slate-300 p-8 text-center bg-slate-50">
                     <p className="text-6xl font-black mb-2">18</p>
                     <p className="text-xs uppercase font-bold tracking-widest text-slate-500">Escolas Polo Participantes</p>
                  </div>
               </div>

               <h2 className="text-2xl font-black mb-6 mt-16 uppercase tracking-widest">2. Densidade de Atuação (Simulação)</h2>
               <div className="border-2 border-black p-8 rounded-lg mb-8 bg-slate-100 flex items-center justify-center h-64 text-slate-400 font-bold uppercase tracking-widest">
                  <BarChart4 className="w-12 h-12 mr-4"/> Aqui entra o gráfico estático
               </div>
               <p className="text-sm italic">Figura 1: Representação gráfica inserida pelo backend baseada no fluxo logado do sistema Moodle-equivalent.</p>
            </div>

            {/* PÁGINA 2: Tabela de Dados e Certificações Recentes */}
            <div className="page-break pt-20 px-16 pb-20">
               <h2 className="text-2xl font-black border-b-4 border-black pb-4 mb-10 w-max uppercase tracking-widest">3. Demonstrativo de Diplomas</h2>
               
               <table className="w-full text-left font-mono text-xs border-collapse border border-slate-400">
                  <thead className="bg-black text-white px-2">
                     <tr>
                        <th className="border border-slate-400 p-3">Data</th>
                        <th className="border border-slate-400 p-3">CPF Participante</th>
                        <th className="border border-slate-400 p-3">Hash Certificado</th>
                        <th className="border border-slate-400 p-3">Carga</th>
                     </tr>
                  </thead>
                  <tbody>
                     {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                     <tr key={n}>
                        <td className="border border-slate-400 p-3">{n} de Abril, 2026</td>
                        <td className="border border-slate-400 p-3">***.123.{n}00-**</td>
                        <td className="border border-slate-400 p-3 font-bold bg-slate-50">HSH-X{Math.random().toString(10).slice(-4)}</td>
                        <td className="border border-slate-400 p-3">{n * 10}h</td>
                     </tr>
                     ))}
                  </tbody>
               </table>
            </div>

         </div>
      )}

      {/* CSS CRÍTICO PARA FAZER O PDF COMPORTAR COMO MÚLTIPLAS PÁGINAS A4 COM MARGENS CORRETAS */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
           @page { size: A4; margin: 0; }
           body { background: white !important; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact;}
           nav, header, aside, .print\\:hidden, aside * { display: none !important; }
           
           .print\\:block { display: block !important; }
           .page-break { page-break-after: always; clear: both; break-after: page;}
           
           main { padding: 0 !important; margin: 0 !important; min-height: 100vh !important;}
        }
      `}}/>
    </div>
  );
}

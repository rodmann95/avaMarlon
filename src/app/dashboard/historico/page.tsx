"use client";

import { useState } from "react";
import { Clock, Download, FileText, CheckCircle2, Map, BookOpen, Star, ShieldCheck, Filter } from "lucide-react";
import Link from "next/link";

export default function HistoricoPage() {
  const [totalHoras] = useState(120);

  // MOCK DE CURSOS CONCLUÍDOS E EM ANDAMENTO (Integrará com progresso_cursos onde concluido_em é NOT NULL)
  const cronogramaConcluido = [
    {
      id: "c1",
      titulo: "Gestão Escolar Inclusiva",
      trilha: "Gestão Básica",
      carga_horaria: 40,
      data_conclusao: "10 de Março, 2026",
      nota: 95
    },
    {
      id: "c2",
      titulo: "Inovação na Sala de Aula e BNCC",
      trilha: "Práticas Pedagógicas",
      carga_horaria: 80,
      data_conclusao: "15 de Fevereiro, 2026",
      nota: 100
    }
  ];

  const emAndamento = [
    {
      id: "a1",
      titulo: "Comunicação Não Violenta com as Famílias",
      carga_horaria: 20,
      progresso: 45
    }
  ];

  const exportarPDF = () => {
    // Altera o título temporariamente para o PDF sair com nome bonito
    const originalTitle = document.title;
    document.title = "Historico_Formativo_SEMED_Gabrielle";
    window.print();
    document.title = originalTitle;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto print:max-w-none print:p-0 print:m-0">
      
      {/* CABEÇALHO DA PÁGINA (Botão de Exportar só aparece na tela, some na impressão com "print:hidden") */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 print:hidden">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-secondary" /> Histórico Oficial
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
            Seu portfólio de capacitações validadas pela Secretaria Municipal de Educação. 
          </p>
        </div>
        
        <div className="flex gap-3">
           <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" /> Filtros
           </button>
           <button 
             onClick={exportarPDF}
             className="flex items-center justify-center gap-2 px-6 py-2.5 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-bold shadow-md hover:shadow-xl transition-all"
           >
              <Download className="w-5 h-5" /> Exportar PDF
           </button>
        </div>
      </header>

      {/* ÁREA QUE SERÁ IMPRESSA NO PDF */}
      <div className="print:block">

         {/* Cabeçalho exclusivo para o documento PDF (escondido na tela normal) */}
         <div className="hidden print:block text-center border-b-2 border-slate-800 pb-6 mb-8">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-widest">PORTFÓLIO DE CAPACITAÇÃO</h1>
            <h2 className="text-lg font-bold text-slate-600 mt-2">Secretaria Municipal de Educação de Colombo (SEMED)</h2>
            <p className="text-sm mt-4 font-mono">Documento digital gerado em: {new Date().toLocaleDateString('pt-BR')} - Educador(a): Gabrielle Admin</p>
         </div>

         {/* CARD DE TOTALIZADOR */}
         <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-xl text-white mb-12 relative overflow-hidden print:bg-white print:text-black print:border-2 print:border-slate-900 print:shadow-none print:rounded-none">
            <div className="absolute right-0 top-0 p-8 opacity-10 pointer-events-none print:hidden">
               <Star className="w-40 h-40 -mt-10 -mr-10 text-white" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
               <div>
                  <h2 className="text-lg font-bold text-slate-300 print:text-slate-600 mb-2">Volume Total de Extensão</h2>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-black">{totalHoras}</span>
                    <span className="text-xl font-medium text-slate-400">Horas Acumuladas</span>
                  </div>
                  <p className="text-sm mt-3 text-slate-400 print:text-slate-500 max-w-sm">
                    Esse quantitativo reflete **exclusivamente** disciplinas onde a educadora obteve 100% de conclusão do material e notas requeridas.
                  </p>
               </div>
               
               <div className="w-full md:w-auto grid grid-cols-2 gap-4 print:text-slate-900">
                  <div className="bg-white/10 print:bg-slate-100 backdrop-blur-md rounded-2xl p-5 border border-white/10 print:border-slate-300 text-center">
                     <span className="block text-3xl font-black mb-1">{cronogramaConcluido.length}</span>
                     <span className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-slate-600">Cursos Concluídos</span>
                  </div>
                  <div className="bg-white/10 print:bg-slate-100 backdrop-blur-md rounded-2xl p-5 border border-white/10 print:border-slate-300 text-center">
                     <span className="block text-3xl font-black mb-1">0</span>
                     <span className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-slate-600">Faltas Injustificadas</span>
                  </div>
               </div>
            </div>
         </div>

         {/* TIMELINE DE CONCLUSÕES */}
         <div className="mb-12">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white print:text-black mb-8 flex items-center gap-3 border-b pb-4">
              <CheckCircle2 className="w-6 h-6 text-primary print:text-slate-900" /> Cursos Finalizados e Certificados
            </h3>

            <div className="relative border-l-2 border-slate-200 dark:border-slate-800 print:border-slate-300 ml-4 md:ml-6 space-y-10 pb-4">
               
               {cronogramaConcluido.map((curso) => (
                 <div key={curso.id} className="relative pl-8 md:pl-12 group">
                    <div className="absolute w-8 h-8 bg-secondary rounded-full -left-[17px] top-1 border-4 border-slate-50 dark:border-slate-950 print:border-white shadow flex items-center justify-center text-white">
                      <Star className="w-3.5 h-3.5" />
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 print:border-slate-300 print:shadow-none rounded-2xl p-6 shadow-sm group-hover:shadow-md transition-shadow">
                       
                       <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                               <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 print:bg-transparent print:border print:border-slate-400 text-slate-500 font-bold uppercase text-[10px] tracking-wider rounded-md">
                                 {curso.trilha}
                               </span>
                               <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold flex items-center gap-1.5">
                                 <Clock className="w-3.5 h-3.5" /> Concluído em {curso.data_conclusao}
                               </span>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white print:text-black">
                              {curso.titulo}
                            </h4>
                          </div>

                          <div className="bg-primary/10 print:bg-transparent print:border print:border-slate-400 text-primary print:text-black px-4 py-2 rounded-xl text-center flex-shrink-0">
                             <div className="text-2xl font-black">{curso.carga_horaria}h</div>
                             <div className="text-[10px] font-bold uppercase tracking-wider">Homologadas</div>
                          </div>
                       </div>

                       <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 print:border-slate-200">
                          <p className="text-sm font-medium text-green-600 dark:text-green-400 print:text-slate-600 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> Aproveitamento: {curso.nota}%
                          </p>
                          <button className="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-primary transition-colors print:hidden">
                            <FileText className="w-4 h-4" /> Ver Certificado Original
                          </button>
                       </div>

                    </div>
                 </div>
               ))}

               {cronogramaConcluido.length === 0 && (
                 <p className="pl-8 text-slate-500 italic">Nenhum curso finalizado encontrado neste perfil.</p>
               )}
            </div>
         </div>

         {/* CURSOS EM ANDAMENTO (Destaque pro final) */}
         <div className="print:break-inside-avoid">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white print:text-black mb-6 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-slate-400" /> Cursos Atualmente em Andamento
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {emAndamento.map((andamento) => (
                 <div key={andamento.id} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 print:border-slate-300 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <h5 className="font-bold text-slate-800 dark:text-slate-200 print:text-black mb-2 line-clamp-2">
                        {andamento.titulo}
                      </h5>
                      <p className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Carga Total Prevista: {andamento.carga_horaria}h
                      </p>
                    </div>
                    
                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 print:text-slate-600">
                        <span>Fração Concluída</span>
                        <span className="text-primary">{andamento.progresso}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 print:border print:border-slate-300 rounded-full h-2">
                         <div className="bg-primary print:bg-slate-500 h-full rounded-full" style={{ width: `${andamento.progresso}%` }}></div>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

      </div>
    {/* CSS INJETADO PARA DEIXAR A IMPRESSÃO PERFEITA SEM AFETAR A SIDEBAR NO CÓDIGO FONTE BASE */}
    <style dangerouslySetInnerHTML={{__html: `
      @media print {
        body { background: white !important; }
        /* Esconde o menu lateral do /dashboard/layout global na força bruta de CSS durante impressão */
        nav, header, footer, [href="/dashboard"], aside { display: none !important; }
        main { padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
        .print\\:hidden { display: none !important; }
        .print\\:block { display: block !important; }
      }
    `}} />
    </div>
  );
}

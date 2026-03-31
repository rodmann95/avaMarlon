"use client";

import { Printer, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CertificadoDocumentoPage({ params }: { params: { id: string } }) {
  const [curso] = useState({
     titulo: "Educação Especial e Inclusiva - Práticas Pedagógicas",
     carga: 40,
     data_conclusao: "10 de Março de 2026",
     codigo: "EDXC-99KL-MMOP",
     aluno: "Gabrielle Admin",
     cpf: "***.000.***-00"
  });

  const exportarPDF = () => {
    document.title = `Certificado_${curso.codigo}`;
    window.print();
  };

  return (
    <div className="animate-fade-in bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-80px)] p-6">
       
       <div className="max-w-7xl mx-auto flex justify-between items-center mb-6 print:hidden">
         <Link href="/dashboard/certificados" className="flex items-center gap-2 font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar aos Certificados
         </Link>
         <button onClick={exportarPDF} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-xl">
            <Printer className="w-5 h-5"/> Salvar como PDF / Imprimir Documento
         </button>
       </div>

       {/* ÁREA DO CERTIFICADO (Configurada para Paisagem (Landscape) A4) */}
       <div className="max-w-6xl mx-auto bg-white border-[12px] border-slate-900 shadow-2xl relative overflow-hidden print:shadow-none print:border-[12px] print:border-black" style={{ aspectRatio: '1.414/1' }}>
          
          {/* Fundo Decorativo */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-transparent to-transparent pointer-events-none"></div>

          <div className="p-12 md:p-20 absolute inset-0 flex flex-col items-center text-center">
             
             {/* Header do Certificado */}
             <div className="flex justify-between items-start w-full mb-12 border-b-2 border-slate-200 pb-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white font-black text-2xl">
                    EF
                  </div>
                  <div className="text-left font-serif">
                     <h2 className="text-xl font-black text-slate-900 tracking-widest uppercase">EduFormação</h2>
                     <p className="text-sm font-bold text-slate-500 tracking-widest uppercase">Secretaria de Educação</p>
                  </div>
                </div>
                <div className="text-right">
                  <img src="https://colombo.pr.gov.br/wp-content/themes/colombo2020/assets/images/logo.png" alt="Prefeitura" className="h-14 opacity-20 sepia contrast-0" />
                </div>
             </div>

             {/* Corpo (Texto) */}
             <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-serif text-slate-900 mb-12 uppercase tracking-widest" style={{ letterSpacing: '0.2em' }}>
                  Certificado de Conclusão
                </h1>

                <p className="text-xl md:text-2xl text-slate-600 font-serif leading-relaxed text-justify px-8">
                  Certificamos que <strong>{curso.aluno}</strong>, portador(a) do CPF <strong>{curso.cpf}</strong>, 
                  concluiu com aproveitamento e dedicação exemplar o curso de aperfeiçoamento profissional em 
                  <strong className="text-slate-900 text-2xl block my-4 border-b-2 border-slate-100 pb-4 text-center">{curso.titulo}</strong>
                  promovido pela modalidade de Educação à Distância da Rede Municipal de Ensino de Colombo/PR, 
                  com a carga horária homologada de <strong>{curso.carga} Horas</strong> finalizado em {curso.data_conclusao}.
                </p>
             </div>

             {/* Rodapé e Assinaturas */}
             <div className="w-full flex justify-between items-end mt-16 pt-8">
                
                {/* Validação (Esquerda) */}
                <div className="flex bg-slate-50 p-4 rounded-xl items-center gap-4 border border-slate-200">
                  <div className="w-16 h-16 bg-white border border-slate-200 flex items-center justify-center p-1 rounded-lg">
                     {/* Aqui na real teria o componente QRCode(value={`/validar/${curso.codigo}`) */}
                     <span className="text-[8px] font-mono text-center leading-none text-slate-400">QR CODE SIMULADO AQUI</span>
                  </div>
                  <div className="text-left font-mono">
                     <p className="text-[10px] font-bold text-slate-500 uppercase">Validação Pública</p>
                     <p className="text-sm font-black text-slate-800">{curso.codigo}</p>
                     <p className="text-[10px] text-slate-400 mt-1">eduformacao.com.br/validar</p>
                  </div>
                </div>

                {/* Assinatura (Direita) */}
                <div className="text-center w-64">
                   <div className="border-b border-black mb-2 relative">
                      {/* Espaço para assinatura real preenchida pelo gestor */}
                      <span className="font-serif italic text-3xl text-slate-600 absolute bottom-1 left-1/2 -translate-x-1/2 opacity-70">
                         Marlon Assinatura
                      </span>
                   </div>
                   <p className="text-sm font-bold text-slate-800 uppercase">Prefeito / Secretário</p>
                   <p className="text-xs text-slate-500">Colombo, PR</p>
                </div>

             </div>

          </div>
       </div>

       {/* CSS DE IMPRESSÃO - FORÇA MODO PAISAGEM */}
       <style dangerouslySetInnerHTML={{__html:`
         @media print {
            @page {
               size: A4 landscape;
               margin: 0;
            }
            body {
               background: white !important;
            }
            nav, header, footer, aside, .print\\:hidden {
               display: none !important;
            }
         }
       `}}/>
    </div>
  )
}

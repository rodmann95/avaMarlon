import { Award, Download, ShieldCheck, Search, FileSignature } from "lucide-react";
import Link from "next/link";

export default function CertificadosPage() {
  
  // MOCK DATA: Puxando da tabela certificados onde user_id = auth.uid()
  const listagem = [
    {
       id: "1",
       curso_titulo: "Educação Especial e Inclusiva - Práticas Pedagógicas",
       data: "10 de Março, 2026",
       carga: 40,
       codigo: "EDXC-99KL-MMOP",
       valido: true
    },
    {
       id: "2",
       curso_titulo: "Gestão do Tempo e Liderança em Sala de Aula",
       data: "15 de Fevereiro, 2026",
       carga: 20,
       codigo: "ZXYB-LLK1-AWEQ",
       valido: true
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-7xl mx-auto">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Award className="w-10 h-10 text-amber-500" /> Meus Certificados
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
            Acesse e baixe todos os diplomas de conclusão validados criptograficamente pela SEMED.
          </p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-900 rounded-2xl p-2 items-center text-sm font-bold text-slate-600 dark:text-slate-400">
           <span className="px-4 border-r border-slate-300 dark:border-slate-700"><strong className="text-slate-900 dark:text-white">{listagem.length}</strong> Certificados</span>
           <span className="px-4"><strong className="text-slate-900 dark:text-white">60</strong> Horas Totais</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4 pt-6">
        
        {listagem.map((cert) => (
          <div key={cert.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm group hover:shadow-xl transition-all flex flex-col">
            
            {/* Visual Header do Certificado */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-950 p-6 relative overflow-hidden flex-shrink-0">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Award className="w-32 h-32 -mt-10 -mr-10 text-white" />
               </div>
               <div className="relative z-10">
                 <span className="inline-block px-3 py-1 bg-white/10 text-white border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
                   Válido
                 </span>
                 <h2 className="text-xl font-black text-white line-clamp-2 leading-tight">
                   {cert.curso_titulo}
                 </h2>
               </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-between">
               <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                       <span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider">Emitido em</span>
                       <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">{cert.data}</span>
                     </div>
                     <div>
                       <span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider">Carga Horária</span>
                       <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">{cert.carga} Horas Cursadas</span>
                     </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between">
                     <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Código de Validação</span>
                     <span className="font-mono font-bold text-slate-900 dark:text-white">{cert.codigo}</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link 
                    href={`/validar/${cert.codigo}`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-100/50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors text-center"
                  >
                     <ShieldCheck className="w-4 h-4" /> Validar Online
                  </Link>
                  <Link 
                    href={`/dashboard/certificados/${cert.id}`}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-secondary hover:bg-secondary/90 text-white font-bold text-xs rounded-xl transition-colors shadow-sm text-center"
                  >
                     <Download className="w-4 h-4 flex-shrink-0" /> Abrir e Salvar
                  </Link>
               </div>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

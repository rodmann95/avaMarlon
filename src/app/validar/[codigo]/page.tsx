import { ShieldCheck, Search, XCircle, CheckCircle2 } from "lucide-react";

export default function ValidarCertificadoPage({ params }: { params: { codigo: string } }) {

  // Na vida real: SELECT * FROM certificados WHERE codigo_validacao = params.codigo LIMIT 1;
  const valido = params.codigo.length > 5; // Apenas um fallback para Mock
  
  if (!valido) {
     return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
           <div className="bg-white p-10 rounded-[2rem] shadow-xl text-center max-w-lg w-full">
              <XCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />
              <h1 className="text-3xl font-black text-slate-900 mb-2">Código Inválido</h1>
              <p className="text-slate-600 mb-8">
                 O código <strong>{params.codigo}</strong> não consta em nossa base de formados da SEMED Colombo. 
                 Verifique se digitou corretamente as letras e números e tente novamente.
              </p>
              <form className="w-full relative">
                 <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input type="text" placeholder="Tentar novo código..." className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl font-bold bg-slate-50 outline-none focus:border-slate-400" />
              </form>
           </div>
        </div>
     );
  }

  return (
     <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white font-sans">
        
        {/* Cabeçalho Institucional */}
        <div className="mb-8 text-center">
           <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
             <ShieldCheck className="w-8 h-8 text-secondary" />
           </div>
           <h1 className="text-3xl font-black tracking-widest uppercase mt-4 mb-2 opacity-90">Prefeitura de Colombo</h1>
           <p className="font-bold text-slate-400 tracking-wider">Sistema AVA de Validação Acadêmica</p>
        </div>

        <div className="bg-white text-slate-900 p-8 md:p-12 rounded-[2rem] shadow-[0_0_50px_rgba(30,132,73,0.3)] max-w-2xl w-full border-t-8 border-secondary relative overflow-hidden">
           
           <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b-2 border-slate-100 pb-8 mb-8">
              <div>
                 <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg font-black text-sm uppercase tracking-widest inline-flex mb-4">
                   <CheckCircle2 className="w-5 h-5" /> Certificado Autêntico
                 </div>
                 <h2 className="text-2xl font-black">Gabrielle Admin</h2>
                 <p className="text-sm font-bold text-slate-500 font-mono mt-1">***.000.***-00</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hash Validador Digital</p>
                 <p className="text-lg font-mono font-black text-slate-800 bg-slate-100 px-3 py-1 rounded-lg mt-1">{params.codigo}</p>
              </div>
           </div>

           <div className="space-y-6">
              <div>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Titulação Integral</p>
                 <p className="text-xl font-black text-slate-800 border-l-4 border-slate-800 pl-4 py-1">
                   Educação Especial e Inclusiva - Práticas Pedagógicas
                 </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                 <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Carga Horária</span>
                    <span className="font-black text-xl">40 Horas</span>
                 </div>
                 <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Aproveitamento</span>
                    <span className="font-black text-xl text-secondary">100%</span>
                 </div>
                 <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-slate-200 md:pl-6 pt-4 md:pt-0">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Homologação</span>
                    <span className="font-black text-slate-700">10 Março, 2026</span>
                 </div>
              </div>
           </div>
        </div>

        <p className="mt-12 text-center text-xs text-slate-500 max-w-md mx-auto">
           A validação eletrônica atesta exclusivamente que o titular de fato concluiu o conteúdo exigido sob a métrica de acesso institucional registrada nos servidores da Secretaria Municipal de Educação.
        </p>

     </div>
  );
}

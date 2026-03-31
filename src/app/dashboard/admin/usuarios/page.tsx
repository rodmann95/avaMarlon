import Link from "next/link";
import { Search, Filter, ShieldCheck, Mail, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function AdminUsuariosPage() {
  const supabase = await createClient();

  // No painel do Gestor precisamos trazer tudo: ativos e inativos
  // Neste mock, forçamos um erro limpo se não achar e populamos mock para ver
  const { data: usuarios } = await supabase
    .from("users")
    .select(`*`)
    .order("nome", { ascending: true });

  const mockUsers = [
    { id: '1', nome: 'Eduardo Professor', cpf: '010.***.***-10', email: 'eduardo@escola.br', escola: 'EM Gabriel de Lara', cargo: 'Professor(a)' },
    { id: '2', nome: 'Ana Coordenadora', cpf: '080.***.***-60', email: 'ana@escola.br', escola: 'CMEI Cantinho', cargo: 'Coordenador(a)' }
  ];

  const lista = (usuarios && usuarios.length > 0) ? usuarios : mockUsers;

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-black text-slate-900 dark:text-white">Auditoria de Alunos e Educadores</h2>
           <p className="text-slate-500 text-sm">Monitore o acesso, carga horária e trave contas se necessário.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1 w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome, CPF ou escola..." 
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        
        <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100/50 hover:bg-slate-100 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-all">
          <Filter className="w-4 h-4" /> Filtros Avançados
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Educador / CPF</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Lotação Escolar</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Cargo</th>
                <th className="px-6 py-4 font-semibold text-right uppercase tracking-wider text-xs">Auditoria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {lista.map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-4">
                     <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                           {user.nome} 
                           {user.role === 'admin' && <span title="Administrador"><ShieldCheck className="w-4 h-4 text-secondary" /></span>}
                        </span>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 font-mono">
                           {user.cpf || 'CPF Oculto'} <span className="text-slate-300 dark:text-slate-700">|</span> <Mail className="w-3 h-3" /> {user.email}
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">
                     {user.escola || 'Sede SEMED'}
                  </td>
                  <td className="px-6 py-4">
                     <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs font-bold uppercase tracking-wider">
                     {user.cargo || 'Não informado'}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <Link href={`/dashboard/admin/usuarios/${user.id}`} className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-2">
                        Painel Espelho <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                     </Link>
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

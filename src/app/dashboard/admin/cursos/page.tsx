import Link from "next/link";
import { Plus, Edit2, Archive, Search, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

export default async function AdminCursosPage() {
  const supabase = await createClient();

  // No painel do Gestor precisamos trazer tudo: ativos e inativos
  const { data: cursos } = await supabase
    .from("cursos")
    .select(`*, modulos (id)`)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por título do curso..." 
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>
        
        <Link href="/dashboard/admin/cursos/novo" className="flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-sm font-bold shadow-sm transition-all">
          <Plus className="w-5 h-5" /> Criar Curso
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Título do Curso</th>
                <th className="px-6 py-4 font-semibold">Módulos</th>
                <th className="px-6 py-4 font-semibold">Carga Horária</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {cursos && cursos.length > 0 ? cursos.map((curso: any) => (
                <tr key={curso.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                     <p className="font-bold text-slate-900 dark:text-white truncate max-w-xs">{curso.titulo}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-500">
                     {curso.modulos?.length || 0} módulos
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-500">
                     {curso.carga_horaria_horas}h
                  </td>
                  <td className="px-6 py-4">
                     {curso.ativo ? (
                       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold text-xs uppercase tracking-wider">
                         <CheckCircle2 className="w-3.5 h-3.5" /> Publicado
                       </span>
                     ) : (
                       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                         <Archive className="w-3.5 h-3.5" /> Arquivado
                       </span>
                     )}
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/admin/cursos/${curso.id}/builder`} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Editar Conteúdo (Módulos/Aulas)">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                     </div>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      Nenhum curso encontrado. Comece criando um novo!
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

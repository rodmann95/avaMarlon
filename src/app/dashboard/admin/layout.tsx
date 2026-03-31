"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, BookOpen, Map, Users, ShieldAlert } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Em V2, buscar role = 'admin' do Supabase. Aqui mockamos para visualização:
  const isAdmin = true;

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">Acesso Negado</h2>
        <p className="text-slate-500 max-w-md mt-2">Você não tem permissão da SEMED para acessar esta área de gestão de conteúdo.</p>
        <Link href="/dashboard" className="mt-6 px-6 py-2 bg-primary text-white rounded-full">Voltar</Link>
      </div>
    );
  }

  const ADMIN_MENUS = [
    { name: "Cursos", path: "/dashboard/admin/cursos", icon: BookOpen },
    { name: "Trilhas", path: "/dashboard/admin/trilhas", icon: Map },
    { name: "Educadores", path: "/dashboard/admin/usuarios", icon: Users },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Settings className="w-3.5 h-3.5" /> Área Restrita
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Painel Gestor SEMED</h1>
        </div>

        <nav className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
          {ADMIN_MENUS.map(menu => {
            const isActive = pathname?.startsWith(menu.path);
            return (
              <Link 
                key={menu.path}
                href={menu.path} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                <menu.icon className="w-4 h-4" /> {menu.name}
              </Link>
            )
          })}
        </nav>
      </header>
      
      <main className="animate-fade-in relative">
        {children}
      </main>
    </div>
  );
}

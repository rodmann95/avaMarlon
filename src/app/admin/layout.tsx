"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationBell from "@/components/NotificationBell";
import { 
  BarChart4, Users, Building2, BookDown, FileSpreadsheet, 
  Award, MessageSquare, Settings, LogOut, Search, Bell, Monitor, Activity 
} from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard Executivo", icon: <BarChart4 className="w-5 h-5"/>, href: "/admin" },
    { label: "Gestão Cursistas", icon: <Users className="w-5 h-5"/>, href: "/admin/cursistas" },
    { label: "Escolas / Unidades", icon: <Building2 className="w-5 h-5"/>, href: "/admin/escolas" },
    { label: "Catálogo de Cursos", icon: <BookDown className="w-5 h-5"/>, href: "/admin/cursos" },
    { label: "Fila de Correções", icon: <Activity className="w-5 h-5"/>, href: "/admin/avaliacoes" },
    { label: "Relatórios Oficiais", icon: <FileSpreadsheet className="w-5 h-5"/>, href: "/admin/relatorios" },
    { label: "Auditoria de Títulos", icon: <Award className="w-5 h-5"/>, href: "/admin/certificados" },
    { label: "Comunidade (Fóruns)", icon: <MessageSquare className="w-5 h-5"/>, href: "/admin/foruns" },
  ];

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden print:bg-white print:h-auto ${inter.className}`}>
      
      {/* SIDEBAR TÁTICA (Governo) */}
      <aside className="w-72 bg-[#0F172A] border-r border-slate-800 text-slate-300 flex flex-col transition-all print:hidden z-20 shadow-2xl">
         
         <div className="p-6 border-b border-slate-800 flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
               GOV
            </div>
            <div>
               <h1 className="font-bold text-white leading-tight">Painel Gestor</h1>
               <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">SEMED Colombo</span>
            </div>
         </div>

         <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-1 scrollbar-thin">
            <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Administração e Relatórios</p>
            {menuItems.map((item) => {
               const isActive = pathname === item.href;
               return (
                 <Link 
                   key={item.href} 
                   href={item.href}
                   className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all group relative overflow-hidden
                     ${isActive 
                        ? 'text-white bg-white/10 shadow-inner' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'}
                   `}
                 >
                   {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-r-full"></div>}
                   <div className={`${isActive ? 'text-secondary' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>
                     {item.icon}
                   </div>
                   {item.label}
                 </Link>
               );
            })}

            <div className="pt-8 mt-8 border-t border-slate-800/50">
               <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Sistema</p>
               <Link href="/admin/configuracoes" className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                  <Settings className="w-5 h-5 text-slate-500" /> Configurações Gerais
               </Link>
            </div>
         </nav>

         <div className="p-6 border-t border-slate-800 bg-slate-900/50">
            <button className="flex justify-between items-center w-full px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl font-bold text-sm transition-all group">
               Sair do Sistema <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </button>
         </div>

      </aside>

      {/* ÁREA CENTRAL - HEADER + CONTEÚDO */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
         
         <header className="h-20 bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 flex-shrink-0 z-10 print:hidden shadow-sm">
            <div className="flex items-center gap-4 w-96">
               <div className="relative w-full">
                 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input type="text" placeholder="Pesquisar matrículas ou alunos (⌘K)" className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:ring-1 focus:ring-primary outline-none transition-all" />
               </div>
            </div>
            
            <div className="flex items-center gap-6">
               <NotificationBell isAdmin={true} />
               <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <Monitor className="w-5 h-5" />
               </button>
               
               <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
               
               <div className="flex items-center gap-3">
                 <div className="text-right hidden sm:block">
                   <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Super Administrador</p>
                   <span className="text-[10px] font-bold uppercase text-secondary tracking-widest">Acesso Irrestrito</span>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400">
                   SU
                 </div>
               </div>
            </div>
         </header>

         {/* CONTAINER RENDERIZADOR DAS PÁGINAS DO ADMIN */}
         <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
            {children}
         </div>

      </main>

    </div>
  );
}

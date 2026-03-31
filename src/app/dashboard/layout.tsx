"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationBell from "@/components/NotificationBell";
import { 
  Home, 
  BookOpen, 
  Map, 
  Award, 
  MessageSquare, 
  User, 
  LogOut,
  Bell,
  Menu,
  GraduationCap
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Início", path: "/dashboard", icon: Home },
  { name: "Meus Cursos", path: "/dashboard/cursos", icon: BookOpen },
  { name: "Trilhas", path: "/dashboard/trilhas", icon: Map },
  { name: "Certificados", path: "/dashboard/certificados", icon: Award },
  { name: "Fórum", path: "/dashboard/forum", icon: MessageSquare },
  { name: "Meu Perfil", path: "/dashboard/perfil", icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Exemplo Mockado de Usuário - No futuro virá do Supabase Auth
  const userMock = {
    name: "Prof. Ana Souza",
    role: "Pedagoga - SEMED",
    initials: "AS"
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            Edu<span className="text-primary">Formação</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut className="w-5 h-5" />
            Sair da conta
          </button>
        </div>
      </aside>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Header Superior */}
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
          
          <div className="flex items-center md:hidden">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <NotificationBell />
            
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
            
            <button className="flex items-center gap-3 text-left pl-2 group">
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">{userMock.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{userMock.role}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-sm border border-secondary/20 shadow-sm">
                {userMock.initials}
              </div>
            </button>
          </div>
        </header>

        {/* Conteúdo Dinâmico da Página */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg pb-safe z-30">
        <ul className="flex items-center justify-around px-2 h-16">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path} className="w-full">
                <Link
                  href={item.path}
                  className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                    isActive 
                      ? "text-primary" 
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <div className={`relative flex items-center justify-center ${isActive ? "w-10 h-8 rounded-full bg-primary/10 dark:bg-primary/20" : ""}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium leading-none line-clamp-1 truncate px-1">
                    {item.name}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  );
}

"use client";

import { Bell, CheckCircle2, AlertTriangle, FileBadge, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function NotificationBell({ isAdmin = false }: { isAdmin?: boolean }) {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // MOCK de fila de alertas. Na V2 vêm da tabela `notificacoes`
  const notifications = isAdmin ? [
     { id: 1, title: 'Cursistas Ociosos', desc: '40 professores completaram 30 dias off', doc: true, icon: <AlertTriangle className="w-4 h-4 text-amber-500"/> },
     { id: 2, title: 'Exportação Concluída', desc: 'Relatório Executivo gerado nas nuvens', doc: false, icon: <CheckCircle2 className="w-4 h-4 text-emerald-500"/> }
  ] : [
     { id: 3, title: 'Certificado Emitido ✨', desc: 'Seu certificado de Inclusão está pronto.', doc: false, icon: <FileBadge className="w-4 h-4 text-secondary"/> },
     { id: 4, title: 'Nota Liberada', desc: 'A SEMED corrigiu sua avaliação dissertativa (95pts).', doc: false, icon: <CheckCircle2 className="w-4 h-4 text-emerald-500"/> }
  ];

  // Fecha clicando fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
         onClick={() => setOpen(!open)}
         className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-slate-100 dark:bg-slate-900 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
         aria-label="Notificações"
         aria-expanded={open}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-[#0F172A] text-[8px] font-black text-white flex items-center justify-center">
             {unreadCount}
          </span>
        )}
      </button>

      {open && (
         <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-black/10 border border-slate-200 dark:border-slate-800 z-50 animate-fade-in origin-top-right overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
               <h3 className="font-bold text-slate-900 dark:text-white">Avisos do Sistema</h3>
               {unreadCount > 0 && (
                  <button onClick={() => setUnreadCount(0)} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">
                     Marcar lidas
                  </button>
               )}
            </div>
            
            <div className="max-h-80 overflow-y-auto">
               {notifications.length === 0 ? (
                 <p className="text-center p-6 text-slate-400 text-sm">Tudo tranquilo por aqui.</p>
               ) : (
                 notifications.map(n => (
                   <div key={n.id} className="p-4 border-b border-slate-100 dark:border-slate-800/10 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors flex gap-3 group relative cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                         {n.icon}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{n.title}</p>
                         <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.desc}</p>
                         <span className="text-[10px] text-slate-400 font-bold block mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Ver Detalhes →</span>
                      </div>
                   </div>
                 ))
               )}
            </div>
            
            <div className="p-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-center">
               <Link href={isAdmin ? "/admin/configuracoes" : "/dashboard/perfil"} onClick={() => setOpen(false)} className="text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white uppercase tracking-widest">
                  Centro de Preferências
               </Link>
            </div>
         </div>
      )}
    </div>
  )
}

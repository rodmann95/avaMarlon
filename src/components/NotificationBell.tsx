"use client";

import { Bell, CheckCircle2, AlertTriangle, FileBadge, X, Loader2, Info } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function NotificationBell({ isAdmin = false }: { isAdmin?: boolean }) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();

    // Setup Realtime Subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notificacoes',
        },
        (payload) => {
          // Se a notificação for para este usuário, recarrega
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchNotifications() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('notificacoes')
      .select('*')
      .eq('user_id', user.id)
      .order('criado_em', { ascending: false })
      .limit(10);

    if (!error && data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.lida).length);
    }
  }

  const marcarTodasLidas = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('notificacoes')
      .update({ lida: true })
      .eq('user_id', user.id)
      .eq('lida', false);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, lida: true })));
      setUnreadCount(0);
    }
  };

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'sucesso': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'alerta': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'certificado': return <FileBadge className="w-4 h-4 text-secondary" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

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
         className="relative p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all bg-white dark:bg-slate-900 rounded-xl hover:shadow-md border border-slate-100 dark:border-slate-800"
         aria-label="Notificações"
         aria-expanded={open}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-[#0F172A] text-[9px] font-black text-white flex items-center justify-center animate-pulse">
             {unreadCount}
          </span>
        )}
      </button>

      {open && (
         <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-black/10 border border-slate-200 dark:border-slate-800 z-50 animate-fade-in origin-top-right overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
               <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">Central de Avisos</h3>
               {unreadCount > 0 && (
                  <button onClick={marcarTodasLidas} className="text-[10px] font-black text-primary hover:text-primary/70 uppercase tracking-widest transition-colors">
                     Limpar Notificações
                  </button>
               )}
            </div>
            
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
               {notifications.length === 0 ? (
                 <div className="flex flex-col items-center justify-center p-12 text-slate-400 opacity-30">
                    <Bell className="w-12 h-12 mb-3" />
                    <p className="text-xs font-bold uppercase tracking-widest">Nenhum aviso novo</p>
                 </div>
               ) : (
                 notifications.map(n => (
                   <div key={n.id} className={`p-5 border-b border-slate-100 dark:border-slate-800/10 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all flex gap-4 group relative cursor-pointer ${!n.lida ? 'bg-primary/5 dark:bg-primary/5' : ''}`}>
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${!n.lida ? 'bg-white dark:bg-slate-800 shadow-sm' : 'bg-slate-50 dark:bg-slate-900 opacity-50'}`}>
                         {getIcon(n.tipo)}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start mb-1">
                            <p className={`text-sm leading-tight ${!n.lida ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-500'}`}>
                               {n.titulo}
                            </p>
                            {!n.lida && <span className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0 animate-pulse"></span>}
                         </div>
                         <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">
                            {n.mensagem}
                         </p>
                         <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            {new Date(n.criado_em).toLocaleDateString()} • Ver Mais →
                         </span>
                      </div>
                   </div>
                 ))
               )}
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-center">
               <Link href={isAdmin ? "/admin/cursistas" : "/dashboard/notificacoes"} onClick={() => setOpen(false)} className="text-[10px] font-black text-slate-400 hover:text-slate-900 dark:hover:text-white uppercase tracking-widest transition-colors">
                  Ver histórico completo
               </Link>
            </div>
         </div>
      )}
    </div>
  )
}

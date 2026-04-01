"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Award, BookOpen, Clock, PlayCircle, Star, 
  TrendingUp, Activity, CheckCircle2, Loader2 
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { createClient } from "@/utils/supabase/client";

export default function DashboardHome() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [metricas, setMetricas] = useState({
    horas_concluidas: 0,
    em_andamento: 0,
    concluidos: 0,
    certificados: 0
  });

  const [cursosAndamento, setCursosAndamento] = useState<any[]>([]);
  const [cursosRecomendados, setCursosRecomendados] = useState<any[]>([]);

  // Dados para o gráfico de engajamento (Mock evoluível para analytics real)
  const dadosGrafico = [
    { name: 'Sem. 1', horas: 5 },
    { name: 'Sem. 2', horas: 12 },
    { name: 'Sem. 3', horas: 8 },
    { name: 'Sem. 4', horas: 15 },
  ];

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Perfil do Cursista
      const { data: profile } = await supabase
        .from('users')
        .select('nome')
        .eq('id', user.id)
        .single();
      
      setUserData(profile);

      // 2. Métricas de Progresso
      const { data: progresso } = await supabase
        .from('progresso_cursos')
        .select(`
          percentual,
          cursos (id, titulo, carga_horaria_horas)
        `)
        .eq('user_id', user.id);

      if (progresso) {
        const concluidos = progresso.filter(p => p.percentual === 100);
        const emAndamento = progresso.filter(p => p.percentual < 100);
        const horas = concluidos.reduce((acc, curr: any) => acc + (curr.cursos?.carga_horaria_horas || 0), 0);

        // 3. Certificados Emitidos
        const { count: totalCertificados } = await supabase
          .from('certificados')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        setMetricas({
          horas_concluidas: horas,
          em_andamento: emAndamento.length,
          concluidos: concluidos.length,
          certificados: totalCertificados || 0
        });

        setCursosAndamento(emAndamento.map((p: any) => ({
          id: p.cursos.id,
          titulo: p.cursos.titulo,
          progresso: p.percentual
        })));
      }

      // 4. Recomendações (Cursos que o usuário ainda não iniciou)
      const viewedIds = progresso?.map(p => (p.cursos as any).id) || [];
      const { data: recomendados } = await supabase
        .from('cursos')
        .select('id, titulo, carga_horaria_horas, trilhas(titulo)')
        .eq('ativo', true)
        .not('id', 'in', `(${viewedIds.length ? viewedIds.join(',') : '00000000-0000-0000-0000-000000000000'})`)
        .limit(3);

      if (recomendados) {
        setCursosRecomendados(recomendados.map((c: any) => ({
          id: c.id,
          titulo: c.titulo,
          carga: c.carga_horaria_horas,
          trilha: c.trilhas?.titulo || 'Educação'
        })));
      }

      setLoading(false);
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
         <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
         <p className="font-bold text-lg uppercase tracking-widest text-slate-500 animate-pulse">Sincronizando seu progresso na SEMED...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-7xl mx-auto">
      
      {/* Header com Saudação Dinâmica */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
           <Activity className="w-72 h-72 -mt-20 -mr-20 text-white" />
        </div>
        
        <div className="relative z-10 space-y-3">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Olá, {userData?.nome || "Educador(a)"}! 👋
          </h1>
          <p className="text-slate-400 md:text-xl max-w-2xl font-medium">
            Seu desenvolvimento contínuo transforma a educação em Colombo. Vamos continuar?
          </p>
        </div>
        
        <div className="relative z-10 flex gap-4 w-full md:w-auto">
           <Link href="/dashboard/cursos" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black shadow-lg transition-all hover:scale-105">
             <BookOpen className="w-5 h-5" /> Catálogo Completo
           </Link>
        </div>
      </header>

      {/* Grid de Métricas Reais do Supabase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Horas Reais', value: `${metricas.horas_concluidas}h`, icon: Clock, color: 'text-secondary', bg: 'bg-secondary/10' },
          { label: 'Cursando', value: metricas.em_andamento, icon: PlayCircle, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Finalizados', value: metricas.concluidos, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Certificados', value: metricas.certificados, icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-7 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center ${item.color}`}>
              <item.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
           
           {/* Cursos em Andamento (Dinâmico) */}
           <section className="space-y-4">
             <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
               <Activity className="w-6 h-6 text-primary" /> De onde você parou
             </h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               {cursosAndamento.length === 0 ? (
                 <div className="col-span-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-12 text-center text-slate-400">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-10" />
                    <p className="font-bold text-lg">Nenhum curso em andamento.</p>
                    <Link href="/dashboard/cursos" className="text-primary font-black text-sm block mt-3 hover:underline">Iniciar primeira formação →</Link>
                 </div>
               ) : (
                 cursosAndamento.map(curso => (
                   <Link key={curso.id} href={`/dashboard/cursos/${curso.id}`} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all flex flex-col gap-5">
                     <div className="flex gap-4 items-start">
                       <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary/20 group-hover:bg-primary/10 transition-colors flex-shrink-0">
                         <PlayCircle className="w-9 h-9" />
                       </div>
                       <h3 className="font-black text-slate-800 dark:text-white text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                         {curso.titulo}
                       </h3>
                     </div>
                     
                     <div className="space-y-3 mt-auto">
                       <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-tighter">
                         <span>Seu Progresso</span>
                         <span className="text-primary">{curso.progresso}%</span>
                       </div>
                       <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                         <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-1000" style={{ width: `${curso.progresso}%` }}></div>
                       </div>
                     </div>
                   </Link>
                 ))
               )}
             </div>
           </section>

           {/* Gráfico Semanal (UI Progressiva) */}
           <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
             <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
               <TrendingUp className="w-6 h-6 text-secondary" /> Engajamento Semanal (Fictício)
             </h2>
             <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={dadosGrafico} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={15} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                   <Tooltip 
                     cursor={{fill: '#f8fafc'}}
                     contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                   />
                   <Bar dataKey="horas" radius={[10, 10, 10, 10]} barSize={40}>
                     {dadosGrafico.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={index === dadosGrafico.length - 1 ? '#10b981' : '#3b82f6'} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </section>

        </div>

        <div className="space-y-8">
           {/* Card de Próximo Nível */}
           <section className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <Star className="w-56 h-56" />
             </div>
             
             <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20">
               <Award className="w-9 h-9" />
             </div>
             
             <h3 className="text-2xl font-black mb-3">Rumo ao Certificado!</h3>
             <p className="text-slate-400 font-medium mb-8 leading-relaxed">
                Você está evoluindo rápido. Conclua o curso atual para liberar seu certificado oficial da Secretaria de Educação.
             </p>
             <Link href="/dashboard/certificados" className="flex items-center justify-center w-full py-4 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl font-black transition-all">
                Meus Diplomas
             </Link>
           </section>

           {/* Recomendações Reais (Dinâmico) */}
           <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-7 shadow-sm">
             <h2 className="text-xl font-black text-slate-800 dark:text-white mb-7 flex items-center gap-3">
               <Star className="w-6 h-6 text-amber-500" /> Novas Oportunidades
             </h2>
             
             <div className="space-y-5">
               {cursosRecomendados.length === 0 ? (
                 <p className="text-slate-400 text-center py-6 text-sm font-bold">Incrível! Você já iniciou todos os cursos ativos.</p>
               ) : (
                 cursosRecomendados.map(curso => (
                   <Link key={curso.id} href={`/dashboard/cursos/${curso.id}`} className="flex gap-5 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all group border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                     <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl flex-shrink-0 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                       <BookOpen className="w-7 h-7" />
                     </div>
                     <div className="flex flex-col justify-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{curso.trilha}</span>
                        <h4 className="font-black text-slate-900 dark:text-white text-[15px] line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                          {curso.titulo}
                        </h4>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 font-black uppercase tracking-tighter">
                          <Clock className="w-3.5 h-3.5" /> {curso.carga} Horas
                        </div>
                     </div>
                   </Link>
                 ))
               )}
             </div>
             
             <Link href="/dashboard/cursos" className="flex items-center justify-center w-full mt-8 py-3 text-sm font-black text-primary hover:text-primary/70 transition-all">
               Ver Curadoria SEMED →
             </Link>
           </section>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Award, BookOpen, Clock, PlayCircle, Star, 
  TrendingUp, Activity, CheckCircle2 
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell
} from "recharts";

export default function DashboardHome() {
  const [nome, setNome] = useState("Educador(a)");
  
  // MOCK DE DADOS - Integraremos com Supabase nativamente via hooks depois
  const metricas = {
    horas_concluidas: 120,
    em_andamento: 3,
    concluidos: 8,
    certificados: 7
  };

  const dadosGrafico = [
    { name: 'Semana 1', horas: 12 },
    { name: 'Semana 2', horas: 8  },
    { name: 'Semana 3', horas: 15 },
    { name: 'Semana 4', horas: 20 },
  ];

  const cursosAndamento = [
    { id: '1', titulo: 'Metodologias Ativas e a BNCC', progresso: 65, thumb: '' },
    { id: '2', titulo: 'Gestão de Sala de Aula Inclusiva', progresso: 30, thumb: '' }
  ];

  const cursosRecomendados = [
    { id: '3', titulo: 'Tecnologias Educacionais na Prática', carga: 40, trilha: 'Inovação' },
    { id: '4', titulo: 'Comunicação Não Violenta (CNV)', carga: 20, trilha: 'Socioemocional' }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-7xl mx-auto">
      
      {/* Header Personalizado */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2rem] p-8 md:p-10 shadow-xl relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
           <Activity className="w-64 h-64 -mt-20 -mr-20 text-white" />
        </div>
        
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
            Olá, {nome}! 👋
          </h1>
          <p className="text-slate-300 md:text-lg max-w-2xl">
            Bem-vindo(a) de volta. Seu histórico formativo está em pleno desenvolvimento. Continue sua trilha de onde parou.
          </p>
        </div>
        
        <div className="relative z-10 flex gap-4 w-full md:w-auto">
           <Link href="/dashboard/cursos" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-md transition-all">
             <BookOpen className="w-5 h-5" /> Explorar Catálogo
           </Link>
        </div>
      </header>

      {/* Grid de 4 Métricas (Resumo Rápido) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
           <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
             <Clock className="w-7 h-7" />
           </div>
           <div>
             <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Horas Feitas</p>
             <p className="text-3xl font-black text-slate-900 dark:text-white">{metricas.horas_concluidas}h</p>
           </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
           <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
             <PlayCircle className="w-7 h-7" />
           </div>
           <div>
             <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Em Andamento</p>
             <p className="text-3xl font-black text-slate-900 dark:text-white">{metricas.em_andamento}</p>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
           <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
             <CheckCircle2 className="w-7 h-7" />
           </div>
           <div>
             <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Concluídos</p>
             <p className="text-3xl font-black text-slate-900 dark:text-white">{metricas.concluidos}</p>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
           <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
             <Award className="w-7 h-7" />
           </div>
           <div>
             <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Certificados</p>
             <p className="text-3xl font-black text-slate-900 dark:text-white">{metricas.certificados}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lado Esquerdo Maior: Continue Aprendendo + Recomendados */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* Seção: Continue Aprendendo */}
           <section className="space-y-4">
             <div className="flex items-center justify-between">
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <PlayCircle className="w-6 h-6 text-primary" /> Continue Aprendendo
               </h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {cursosAndamento.map(curso => (
                 <Link key={curso.id} href={`/dashboard/cursos/${curso.id}`} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-5 shadow-sm hover:shadow-xl transition-all flex flex-col gap-4">
                   <div className="flex gap-4 items-center">
                     <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary/30 flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                       <BookOpen className="w-8 h-8" />
                     </div>
                     <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                       {curso.titulo}
                     </h3>
                   </div>
                   
                   <div className="space-y-2 mt-auto">
                     <div className="flex justify-between text-xs font-bold text-slate-500">
                       <span>Progresso</span>
                       <span className="text-primary">{curso.progresso}%</span>
                     </div>
                     <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                       <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full" style={{ width: `${curso.progresso}%` }}></div>
                     </div>
                   </div>
                 </Link>
               ))}
             </div>
           </section>

           {/* Gráfico de Engajamento */}
           <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
               <TrendingUp className="w-5 h-5 text-secondary" /> Engajamento (Últimos 30 Dias)
             </h2>
             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={dadosGrafico} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                   <Tooltip 
                     cursor={{fill: 'transparent'}}
                     contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                   />
                   <Bar dataKey="horas" radius={[6, 6, 6, 6]}>
                     {dadosGrafico.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={index === dadosGrafico.length - 1 ? '#1E8449' : '#1B4F72'} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </section>

        </div>

        {/* Lado Direito: Recomendados & Conquistas */}
        <div className="space-y-8">
           
           {/* Conquistas Recentes */}
           <section className="bg-slate-900 text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden text-center">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Star className="w-40 h-40 -mt-10 -mr-10" />
             </div>
             
             <div className="w-16 h-16 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
               <Award className="w-8 h-8" />
             </div>
             
             <h3 className="text-xl font-bold mb-2">Conquista Recente!</h3>
             <p className="text-slate-400 text-sm mb-6">
                Você bateu a meta de 100 horas de capacitação esse ano. Continue voando alto na SEMED!
             </p>
             <Link href="/dashboard/historico" className="inline-block px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-colors backdrop-blur-md">
                Ver Histórico Completo
             </Link>
           </section>

           {/* Seleção de Recomendados */}
           <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
               <Star className="w-5 h-5 text-amber-500" /> Recomendados para você
             </h2>
             
             <div className="space-y-4">
               {cursosRecomendados.map(curso => (
                 <Link key={curso.id} href={`/dashboard/cursos/${curso.id}`} className="flex gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors group">
                   <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl flex-shrink-0 flex items-center justify-center text-primary/40 group-hover:bg-primary/10 transition-colors">
                     <BookOpen className="w-6 h-6" />
                   </div>
                   <div className="flex flex-col justify-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">{curso.trilha}</span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {curso.titulo}
                      </h4>
                      <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 font-semibold">
                        <Clock className="w-3.5 h-3.5" /> {curso.carga}h
                      </div>
                   </div>
                 </Link>
               ))}
             </div>
             
             <Link href="/dashboard/cursos" className="block text-center text-sm font-bold text-primary mt-6 hover:text-primary/80 transition-colors">
               Ver todo o catálogo →
             </Link>
           </section>

        </div>

      </div>
    </div>
  );
}

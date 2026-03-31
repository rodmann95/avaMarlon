"use client";

import { useState } from "react";
import { Activity, LayoutDashboard, Target, CalendarDays } from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RToltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend 
} from "recharts";

export default function IndicadoresPage() {

  // MOCKADOS: Integrarão com as tabelas de `sessoes_acesso` e `progresso_cursos` futuramente.
  const distDados = [
    { name: 'Gestão Escolar', value: 35 },
    { name: 'Ensino Infantil', value: 25 },
    { name: 'Inclusão Digital', value: 20 },
    { name: 'Leis', value: 20 },
  ];
  const COLORS = ['#1B4F72', '#2874A6', '#1E8449', '#58D68D'];

  const linhaDoTempo = [
    { mes: 'Out', horas_estudadas: 15, media_geral: 10 },
    { mes: 'Nov', horas_estudadas: 25, media_geral: 12 },
    { mes: 'Dez', horas_estudadas: 5, media_geral: 8 },
    { mes: 'Jan', horas_estudadas: 30, media_geral: 15 },
    { mes: 'Fev', horas_estudadas: 45, media_geral: 20 },
  ];

  const trilhasEmFoco = [
    { nome: "Educação Especial", prog: 78, resto: "8 horas restantes" },
    { nome: "Coordenação Pedagógica", prog: 30, resto: "40 horas restantes" }
  ];

  // Gera mapa de calor (Github Style) aleatório para os últimos 90 dias
  const heatmapBoxes = Array.from({ length: 90 }, () => Math.floor(Math.random() * 4));

  const getColorIntensity = (value: number) => {
    switch(value) {
      case 1: return 'bg-primary/30 dark:bg-primary/20';
      case 2: return 'bg-primary/60 dark:bg-primary/50';
      case 3: return 'bg-primary shadow-[0_0_8px_rgba(27,79,114,0.5)] dark:bg-primary/80';
      default: return 'bg-slate-100 dark:bg-slate-800'; // Vazio
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-7xl mx-auto">
      
      <header className="space-y-2">
        <h1 className="text-3xl md:text-exl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <Activity className="w-8 h-8 text-secondary" /> Autoavaliação e Indicadores
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
          Visualize a densidade, o volume e as disciplinas da sua jornada de formação com a SEMED.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* GRÁFICO 1: Distribuição (Rosca) */}
        <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Foco Temático</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full">
            <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={distDados}
                     cx="50%" cy="50%"
                     innerRadius={60} outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                     stroke="none"
                   >
                     {distDados.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <RToltip 
                     contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                   />
                 </PieChart>
               </ResponsiveContainer>
            </div>
            
            <div className="flex-1 space-y-4 w-full">
               {distDados.map((item, index) => (
                 <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                       <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                       <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{item.value}%</span>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* METRICA 2: Heatmap Visual (GitHub) */}
        <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <CalendarDays className="w-6 h-6 text-primary" />
            <div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-white">Frequência de Acesso</h3>
               <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Últimos 90 dias</p>
            </div>
          </div>

          <div className="flex gap-2">
             <div className="flex flex-col justify-around text-[10px] font-bold text-slate-400 uppercase tracking-widest h-[110px] mt-2">
               <span>Seg</span>
               <span>Qua</span>
               <span>Sex</span>
             </div>
             
             {/* Grid Container do Heatmap */}
             <div className="flex-1 grid grid-cols-12 md:grid-cols-[repeat(15,minmax(0,1fr))] gap-1.5 pt-2">
               {heatmapBoxes.map((valor, i) => (
                 <div 
                   key={i} 
                   className={`aspect-square w-full rounded-[4px] border border-black/[0.03] dark:border-white/5 transition-colors duration-500 hover:ring-2 ring-secondary/50 ${getColorIntensity(valor)}`}
                   title={`Atividade Nível: ${valor}`}
                 ></div>
               ))}
             </div>
          </div>
          
          <div className="flex items-center justify-end gap-2 mt-6 text-xs text-slate-500 font-bold uppercase tracking-wider">
             <span>Ausente</span>
             <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
             <div className="w-3 h-3 rounded-sm bg-primary/30"></div>
             <div className="w-3 h-3 rounded-sm bg-primary/60"></div>
             <div className="w-3 h-3 rounded-sm bg-primary"></div>
             <span>Assíduo</span>
          </div>
        </section>

      </div>

      {/* GRÁFICO 3: Comparações de Área (Evolução) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm h-96 flex flex-col">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 flex-shrink-0">
          <Target className="w-6 h-6 text-secondary" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Velocidade de Formação vs. Média Municipal</h3>
        </div>
        
        <div className="flex-1 w-full relative">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={linhaDoTempo} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
               <defs>
                 <linearGradient id="colorMinhas" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#1B4F72" stopOpacity={0.3}/>
                   <stop offset="95%" stopColor="#1B4F72" stopOpacity={0}/>
                 </linearGradient>
                 <linearGradient id="colorMedia" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                   <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
               <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
               <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
               <RToltip 
                 contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                 labelStyle={{ fontWeight: 'bold', color: '#64748b' }}
               />
               <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b' }} />
               <Area type="monotone" name="Geral da SEMED" dataKey="media_geral" stroke="#94a3b8" strokeWidth={3} fillOpacity={1} fill="url(#colorMedia)" />
               <Area type="monotone" name="Mínha Dedicação (horas)" dataKey="horas_estudadas" stroke="#1B4F72" strokeWidth={4} fillOpacity={1} fill="url(#colorMinhas)" activeDot={{ r: 8, fill: '#1E8449', stroke: '#fff', strokeWidth: 3 }} />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </section>

      {/* METRICA 4: Trilhas Atômicas */}
      <section className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 md:p-10 shadow-xl text-white">
        <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
           Minhas Trilhas Oficiais
        </h3>
        <div className="space-y-8">
           {trilhasEmFoco.map((tr, i) => (
             <div key={i}>
                <div className="flex justify-between items-end mb-3">
                  <h4 className="font-bold text-lg text-slate-200">{tr.nome}</h4>
                  <div className="text-right">
                    <span className="text-3xl font-black text-secondary leading-none">{tr.prog}</span>
                    <span className="text-secondary font-bold">%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
                   <div 
                     className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-1000 ease-out relative" 
                     style={{ width: `${tr.prog}%` }}
                   >
                     {/* Reflexo animado no carregamento da barra */}
                     <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                   </div>
                </div>
                <p className="text-xs text-slate-400 font-semibold tracking-wider text-right">{tr.resto} projetadas</p>
             </div>
           ))}
        </div>
      </section>

    </div>
  );
}

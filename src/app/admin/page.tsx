"use client";

import { 
  Users, Building2, BookDown, Award, Clock, ArrowUpRight, 
  ArrowDownRight, AlertTriangle, ShieldAlert
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RToltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';

export default function AdminDashboardPage() {
  
  // MOCK DATA DE ALTO NÍVEL
  const KPIs = [
    { titulo: "Total Cursistas", valor: "2.450", meta: "+12%", ico: <Users className="w-6 h-6"/>, pos: true },
    { titulo: "Matrículas Ativas", valor: "4.120", meta: "+5%", ico: <BookDown className="w-6 h-6"/>, pos: true },
    { titulo: "Certificados Emitidos", valor: "1.890", meta: "-2%", ico: <Award className="w-6 h-6"/>, pos: false },
    { titulo: "Horas Homologadas", valor: "45.6k", meta: "+24%", ico: <Clock className="w-6 h-6"/>, pos: true },
  ];

  const chartAcessos = [
    { dia: '01', acessos: 120 }, { dia: '02', acessos: 150 }, { dia: '03', acessos: 180 },
    { dia: '04', acessos: 220 }, { dia: '05', acessos: 190 }, { dia: '06', acessos: 300 },
    { dia: '07', acessos: 450 }, { dia: '08', acessos: 410 }, { dia: '09', acessos: 380 }
  ];

  const chartCargos = [
    { name: 'Professores', value: 65, color: '#1B4F72' },
    { name: 'Coordenadores', value: 20, color: '#1E8449' },
    { name: 'Diretores', value: 10, color: '#F39C12' },
    { name: 'Pedagogos', value: 5, color: '#9B59B6' },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto pb-12">
       
       <header>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Panorama Operacional</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Visão geral da evolução formativa dos educadores do município.</p>
       </header>

       {/* KPIs Principais */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {KPIs.map((kpi, idx) => (
             <div key={idx} className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.pos ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                     {kpi.ico}
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${kpi.pos ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                     {kpi.pos ? <ArrowUpRight className="w-3 h-3"/> : <ArrowDownRight className="w-3 h-3"/>} {kpi.meta}
                  </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{kpi.valor}</h3>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mt-1">{kpi.titulo}</p>
             </div>
          ))}
       </div>

       {/* ALARMES DE SISTEMA */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-6 rounded-2xl flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 text-red-500 rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse">
               <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
               <h4 className="font-bold text-red-800 dark:text-red-400">140 Cursistas Ociosos</h4>
               <p className="text-sm text-red-600/80 dark:text-red-300/70 mt-1 leading-snug">Matriculados com mais de 30 dias de ausência. Ação de retenção recomendada.</p>
            </div>
         </div>
         <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-6 rounded-2xl flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 text-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
               <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
               <h4 className="font-bold text-amber-800 dark:text-amber-400">Gargalo de Correção</h4>
               <p className="text-sm text-amber-700/80 dark:text-amber-300/70 mt-1 leading-snug">Existem 28 redações (dissertativas) aguardando correção há mais de 7 dias.</p>
            </div>
         </div>
         <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-start gap-4 shadow-xl border border-slate-700 relative overflow-hidden">
            {/* Decoração bg */}
            <div className="absolute right-0 top-0 p-4 opacity-5 pointer-events-none">
               <Building2 className="w-32 h-32 -mt-4 -mr-4 text-white" />
            </div>
            <div className="relative z-10 w-full">
               <h4 className="font-bold text-slate-200 flex justify-between">🏆 Escola Destaque</h4>
               <p className="text-2xl font-black mt-2 text-secondary">Escola M. Gabriel de Lara</p>
               <p className="text-sm text-slate-400 mt-1">Acumulou 80% de aprovações semanais.</p>
            </div>
         </div>
       </div>

       {/* ÁREA DE GRÁFICOS RECHARTS */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Evolução Diária */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm">
             <div className="mb-6 flex items-center justify-between">
               <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Fluxo de Engajamento Diário</h3>
                  <p className="text-sm text-slate-500">Últimos 10 acessos da semana corrente</p>
               </div>
               <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold rounded-lg px-3 py-1.5 outline-none">
                  <option>Neste Mês</option>
                  <option>Mês Passado</option>
               </select>
             </div>
             
             <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartAcessos} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                      <defs>
                         <linearGradient id="corAcessos" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#1B4F72" stopOpacity={0.4}/>
                           <stop offset="95%" stopColor="#1B4F72" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <RToltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="acessos" stroke="#1B4F72" strokeWidth={4} fillOpacity={1} fill="url(#corAcessos)" activeDot={{ r: 8, fill: '#1E8449', stroke: '#fff', strokeWidth: 3 }} />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

           {/* Distribuição por Cargo */}
           <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm flex flex-col">
             <div className="mb-2">
               <h3 className="font-bold text-lg text-slate-900 dark:text-white">Perfil Demográfico</h3>
               <p className="text-sm text-slate-500">Divisão macro da rede</p>
             </div>
             
             <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={chartCargos}
                       cx="50%" cy="50%"
                       innerRadius={60} outerRadius={90}
                       paddingAngle={5}
                       dataKey="value"
                       stroke="none"
                     >
                       {chartCargos.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                     </Pie>
                     <RToltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                     <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                   </PieChart>
                </ResponsiveContainer>
             </div>
          </div>

       </div>

    </div>
  )
}

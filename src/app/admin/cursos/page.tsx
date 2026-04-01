"use client";

import { Search, Plus, PlayCircle, LibraryBig, Edit2, Archive, Loader2, CheckCircle2, X, PlusCircle, LayoutGrid, ArrowLeft, FileText, Video, HelpCircle, Save, Trash2, ChevronDown, ChevronUp, AlertCircle, CheckCircle, ListChecks } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";

export default function GestaoCursosAdminPage() {
  const supabase = createClient();
  const [trilhas, setTrilhas] = useState<any[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [view, setView] = useState<'list' | 'manage'>('list');
  const [selectedCurso, setSelectedCurso] = useState<any>(null);

  const [isTrilhaModalOpen, setIsTrilhaModalOpen] = useState(false);
  const [isCursoModalOpen, setIsCursoModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newTrilha, setNewTrilha] = useState({ titulo: '', descricao: '' });
  const [newCurso, setNewCurso] = useState({ titulo: '', carga_horaria_horas: 40, trilha_id: '' });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    const { data: trilhasData } = await supabase.from('trilhas').select(`id, titulo, ativo, cursos:cursos(count), matriculas_trilha:user_escola(count)`).order('titulo');
    if (trilhasData) setTrilhas(trilhasData.map(t => ({ id: t.id, nome: t.titulo, cursos: t.cursos?.[0]?.count || 0, alunos: t.matriculas_trilha?.[0]?.count || 0, status: t.ativo ? 'Publicada' : 'Arquivada' })));

    const { data: cursosData } = await supabase.from('cursos').select(`id, titulo, carga_horaria_horas, ativo, modulos:modulos(count)`).order('titulo');
    if (cursosData) setCursos(cursosData.map(c => ({ id: c.id, nome: c.titulo, modulos: c.modulos?.[0]?.count || 0, autor: 'SEMED Colombo', carga: `${c.carga_horaria_horas}h`, status: c.ativo ? 'Ativo' : 'Arquivado', ativo: c.ativo })));
    setLoading(false);
  }

  const handleManageCurso = (curso: any) => { setSelectedCurso(curso); setView('manage'); };

  const filteredCursos = useMemo(() => { return cursos.filter(c => c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.includes(searchTerm)); }, [cursos, searchTerm]);

  if (view === 'manage' && selectedCurso) {
    return <CursoManager curso={selectedCurso} onBack={() => {setView('list'); fetchData();}} />;
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
           <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Matriz Formativa SEMED</h1>
           <p className="text-slate-500 font-medium text-sm">Gestão central de Trilhas Pedagógicas e Cursos da rede municipal.</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
           <button onClick={() => setIsTrilhaModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
             <LibraryBig className="w-5 h-5" /> Nova Trilha
           </button>
           <button onClick={() => setIsCursoModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-3.5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">
             <PlusCircle className="w-5 h-5" /> Novo Curso
           </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-32"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row gap-6 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight flex items-center gap-3">
                   <LayoutGrid className="w-6 h-6 text-primary" /> Catálogo de Cursos
                </h2>
                <div className="relative w-full lg:w-96"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm" /></div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                   <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 uppercase tracking-widest text-[9px] font-black">
                      <tr><th className="px-8 py-6 uppercase tracking-widest">Curso / Status</th><th className="px-8 py-6 text-right">Controles Adm</th></tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 dark:divide-slate-800/30">
                      {filteredCursos.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-all group">
                           <td className="px-8 py-6">
                              <div className="flex flex-col gap-1.5">
                                 <span className="font-black text-slate-900 dark:text-white text-lg group-hover:text-primary transition-all cursor-pointer">{c.nome}</span>
                                 <div className="flex gap-4 items-center text-xs font-bold text-slate-400"><span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[9px] font-black uppercase tracking-widest">{c.status}</span><span>{c.modulos} Módulos</span><span>{c.carga}</span></div>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right"><button onClick={() => handleManageCurso(c)} className="px-6 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg">Gerenciar Conteúdo</button></td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
      )}
    </div>
  );
}

function CursoManager({ curso, onBack }: { curso: any, onBack: () => void }) {
  const supabase = createClient();
  const [modulos, setModulos] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedModulo, setExpandedModulo] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);
  const [isQuestaoModalOpen, setIsQuestaoModalOpen] = useState(false);

  useEffect(() => { fetchModulos(); fetchQuizzes(); }, [curso.id]);

  async function fetchModulos() { setLoading(true); const { data } = await supabase.from('modulos').select(`*, aulas:aulas(*)`).eq('curso_id', curso.id).order('ordem'); if (data) setModulos(data); setLoading(false); }
  async function fetchQuizzes() { const { data } = await supabase.from('avaliacoes').select('*').eq('curso_id', curso.id); if (data) setQuizzes(data); }

  const handleAddModulo = async () => { const titulo = prompt("Título do novo módulo:"); if (!titulo) return; const { error } = await supabase.from('modulos').insert([{ curso_id: curso.id, titulo, ordem: modulos.length + 1 }]); if (!error) fetchModulos(); };
  const handleAddAula = async (moduloId: string) => { const titulo = prompt("Título da aula:"); if (!titulo) return; const { error } = await supabase.from('aulas').insert([{ modulo_id: moduloId, titulo, tipo: 'video', ordem: 1 }]); if (!error) fetchModulos(); };
  const handleAddQuiz = async () => { const titulo = prompt("Título da Avaliação:"); if (!titulo) return; const { error } = await supabase.from('avaliacoes').insert([{ curso_id: curso.id, titulo, tipo: 'prova_final' }]); if (!error) fetchQuizzes(); };

  if (selectedQuiz) {
    return <QuestaoEditor quiz={selectedQuiz} onBack={() => setSelectedQuiz(null)} />;
  }

  return (
    <div className="animate-fade-in max-w-[1200px] mx-auto pb-20 space-y-12">
       <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-4 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[1.5rem] hover:bg-slate-50 transition-all shadow-sm group text-slate-400 hover:text-primary"><ArrowLeft className="w-6 h-6" /></button>
          <div className="flex-1"><h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{curso.nome}</h2><p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Gestão de Matriz Pedagógica</p></div>
          <button onClick={handleAddModulo} className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3"><Plus className="w-5 h-5" /> Adicionar Módulo</button>
       </div>

       <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-200 lg:text-3xl uppercase tracking-tighter flex items-center gap-4"><PlayCircle className="w-8 h-8 text-primary" /> Módulos & Aulas</h3>
          {loading ? <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div> : modulos.map((modulo) => (
              <div key={modulo.id} className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
                   <div onClick={() => setExpandedModulo(expandedModulo === modulo.id ? null : modulo.id)} className="p-8 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-all"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black">{modulo.ordem}</div><h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{modulo.titulo}</h3></div><ChevronDown className={`w-6 h-6 text-slate-300 transition-transform ${expandedModulo === modulo.id ? 'rotate-180' : ''}`} /></div>
                   {expandedModulo === modulo.id && (
                      <div className="px-8 pb-8 space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                        {modulo.aulas?.map((aula: any) => (
                           <div key={aula.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 group border-l-8 border-l-primary/10">
                              <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-4 text-base">{aula.tipo === 'video' ? <Video className="w-5 h-5 text-primary" /> : <FileText className="w-5 h-5 text-emerald-500" />} {aula.titulo}</span>
                              <div className="flex gap-2">
                                 <button className="p-3 text-slate-400 hover:text-primary transition-all"><Edit2 className="w-5 h-5" /></button>
                                 <button className="p-3 text-slate-400 hover:text-red-500 transition-all"><Trash2 className="w-5 h-5" /></button>
                              </div>
                           </div>
                        ))}
                        <button onClick={() => handleAddAula(modulo.id)} className="w-full py-5 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[1.5rem] text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-primary hover:border-primary transition-all">+ Nova Aula</button>
                      </div>
                   )}
              </div>
            ))
          }
       </div>

       <div className="space-y-6 pt-12 border-t-2 border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center"><h3 className="text-xl font-black text-slate-800 dark:text-slate-200 lg:text-3xl uppercase tracking-tighter flex items-center gap-4"><HelpCircle className="w-8 h-8 text-secondary" /> Avaliações</h3><button onClick={handleAddQuiz} className="px-8 py-4 bg-secondary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-secondary/20">Criar Novo Quiz</button></div>
          {quizzes.length === 0 ? <div className="p-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] text-center text-slate-400 font-bold uppercase tracking-widest opacity-30">Nenhum Quiz Estruturado</div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {quizzes.map(quiz => (
                  <div key={quiz.id} className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all border-b-8 border-b-secondary">
                     <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-amber-100 mb-6 inline-block">{quiz.tipo}</span>
                     <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">{quiz.titulo}</h4>
                     <div className="flex gap-3">
                        <button onClick={() => setSelectedQuiz(quiz)} className="flex-1 py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all"><ListChecks className="w-4 h-4" /> Questões</button>
                        <button className="p-4 text-red-600 bg-red-50 hover:bg-red-100 rounded-2xl transition-all"><Trash2 className="w-5 h-5"/></button>
                     </div>
                  </div>
               ))}
            </div>
          )}
       </div>
    </div>
  );
}

function QuestaoEditor({ quiz, onBack }: { quiz: any, onBack: () => void }) {
  const supabase = createClient();
  const [questoes, setQuestoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchQuestoes(); }, [quiz.id]);

  async function fetchQuestoes() {
    setLoading(true);
    const { data } = await supabase.from('questoes').select(`*, alternativas(*)`).eq('avaliacao_id', quiz.id).order('ordem');
    if (data) setQuestoes(data);
    setLoading(false);
  }

  const handleAddQuestao = async () => {
    const enunciado = prompt("Enunciado da Questão:");
    if (!enunciado) return;
    const { data: questao, error } = await supabase.from('questoes').insert([{ avaliacao_id: quiz.id, enunciado, tipo: 'multipla', ordem: questoes.length + 1 }]).select().single();
    if (questao) {
       await supabase.from('alternativas').insert([
         { questao_id: questao.id, texto: 'Opção A', correta: true },
         { questao_id: questao.id, texto: 'Opção B', correta: false }
       ]);
       fetchQuestoes();
    }
  };

  return (
    <div className="animate-fade-in max-w-[1000px] mx-auto pb-20 space-y-10">
       <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-4 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-secondary"><ArrowLeft className="w-6 h-6" /></button>
          <div className="flex-1"><h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Questões: {quiz.titulo}</h2><p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Editor de Itens de Avaliação</p></div>
          <button onClick={handleAddQuestao} className="px-8 py-4 bg-secondary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"><Plus className="w-5 h-5" /> Adicionar Questão</button>
       </div>

       {loading ? <Loader2 className="animate-spin" /> : (
          <div className="space-y-6">
             {questoes.map((q, idx) => (
                <div key={q.id} className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-10 rounded-[3rem] shadow-sm relative group">
                   <div className="absolute top-8 left-0 -ml-4 w-10 h-10 bg-secondary text-white font-black rounded-xl flex items-center justify-center shadow-lg">{idx + 1}</div>
                   <div className="space-y-6">
                      <h4 className="text-xl font-black text-slate-800 dark:text-white leading-tight">{q.enunciado}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {q.alternativas?.map((alt: any) => (
                            <div key={alt.id} className={`p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${alt.correta ? 'border-emerald-500/30 bg-emerald-50/50 text-emerald-900' : 'border-slate-100 bg-slate-50 text-slate-500'}`}>
                               <span className="font-bold flex items-center gap-3">{alt.correta && <CheckCircle className="w-4 h-4 text-emerald-500" />} {alt.texto}</span>
                            </div>
                         ))}
                      </div>
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="px-5 py-2 bg-slate-100 text-slate-400 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-200 transition-all">Editar</button>
                         <button className="px-5 py-2 bg-red-100 text-red-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-200 transition-all" onClick={async () => { if(confirm("Apagar questão?")) { await supabase.from('questoes').delete().eq('id', q.id); fetchQuestoes(); } }}>Excluir</button>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       )}
    </div>
  );
}

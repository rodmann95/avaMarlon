"use client";

import { useState } from "react";
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function NovoCursoPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    carga_horaria_horas: 10,
    thumbnail_url: "",
  });

  const supabase = createClient();

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from("cursos")
        .insert([
          {
            titulo: formData.titulo,
            descricao: formData.descricao,
            carga_horaria_horas: formData.carga_horaria_horas,
            thumbnail_url: formData.thumbnail_url,
            ativo: true,
          }
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      setSuccess(true);
      // Redirecionaria para o construtor arrastar/soltar módulos
      window.location.href = `/dashboard/admin/cursos/${data.id}/builder`;
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao salvar o curso no banco de dados.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/dashboard/admin/cursos" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar para a lista
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-black text-slate-900 dark:text-white">Criar Novo Curso</h2>
           <p className="text-slate-500 text-sm">Preencha os dados básicos antes de subir os vídeos e PDFs.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">{error}</div>
        )}
        
        <form onSubmit={handleSalvar} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Título Formativo</label>
            <input 
              required type="text" 
              value={formData.titulo}
              onChange={e => setFormData({...formData, titulo: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" 
              placeholder="Ex: Metodologias Ativas na Educação Infantil" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Resumo / Descrição do Conteúdo</label>
            <textarea 
              required
              rows={4}
              value={formData.descricao}
              onChange={e => setFormData({...formData, descricao: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none" 
              placeholder="Descreva o que o educador irá aprender..." 
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Carga Horária (em horas)</label>
              <input 
                required type="number" min="1" max="500"
                value={formData.carga_horaria_horas}
                onChange={e => setFormData({...formData, carga_horaria_horas: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">URL da Imagem de Capa (Thumbnail)</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="url" 
                  value={formData.thumbnail_url}
                  onChange={e => setFormData({...formData, thumbnail_url: e.target.value})}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" 
                  placeholder="https://exemplo.com/imagem.png" 
                />
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 md:relative md:mt-8 p-4 md:p-0 bg-white md:bg-transparent border-t md:border-t-0 border-slate-200 flex justify-end gap-4 z-20 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] md:shadow-none">
            <Link href="/dashboard/admin/cursos" className="px-6 py-3 font-semibold text-slate-500 hover:text-slate-800 transition-colors">Cancelar</Link>
            <button 
              type="submit" 
              disabled={loading || success}
              className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/70 text-white rounded-xl font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
              {success ? "Salvo com sucesso!" : "Salvar e Continuar para Módulos"}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

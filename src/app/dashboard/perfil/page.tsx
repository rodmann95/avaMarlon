"use client";

import { useState } from "react";
import { UserCircle, Camera, Upload, Lock, ShieldCheck, Mail, Save, Clock, Calendar, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function PerfilPage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // MOCKADOS: Vamos consumir dados do DB V2 futuramente
  const [perfil, setPerfil] = useState({
     nome: "Gabrielle Admin",
     cpf: "000.000.000-00",
     email: "gabrielle.teste@gmail.com",
     telefone: "(41) 99999-9999",
     escola: "Sede - SEMED",
     cargo: "Gestão SEMED",
     role: "Administrador",
     avatar_url: ""
  });

  const supabase = createClient();

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // API Call p/ Update na public.users
    setTimeout(() => {
       setLoading(false);
       setSuccess(true);
    }, 1000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // 1. Faria o Upload para o Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `user-avatar-${Math.random()}.${fileExt}`;
      
      /* CÓDIGO REAL DESCOMENTADO QUANDO O BUCKET 'avatars' EXISTIR:
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: imageUrl } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      setPerfil({...perfil, avatar_url: imageUrl.publicUrl});
      */

      // Mock
      setTimeout(() => {
         setPerfil({...perfil, avatar_url: URL.createObjectURL(file)});
         setUploading(false);
      }, 1500)

    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <UserCircle className="w-8 h-8 text-primary" /> Meu Perfil
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
          Gerencie seus dados pessoais, foto de perfil e visualize sua trajetória desde o primeiro dia de acesso 
          ao ambiente formador da SEMED.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Coluna Esquerda: Foto + Trajetória */}
        <div className="space-y-8">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm flex flex-col items-center text-center">
             
             {/* Upload de Imagem */}
             <div className="relative group mb-6">
                <div className="w-40 h-40 rounded-full border-4 border-slate-50 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-xl overflow-hidden flex items-center justify-center relative">
                   {perfil.avatar_url ? (
                     <img src={perfil.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                     <UserCircle className="w-20 h-20 text-slate-400" />
                   )}
                   
                   {/* Botão Hover de Troca */}
                   <label className={`absolute inset-0 bg-black/50 cursor-pointer flex-col items-center justify-center text-white transition-opacity ${uploading ? 'opacity-100 flex' : 'opacity-0 group-hover:opacity-100 flex'}`}>
                      {uploading ? (
                         <div className="animate-spin rounded-full border-2 border-white border-t-transparent w-6 h-6"></div>
                      ) : (
                         <>
                           <Camera className="w-6 h-6 mb-1" />
                           <span className="text-xs font-bold uppercase tracking-wider">Alterar</span>
                         </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload} 
                        disabled={uploading}
                      />
                   </label>
                </div>

                <div className="absolute bottom-1 right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-900">
                   <Upload className="w-4 h-4" />
                </div>
             </div>

             <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{perfil.nome}</h2>
             <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                {perfil.role}
             </span>
             
             <p className="text-slate-500 text-sm">{perfil.escola}</p>

             <button className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all text-sm border border-slate-200 dark:border-slate-700">
               <Lock className="w-4 h-4" /> Alterar Senha de Acesso
             </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-xl text-white relative overflow-hidden">
             {/* Decorator */}
             <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none"></div>
             
             <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
               <Calendar className="w-5 h-5 text-secondary" /> Minha Trajetória
             </h3>
             
             <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Membro Desde</span>
                  <div className="font-bold flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> 15 de Fevereiro de 2026
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Último Acesso</span>
                  <div className="font-bold flex items-center gap-2 text-slate-200">
                    <Clock className="w-4 h-4 text-primary" /> Hoje, às 08:30 (Sessão Ativa)
                  </div>
                </div>

                <div className="flex flex-col gap-1 pt-4 border-t border-slate-800 text-sm">
                  <p className="text-slate-300">
                    Você já coleciona **45 dias** de interações na plataforma. O seu engajamento ajuda a transformar a educação em Colombo!
                  </p>
                </div>
             </div>
          </div>

        </div>

        {/* Coluna Direita: Formulários */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 md:p-10 shadow-sm">
             
             <div className="flex items-center gap-2 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-6 h-6 text-primary" /> 
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Dados Oficiais</h3>
             </div>

             <form onSubmit={handleUpdate} className="space-y-6">
                
                {/* DADOS NÃO EDITÁVEIS PELO CURSISTA (BLOQUEADOS) */}
                <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 mb-8">
                   <div className="flex items-center gap-3 text-slate-500 text-sm font-semibold mb-2">
                     <Lock className="w-4 h-4" /> Informações controladas e mantidas pela gestão SEMED
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Seu E-mail (Identificação principal)</label>
                        <div className="px-5 py-3.5 bg-slate-200/50 dark:bg-slate-900 rounded-xl text-slate-500 flex items-center gap-3 cursor-not-allowed">
                          <Mail className="w-4 h-4" /> {perfil.email}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Seu CPF (Sigiloso)</label>
                        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-200/50 dark:bg-slate-900 rounded-xl text-slate-500 cursor-not-allowed">
                          <span>***.***.***-**</span> <Lock className="w-4 h-4" />
                        </div>
                      </div>
                   </div>
                </div>

                {/* DADOS EDITÁVEIS */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nome de Exibição (Certificados)</label>
                      <input 
                        type="text" 
                        value={perfil.nome}
                        onChange={e => setPerfil({...perfil, nome: e.target.value})}
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium text-slate-900 dark:text-white" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Telefone / WhatsApp</label>
                      <input 
                        type="text" 
                        value={perfil.telefone}
                        onChange={e => setPerfil({...perfil, telefone: e.target.value})}
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium text-slate-900 dark:text-white" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Escola de Lotação Principal</label>
                      <input 
                        type="text" 
                        value={perfil.escola}
                        onChange={e => setPerfil({...perfil, escola: e.target.value})}
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium text-slate-900 dark:text-white" 
                      />
                    </div>
                  </div>
                </div>

                {/* RODAPÉ DO FORMULÁRIO */}
                <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  
                  <div className="text-sm font-medium">
                     {success && <span className="text-green-600 dark:text-green-400 flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> Dados salvos!</span>}
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary/90 disabled:bg-primary/70 text-white rounded-xl font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    {loading ? <div className="animate-spin rounded-full border-2 border-white border-t-transparent w-5 h-5"></div> : <Save className="w-5 h-5" />} 
                    Salvar Alterações
                  </button>
                </div>

             </form>
          </div>
        </div>

      </div>
    </div>
  );
}

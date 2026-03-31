"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf, GraduationCap, ArrowRight, ArrowLeft, CheckCircle2, User, Briefcase, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function CadastroPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aceiteLGPD, setAceiteLGPD] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    telefone: "",
    cargo: "",
    escola: "",
  });

  const supabase = createClient();

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.nome || !formData.cpf || !formData.email || !formData.senha) {
        setError("Preencha todos os campos obrigatórios.");
        return;
      }
      // Validação simples de CPF (somente length)
      if (formData.cpf.replace(/\\D/g, "").length !== 11) {
        setError("CPF inválido. Digite 11 números.");
        return;
      }
    }
    setError(null);
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cargo || !formData.escola) {
      setError("Preencha todos os campos profissionais.");
      return;
    }
    if (!aceiteLGPD) {
      setError("Você deve ler e aceitar os Termos e Políticas de Privacidade (LGPD) para prosseguir com o registro do seu CPF.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          data: {
            nome: formData.nome,
            cpf: formData.cpf.replace(/\\D/g, ""),
            cargo: formData.cargo,
            telefone: formData.telefone,
            role: "cursista"
          }
        }
      });

      if (signUpError) throw signUpError;
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Erro ao realizar cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden z-10 border border-slate-100 dark:border-slate-800">
        
        {success ? (
           <div className="p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Cadastro concluído!</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Uma mensagem de confirmação foi enviada para o seu e-mail <strong>{formData.email}</strong>. 
                Por favor, acesse seu e-mail para validar a conta antes de tentar logar.
              </p>
              <div className="pt-4">
                <Link href="/login" className="inline-block px-8 py-3 bg-primary text-white rounded-xl font-semibold shadow hover:bg-primary/90 transition-all">
                  Ir para o Login
                </Link>
              </div>
           </div>
        ) : (
          <div className="p-8">
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg">
                <Leaf className="w-6 h-6 absolute mb-1 ml-1" />
                <GraduationCap className="w-6 h-6 z-10 relative opacity-90 pb-1 pr-1" />
              </Link>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Crie sua conta de Educador
              </h2>
              <p className="text-slate-500 text-sm mt-1">Leva apenas um minuto para começar sua jornada.</p>
            </div>

            {/* Progress/Wizard Indicator */}
            <div className="flex items-center justify-center mb-8 relative">
              <div className="absolute left-1/2 -translate-x-1/2 top-4 h-0.5 w-24 bg-slate-200 dark:bg-slate-800 -z-10"></div>
              <div className={`absolute left-1/2 -translate-x-1/2 top-4 h-0.5 w-24 bg-primary -z-10 transition-all duration-500 ease-in-out ${step === 2 ? "scale-x-100" : "scale-x-0 origin-left"}`}></div>
              
              <div className="flex justify-between w-40">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${step >= 1 ? "bg-primary border-primary text-white" : "bg-white border-slate-300 text-slate-400"}`}>
                    1
                  </div>
                  <span className={`text-xs font-semibold ${step >= 1 ? "text-primary" : "text-slate-400"}`}>Pessoal</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${step >= 2 ? "bg-primary border-primary text-white" : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400"}`}>
                    2
                  </div>
                  <span className={`text-xs font-semibold ${step >= 2 ? "text-primary" : "text-slate-400"}`}>Profissional</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800 text-center">
                {error}
              </div>
            )}

            <form onSubmit={step === 1 ? handleNextStep : handleFinalSubmit}>
              <div className={`space-y-4 transition-all duration-500 ${step !== 1 ? "hidden" : "block animate-fade-in"}`}>
                <div className="flex items-center gap-2 mb-4 text-primary pb-2 border-b border-slate-100 dark:border-slate-800">
                  <User className="w-5 h-5"/> <h3 className="font-semibold">Dados Pessoais</h3>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nome completo</label>
                  <input type="text" required value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-gray-100" placeholder="Seu nome"/>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">CPF</label>
                    <input type="text" required value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-gray-100" placeholder="000.000.000-00"/>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Telefone</label>
                    <input type="text" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-gray-100" placeholder="(41) 90000-0000"/>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">E-mail</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-gray-100" placeholder="email@edu.colombo.pr.gov.br"/>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Senha</label>
                  <input type="password" required value={formData.senha} onChange={e => setFormData({...formData, senha: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-gray-100" placeholder="••••••••"/>
                </div>

                <button type="submit" className="w-full mt-6 py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
                  Próxima etapa <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <form onSubmit={handleFinalSubmit}>
              <div className={`space-y-4 transition-all duration-500 ${step !== 2 ? "hidden" : "block animate-fade-in"}`}>
                <div className="flex items-center gap-2 mb-4 text-secondary pb-2 border-b border-slate-100 dark:border-slate-800">
                  <Briefcase className="w-5 h-5"/> <h3 className="font-semibold">Dados Profissionais</h3>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Cargo Corporativo</label>
                  <select required value={formData.cargo} onChange={e => setFormData({...formData, cargo: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-gray-100 appearance-none">
                    <option value="" disabled>Selecione seu cargo...</option>
                    <option value="Professor">Professor(a)</option>
                    <option value="Coordenador">Coordenador(a)</option>
                    <option value="Diretor">Diretor(a)</option>
                    <option value="Pedagogo">Pedagogo(a)</option>
                    <option value="Outro">Outro cargo</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Escola / Unidade Lotação</label>
                  <input type="text" required value={formData.escola} onChange={e => setFormData({...formData, escola: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-gray-100" placeholder="Nome da Escola (ex: Escola M. Gabriel de Lara)"/>
                  <p className="text-xs text-slate-500 mt-1">Busque pelo nome da sua unidade principal.</p>
                </div>

                <div className="flex items-start gap-3 mt-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <input 
                    type="checkbox" 
                    id="termos" 
                    className="mt-1 flex-shrink-0 w-4 h-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-700 rounded cursor-pointer"
                    checked={aceiteLGPD}
                    onChange={(e) => setAceiteLGPD(e.target.checked)}
                  />
                  <label htmlFor="termos" className="text-[11px] leading-tight text-slate-600 dark:text-slate-400 cursor-pointer">
                    Declaro, consoante à Lei Geral de Proteção de Dados (LGPD), que concordo com a coleta, gravação e tratamento do meu CPF e e-mail pelo corpo da Secretaria de Educação Brasileira de Colombo exclusivamente para os fins acadêmicos e auditoria de Certificação.
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => { setStep(1); setError(null); }} className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 py-3 px-4 bg-secondary hover:bg-secondary/90 disabled:bg-secondary/60 text-white rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 transition-colors">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Finalizar Cadastro"}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-8 text-center bg-slate-50 dark:bg-slate-900/50 p-4 -mx-8 -mb-8 border-t border-slate-100 dark:border-slate-800 rounded-b-3xl">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Já possui conta? <Link href="/login" className="font-semibold text-primary hover:text-primary/80">Entrar na plataforma</Link>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

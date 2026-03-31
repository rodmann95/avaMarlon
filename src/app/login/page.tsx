"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf, GraduationCap, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Esta função fará o login real quando a plataforma estiver completa
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Email ou senha inválidos.");
      } else {
        // Redireciona para o dashboard
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("Ocorreu um erro ao conectar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      
      {/* Decoração de fundo brandings */}
      <div className="absolute top-0 left-0 w-full h-96 bg-primary/90 rounded-b-[4rem] shadow-xl z-0 transform -translate-y-20"></div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-100 dark:border-slate-800">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg mb-4 hover:scale-105 transition-transform">
              <Leaf className="w-7 h-7 absolute mb-1 ml-1" />
              <GraduationCap className="w-7 h-7 z-10 relative opacity-90 pb-1 pr-1" />
            </Link>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Acesse sua conta</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 text-center">
              Bem-vindo(a) de volta à EduFormação
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-800">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                E-mail institucional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-slate-900 dark:text-slate-100"
                  placeholder="seu.nome@edu.colombo.pr.gov.br"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Senha
                </label>
                <Link href="#" className="text-sm text-primary hover:text-primary/80 font-medium">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-slate-900 dark:text-slate-100"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-primary hover:bg-primary/90 disabled:bg-primary/70 text-white rounded-xl font-semibold shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Entrar na Plataforma
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center bg-slate-50 dark:bg-slate-900/50 p-4 -mx-8 -mb-8 border-t border-slate-100 dark:border-slate-800 rounded-b-3xl">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Primeiro acesso ou não tem conta?{" "}
              <Link href="/cadastro" className="font-semibold text-secondary hover:text-secondary/80">
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

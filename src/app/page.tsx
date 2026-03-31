import Link from "next/link";
import { GraduationCap, ArrowRight, Leaf, Sparkles } from "lucide-react";

export default function LandingPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-primary/5 dark:from-slate-950 dark:via-slate-900 dark:to-primary/10 flex flex-col items-center justify-between relative overflow-hidden">
      
      {/* Background Decorative Blob */}
      <div className="absolute top-0 right-0 p-24 lg:p-48 opacity-20 pointer-events-none">
        <div className="w-96 h-96 bg-primary rounded-full blur-[100px] animate-pulse"></div>
      </div>
      <div className="absolute bottom-0 left-0 p-24 lg:p-48 opacity-20 pointer-events-none">
        <div className="w-96 h-96 bg-secondary rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      {/* Header Centralizado */}
      <header className="w-full max-w-7xl mx-auto p-6 md:p-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg overflow-hidden">
            <Leaf className="w-6 h-6 absolute mb-1 ml-1" />
            <GraduationCap className="w-6 h-6 z-10 relative opacity-90 pb-1 pr-1" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Edu<span className="text-primary font-extrabold">Formação</span>
          </h1>
        </div>
        
        {/* Call to action no header */}
        <div className="hidden sm:flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-sm font-semibold text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-primary-foreground transition-colors"
          >
            Já tenho conta
          </Link>
          <Link 
            href="/cadastro" 
            className="text-sm font-semibold px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-full shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            Cadastre-se
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col lg:flex-row items-center justify-center gap-12 z-10 flex-1">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-secondary-foreground text-sm font-semibold border border-secondary/20 shadow-sm animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>Formação Continuada de Excelência</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Ambiente Virtual de Aprendizagem <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              SEMED Colombo
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Plataforma moderna, interativa e acessível. Potencialize suas práticas pedagógicas através das nossas trilhas de conhecimento estruturadas para a rede municipal.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2 group"
            >
              Entrar na plataforma
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/cadastro" 
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:border-secondary dark:hover:border-secondary rounded-2xl font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center"
            >
              Primeiro acesso
            </Link>
          </div>
        </div>

        {/* Feature/Mockup visual placeholder */}
        <div className="flex-1 w-full max-w-lg relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[2rem] transform rotate-3 scale-105 transition-transform duration-500 group-hover:rotate-6"></div>
          <div className="relative flex flex-col h-full min-h-[400px] w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-2xl p-8 overflow-hidden z-10 glassmorphism">
            
            {/* Elementos visuais lúdicos representando o "dashboard" */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">ED</span>
              </div>
              <div>
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-full mb-2 animate-pulse"></div>
                <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse delay-75"></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-32 w-full bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-slate-100 dark:border-slate-800/60 p-6 flex flex-col justify-end">
                 <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700/50 rounded-full mb-3"></div>
                 <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700/50 rounded-full"></div>
              </div>
              <div className="flex gap-4">
                <div className="h-24 flex-1 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800"></div>
                <div className="h-24 flex-1 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800"></div>
              </div>
            </div>

            {/* Glass Blur overlay base */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <p>© {currentYear} EduFormação. Todos os direitos reservados.</p>
          <div className="flex items-center gap-1 mt-2 sm:mt-0 font-medium text-slate-700 dark:text-slate-300">
            SEMED — Secretaria Municipal de Educação de Colombo/PR
          </div>
        </div>
      </footer>
    </div>
  );
}

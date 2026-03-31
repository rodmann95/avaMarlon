"use client";

import { useEffect, useState } from "react";
import { X, Share, PlusSquare } from "lucide-react";

export default function PwaRegisterAndBanner() {
  const [showIosBanner, setShowIosBanner] = useState(false);

  useEffect(() => {
    // 1. REGISTRAR O SERVICE WORKER PARA CACHE E OFFLINE
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("PWA Service Worker ativado!", reg.scope))
        .catch((err) => console.log("Falha no SW", err));
    }

    // 2. DETECTAR IOS PARA BANNER DE INSTRUÇÃO MANUAL
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    // Detectar se já está rodando standalone (salvo no celular)
    const isInStandaloneMode = () => 
      ("standalone" in window.navigator && (window.navigator as any).standalone) ||
      window.matchMedia("(display-mode: standalone)").matches;

    // Se for iOS e não tiver instalado, mostramos instrução.
    // Usamos sessionStorage pra não ficar chato exibindo toda hora caso ele feche
    if (isIos() && !isInStandaloneMode() && !sessionStorage.getItem("iosPwaBannerClosed")) {
      setShowIosBanner(true);
    }
  }, []);

  const closeBanner = () => {
    setShowIosBanner(false);
    sessionStorage.setItem("iosPwaBannerClosed", "true");
  };

  if (!showIosBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-slate-900 text-white p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] animate-fade-in-up md:hidden border-t-4 border-secondary">
       <button onClick={closeBanner} className="absolute right-4 top-4 p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors">
         <X className="w-5 h-5"/>
       </button>
       <div className="flex gap-4 pr-6">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg border-2 border-white/10 flex-shrink-0">
             EF
          </div>
          <div className="flex-1 text-sm">
             <h4 className="font-bold text-base mb-1">Instale o nosso Aplicativo</h4>
             <p className="text-slate-300 mb-3 text-xs leading-relaxed">
               Adicione o EduFormação à sua tela de início para acesso rápido, tela cheia e mídias visuais offline.
             </p>
             <div className="flex items-center gap-1.5 bg-slate-800 p-2.5 rounded-lg border border-slate-700 text-xs font-semibold">
                Toque no <Share className="w-4 h-4 text-blue-400 mx-1"/> e depois em <strong className="text-white flex items-center gap-1"><PlusSquare className="w-4 h-4 text-slate-400"/> Adicionar à Tela</strong>
             </div>
          </div>
       </div>
    </div>
  );
}

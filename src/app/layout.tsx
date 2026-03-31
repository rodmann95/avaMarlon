import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PwaRegisterAndBanner from "@/components/PwaRegisterAndBanner"; // Nosso Novo Injetor

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Parâmetros obrigatórios de Responsividade PWA / WCAG 2.1 e Meta-Tags da Apple
export const viewport: Viewport = {
  themeColor: "#1B4F72",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Não bloquear scale acessibilidade mas otimizar base
};

export const metadata: Metadata = {
  title: "EduFormação | Ambiente Virtual de Aprendizagem",
  description: "Formação continuada de educadores municipais da SEMED Colombo/PR.",
  manifest: "/manifest.json", 
  appleWebApp: {
    capable: true,
    title: "EduFormação",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/icon-192x192.png" // Ícone que a Apple vai forçar lá
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
         // Força background para evitar 'flash branco' e ativa font rendering suave (antialiased)
        className={`${inter.variable} min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-primary/20 dark:bg-slate-950 dark:text-white`}
      >
        {/* WCAG SKIP LINK: Acessibilidade Nível AA - Apenas leitores de tela interagem / foca pra Main */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:p-4 focus:bg-primary focus:text-white focus:rounded-xl focus:font-bold focus:shadow-2xl"
        >
          Pular para o conteúdo principal
        </a>

        {/* Carga Invisivel Caching / e Banners PWA iOS */}
        <PwaRegisterAndBanner />

        {/* O container ganha id Main Content para que o blind reader caia aqui nativamente */}
        <div id="main-content">
           {children}
        </div>

      </body>
    </html>
  );
}

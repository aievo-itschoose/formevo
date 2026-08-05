import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

const goldplay = localFont({
  variable: "--font-goldplay",
  src: [
    { path: "./fonts/Goldplay-Thin.ttf", weight: "100", style: "normal" },
    { path: "./fonts/Goldplay-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/Goldplay-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Goldplay-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Goldplay-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Goldplay-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Goldplay-Black.ttf", weight: "900", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Formulário Evo",
  description: "Painel e formulário de implantação Evo",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${goldplay.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0a0a0f] text-white">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

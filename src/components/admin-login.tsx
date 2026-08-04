"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password === "evo2026") {
      document.cookie = "evo-admin-auth=true; path=/; max-age=3600";
      toast.success("Acesso liberado.");
      router.push("/admin/perguntas");
      return;
    }
    toast.error("Senha incorreta.");
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-3xl border border-white/10 bg-[#111118] p-8 shadow-2xl shadow-black/30">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-[#a65df9]">Admin Evo</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Acesso ao painel</h1>
        <p className="mt-2 text-sm text-zinc-400">Use a senha única para entrar.</p>
      </div>
      <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Digite a senha" className="rounded-2xl border border-white/10 bg-[#0a0a0f] px-4 py-3 text-white outline-none" />
      <button type="submit" className="rounded-full bg-[#7d4af9] px-4 py-2 font-medium text-white transition hover:bg-[#a65df9]">Entrar</button>
    </form>
  );
}

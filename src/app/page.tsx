import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,74,249,0.18),_transparent_30%)] px-6 py-16 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <section className="rounded-[2rem] border border-white/10 bg-[#111118]/90 p-8 shadow-2xl shadow-black/30">
          <img src="/evo_ia_roxo.png" alt="Evo" className="h-9 w-auto" />
          <p className="mt-4 text-sm uppercase tracking-[0.35em] text-[#a65df9]">Formulário Evo</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Implantação, configuração e acompanhamento em um só fluxo.</h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-400">Use este projeto para coletar dados operacionais do cliente, montar o agente e acompanhar o status da implantação via painel interno.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/implantacao/vale-1001" className="rounded-full bg-[#7d4af9] px-5 py-3 font-medium text-white transition hover:bg-[#a65df9]">Abrir formulário demo</Link>
            <Link href="/admin" className="rounded-full border border-white/10 px-5 py-3 font-medium text-zinc-300 transition hover:border-[#7d4af9] hover:text-white">Entrar no admin</Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#111118] p-6">
            <h2 className="text-xl font-semibold">Formulário público</h2>
            <p className="mt-2 text-sm text-zinc-400">Link único por cliente, perguntas condicionais por plano e skill e coleta de respostas estruturada.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#111118] p-6">
            <h2 className="text-xl font-semibold">Admin</h2>
            <p className="mt-2 text-sm text-zinc-400">Gerencie blocos, reordene perguntas e crie novas implantações com token único.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#111118] p-6">
            <h2 className="text-xl font-semibold">Status e exportação</h2>
            <p className="mt-2 text-sm text-zinc-400">Acompanhe cada cliente, marque como concluído e visualize respostas agrupadas por bloco.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

const responses = [
  {
    bloco: "Identidade e tom",
    perguntas: [
      { titulo: "Como o agente deve se apresentar?", valor: "De forma acolhedora e objetiva." },
      { titulo: "Em três palavras, como a associação quer ser percebida na conversa?", valor: "Confiável, humana e prática." },
    ],
  },
  {
    bloco: "Planos e produtos",
    perguntas: [
      { titulo: "Nome do plano", valor: "Plano Essencial" },
      { titulo: "Valor da mensalidade", valor: "R$ 89,90" },
    ],
  },
];

export default async function ClienteResponsesPage({ params }: { params: Promise<{ clienteId: string }> }) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("evo-admin-auth")?.value === "true";

  if (!isLoggedIn) {
    redirect("/admin");
  }

  const { clienteId } = await params;

  if (!clienteId) {
    return <div className="p-8 text-white">Cliente não encontrado.</div>;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,74,249,0.18),_transparent_30%)] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl border border-white/10 bg-[#111118] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#a65df9]">Respostas</p>
              <h1 className="text-2xl font-semibold text-white">Cliente {clienteId}</h1>
            </div>
            <Link href="/admin/respostas" className="rounded-full border border-white/10 px-3 py-2 text-sm text-zinc-300">Voltar à lista</Link>
          </div>
        </div>

        {responses.map((bloco) => (
          <section key={bloco.bloco} className="rounded-2xl border border-white/10 bg-[#111118] p-6">
            <h2 className="text-xl font-semibold text-white">{bloco.bloco}</h2>
            <div className="mt-4 space-y-3">
              {bloco.perguntas.map((pergunta) => (
                <div key={pergunta.titulo} className="rounded-2xl border border-white/10 bg-[#0a0a0f] p-4">
                  <p className="text-sm text-zinc-400">{pergunta.titulo}</p>
                  <p className="mt-2 text-sm text-white">{pergunta.valor}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { ClientRecord } from "@/types/form";

const clients: ClientRecord[] = [
  {
    id: "cliente-1",
    nome: "Associação do Vale",
    token: "vale-1001",
    plano: "SCALE",
    temIntegracao: true,
    sistemaIntegracao: "Power",
    skillsAtivas: ["COMERCIAL", "SAC"],
    status: "EM_ANDAMENTO",
    criadoEm: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "cliente-2",
    nome: "Liga Norte",
    token: "norte-2002",
    plano: "TEAM",
    temIntegracao: false,
    skillsAtivas: ["COBRANCA", "REATIVACAO", "INDICACAO"],
    status: "NAO_INICIADO",
    criadoEm: "2026-08-02T14:00:00.000Z",
  },
];

export default async function AdminRespostasPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("evo-admin-auth")?.value === "true";

  if (!isLoggedIn) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,74,249,0.18),_transparent_30%)] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl border border-white/10 bg-[#111118] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#a65df9]">Respostas</p>
              <h1 className="text-2xl font-semibold text-white">Implantações recebidas</h1>
            </div>
            <Link href="/admin/perguntas" className="rounded-full border border-white/10 px-3 py-2 text-sm text-zinc-300">Voltar ao admin</Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111118] p-6">
          <div className="grid gap-3">
            {clients.map((client) => (
              <div key={client.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0a0a0f] p-4">
                <div>
                  <p className="font-semibold text-white">{client.nome}</p>
                  <p className="mt-1 text-sm text-zinc-400">Plano: {client.plano} • Status: {client.status}</p>
                  <p className="mt-1 text-xs text-zinc-500">Última resposta: {client.criadoEm}</p>
                </div>
                <Link href={`/admin/respostas/${client.id}`} className="rounded-full bg-[#7d4af9] px-4 py-2 text-sm font-medium text-white">Ver respostas</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

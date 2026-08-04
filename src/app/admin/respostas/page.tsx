import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

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
          <p className="text-sm text-zinc-400">Nenhuma implantação real cadastrada ainda.</p>
        </div>
      </div>
    </main>
  );
}

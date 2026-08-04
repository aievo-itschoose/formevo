import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminPanel } from "@/components/admin-panel";

export default async function AdminPerguntasPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("evo-admin-auth")?.value === "true";

  if (!isLoggedIn) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,74,249,0.18),_transparent_30%)] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <AdminPanel view="perguntas" />
      </div>
    </main>
  );
}

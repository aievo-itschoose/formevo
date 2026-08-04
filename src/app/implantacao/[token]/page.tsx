import { PublicForm } from "@/components/public-form";

interface ImplantacaoPageProps {
  params: Promise<{ token: string }>;
}

export default async function ImplantacaoPage({ params }: ImplantacaoPageProps) {
  const { token } = await params;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,74,249,0.18),_transparent_30%)] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <PublicForm token={token} />
      </div>
    </main>
  );
}

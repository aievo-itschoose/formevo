import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Skill } from "@/types/form";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const cliente = await prisma.cliente.findUnique({
    where: { token },
    include: { perguntas: { orderBy: { ordem: "asc" } } },
  });

  if (!cliente) {
    return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    id: cliente.id,
    nome: cliente.nome,
    token: cliente.token,
    plano: cliente.plano,
    temIntegracao: cliente.temIntegracao,
    sistemaIntegracao: cliente.sistemaIntegracao ?? undefined,
    skillsAtivas: cliente.skillsAtivas as Skill[],
    nicho: cliente.nicho as "veicular" | "outro",
    status: cliente.status,
    criadoEm: cliente.criadoEm.toISOString(),
    perguntasExtras: cliente.perguntas,
  });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Skill } from "@/types/form";

export async function GET() {
  const blocos = await prisma.bloco.findMany({
    orderBy: { ordem: "asc" },
    include: {
      perguntas: {
        where: { clienteId: null },
        orderBy: { ordem: "asc" },
      },
    },
  });

  const payload = blocos.map((bloco) => ({
    id: bloco.id,
    titulo: bloco.titulo,
    ordem: bloco.ordem,
    skillVinculada: bloco.skillVinculada as Skill | null,
    perguntas: bloco.perguntas,
  }));

  return NextResponse.json(payload);
}

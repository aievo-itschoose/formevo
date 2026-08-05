import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { QuestionType } from "@/types/form";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json() as { texto: string; tipo: QuestionType; obrigatoria: boolean };

  if (!body.texto?.trim()) {
    return NextResponse.json({ error: "Texto é obrigatório" }, { status: 400 });
  }

  const count = await prisma.pergunta.count({ where: { clienteId: id } });

  const pergunta = await prisma.pergunta.create({
    data: {
      texto: body.texto.trim(),
      tipo: body.tipo,
      obrigatoria: body.obrigatoria,
      ordem: count + 1,
      repetivel: false,
      opcoes: [],
      clienteId: id,
      blocoId: (await getOrCreateExtraBlockId()),
    },
  });

  return NextResponse.json(pergunta);
}

let cachedExtraBlockId: string | null = null;

async function getOrCreateExtraBlockId() {
  if (cachedExtraBlockId) return cachedExtraBlockId;

  const existing = await prisma.bloco.findFirst({ where: { titulo: "Perguntas adicionais" } });
  if (existing) {
    cachedExtraBlockId = existing.id;
    return existing.id;
  }

  const created = await prisma.bloco.create({
    data: { titulo: "Perguntas adicionais", ordem: 999, skillVinculada: null },
  });
  cachedExtraBlockId = created.id;
  return created.id;
}

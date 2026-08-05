import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await prisma.resposta.deleteMany({ where: { perguntaId: id } });
  await prisma.pergunta.delete({ where: { id } });

  return NextResponse.json({ ok: true, id });
}

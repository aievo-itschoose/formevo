import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json() as {
    clienteId: string;
    respostas: Array<{ perguntaId: string; valor: string; grupoRepeticao?: number }>;
  };

  if (!body.clienteId || !Array.isArray(body.respostas)) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.resposta.deleteMany({ where: { clienteId: body.clienteId } }),
    prisma.resposta.createMany({
      data: body.respostas
        .filter((resposta) => resposta.valor !== undefined && resposta.valor !== null && resposta.valor !== "")
        .map((resposta) => ({
          clienteId: body.clienteId,
          perguntaId: resposta.perguntaId,
          valor: String(resposta.valor),
          grupoRepeticao: resposta.grupoRepeticao ?? null,
        })),
    }),
  ]);

  return NextResponse.json({ ok: true });
}

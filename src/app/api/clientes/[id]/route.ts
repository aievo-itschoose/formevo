import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { StatusImplantacao } from "@/types/form";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json() as { status: StatusImplantacao };

  const cliente = await prisma.cliente.update({
    where: { id },
    data: { status: body.status },
  });

  return NextResponse.json({ id: cliente.id, status: cliente.status });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await prisma.resposta.deleteMany({ where: { clienteId: id } });
  await prisma.pergunta.deleteMany({ where: { clienteId: id } });
  await prisma.cliente.delete({ where: { id } });

  return NextResponse.json({ ok: true, id });
}

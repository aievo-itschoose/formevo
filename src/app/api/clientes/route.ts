import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Plano, Skill } from "@/types/form";

function slugifyToken(nome: string) {
  return `${nome.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;
}

export async function GET() {
  const clientes = await prisma.cliente.findMany({
    orderBy: { criadoEm: "desc" },
    include: { perguntas: { orderBy: { ordem: "asc" } } },
  });

  const payload = clientes.map((cliente) => ({
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
  }));

  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  const body = await request.json() as {
    nome: string;
    plano: Plano;
    skillsAtivas: Skill[];
    nicho: "veicular" | "outro";
  };

  if (!body.nome?.trim()) {
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  }

  const cliente = await prisma.cliente.create({
    data: {
      nome: body.nome.trim(),
      token: slugifyToken(body.nome),
      plano: body.plano,
      skillsAtivas: body.skillsAtivas,
      nicho: body.nicho,
    },
  });

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
    perguntasExtras: [],
  });
}

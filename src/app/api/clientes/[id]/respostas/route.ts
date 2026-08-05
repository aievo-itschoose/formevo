import { NextResponse } from "next/server";
import { getClientAnswersSummary } from "@/lib/client-answers";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const summary = await getClientAnswersSummary(id);
  if (!summary) {
    return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
  }

  return NextResponse.json(summary);
}

import { NextResponse } from "next/server";
import { deleteQuestion } from "@/lib/admin-store";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteQuestion(id);
  return NextResponse.json({ ok: true, id });
}

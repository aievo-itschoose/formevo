import { prisma } from "@/lib/prisma";

export async function getClientAnswersSummary(clienteId: string) {
  const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
  if (!cliente) return null;

  const blocos = await prisma.bloco.findMany({
    orderBy: { ordem: "asc" },
    include: {
      perguntas: {
        where: { OR: [{ clienteId: null }, { clienteId }] },
        orderBy: { ordem: "asc" },
      },
    },
  });

  const respostas = await prisma.resposta.findMany({
    where: { clienteId },
    orderBy: [{ grupoRepeticao: "asc" }, { criadoEm: "asc" }],
  });
  const respostasPorPergunta = new Map<string, string[]>();
  for (const resposta of respostas) {
    const valores = respostasPorPergunta.get(resposta.perguntaId) ?? [];
    valores.push(resposta.valor);
    respostasPorPergunta.set(resposta.perguntaId, valores);
  }

  const blocosComRespostas = blocos
    .map((bloco) => {
      const matchesSkill = !bloco.skillVinculada || cliente.skillsAtivas.includes(bloco.skillVinculada);
      if (!matchesSkill) return null;

      const perguntas = bloco.perguntas
        .filter((pergunta) => !pergunta.nichoVinculado || pergunta.nichoVinculado === cliente.nicho)
        .map((pergunta) => ({
          texto: pergunta.texto,
          tipo: pergunta.tipo,
          obrigatoria: pergunta.obrigatoria,
          valores: respostasPorPergunta.get(pergunta.id) ?? [],
        }));

      if (!perguntas.length) return null;
      return { titulo: bloco.titulo, perguntas };
    })
    .filter((bloco): bloco is NonNullable<typeof bloco> => bloco !== null);

  return { cliente, blocos: blocosComRespostas };
}

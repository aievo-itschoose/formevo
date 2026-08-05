import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import OpenAI from "openai";
import { getClientAnswersSummary } from "@/lib/client-answers";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Você é um especialista em prompt engineering para agentes de atendimento via WhatsApp/IA. Sua tarefa é gerar o prompt operacional final de um agente de IA para um cliente específico, usando um template de referência (de outro cliente do mesmo nicho) como guia de estrutura, tom, formatação e regras — mas preenchendo o conteúdo com as respostas reais do cliente atual.

Regras:
- Mantenha a mesma estrutura de seções, o mesmo nível de detalhe e o mesmo tom do template de referência.
- Substitua nomes de empresa, produtos, valores, regras de negócio, horários etc. pelas respostas reais do cliente.
- Para partes técnicas de integração (nomes de tools, protocolo de retorno JSON, departamentos exatos de transferência, IDs de workflow) que não têm resposta correspondente no formulário, mantenha a estrutura do template mas marque claramente com [PREENCHER: descrição do que falta] em vez de inventar.
- Nunca invente informações de negócio (valores, políticas, horários) que não estejam nas respostas fornecidas.
- Devolva apenas o prompt final, sem comentários adicionais antes ou depois.`;

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const summary = await getClientAnswersSummary(id);
  if (!summary) {
    return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
  }

  const templateFile = summary.cliente.nicho === "veicular" ? "veicular.md" : "outro.md";
  const templatePath = path.join(process.cwd(), "src/lib/prompt-templates", templateFile);
  const template = await readFile(templatePath, "utf8");

  const answersText = summary.blocos
    .map((bloco) => {
      const perguntasText = bloco.perguntas
        .map((pergunta) => `- ${pergunta.texto}: ${pergunta.valores.length ? pergunta.valores.join(" | ") : "(não respondido)"}`)
        .join("\n");
      return `### ${bloco.titulo}\n${perguntasText}`;
    })
    .join("\n\n");

  const userPrompt = `NICHO DO CLIENTE: ${summary.cliente.nicho}

TEMPLATE DE REFERÊNCIA (estrutura/tom a seguir):
"""
${template}
"""

RESPOSTAS DO CLIENTE (${summary.cliente.nome}):
"""
${answersText}
"""

Gere o prompt operacional final para este cliente.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    const prompt = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("Erro ao gerar prompt:", error);
    return NextResponse.json({ error: "Falha ao gerar o prompt" }, { status: 502 });
  }
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const blocks = [
  {
    titulo: "Identificação e contratação",
    ordem: 1,
    skillVinculada: null,
    perguntas: [
      { texto: "Nome da associação", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { texto: "Responsável pelo projeto - nome", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
      { texto: "WhatsApp do responsável", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 3, repetivel: false, opcoes: [] },
      { texto: "E-mail do responsável", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 4, repetivel: false, opcoes: [] },
      { texto: "Plano contratado", tipo: "SELECT", obrigatoria: true, ordem: 5, repetivel: false, opcoes: ["Flow", "Scale", "Team"] },
      { texto: "Vocês têm integração com algum sistema?", tipo: "SIM_NAO", obrigatoria: true, ordem: 6, repetivel: false, opcoes: [] },
      { texto: "Qual sistema de integração?", tipo: "SELECT", obrigatoria: false, ordem: 7, repetivel: false, opcoes: ["Power", "SGA", "Siprov", "Outro"] },
      { texto: "Nome completo de quem recebe o primeiro acesso admin", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 8, repetivel: false, opcoes: [] },
      { texto: "Quais Skills vocês querem ativar no agente?", tipo: "MULTISELECT", obrigatoria: true, ordem: 9, repetivel: false, opcoes: ["Comercial/SDR", "Cobrança", "SAC", "Reativação de base", "Indicação"] },
      { texto: "Quantas instâncias de WhatsApp serão usadas, e para qual finalidade cada uma?", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 10, repetivel: false, opcoes: [] },
    ],
  },
  {
    titulo: "Identidade e tom",
    ordem: 2,
    skillVinculada: null,
    perguntas: [
      { texto: "Como o agente deve se apresentar?", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { texto: "Em três palavras, como a associação quer ser percebida na conversa?", tipo: "TEXTO_CURTO", obrigatoria: false, ordem: 2, repetivel: false, opcoes: [] },
      { texto: "Expressões, gírias ou forma de falar característica da associação", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 3, repetivel: false, opcoes: [] },
      { texto: "Formas de falar que devem ser evitadas", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 4, repetivel: false, opcoes: [] },
    ],
  },
  {
    titulo: "Planos e produtos",
    ordem: 3,
    skillVinculada: "COMERCIAL",
    perguntas: [
      { texto: "Nome do plano", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 1, repetivel: true, opcoes: [] },
      { texto: "Categoria de veículo elegível e faixa de ano/valor", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 2, repetivel: true, opcoes: [] },
      { texto: "Valor da mensalidade", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 3, repetivel: true, opcoes: [] },
      { texto: "O que está incluso", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 4, repetivel: true, opcoes: [] },
      { texto: "O que NÃO está incluso", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 5, repetivel: true, opcoes: [] },
      { texto: "Carência - tempo e situações", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 6, repetivel: true, opcoes: [] },
      { texto: "Taxas adicionais - adesão, vistoria", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 7, repetivel: true, opcoes: [] },
      { texto: "Diferencial forte desse plano", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 8, repetivel: true, opcoes: [] },
    ],
  },
  {
    titulo: "Regras comerciais",
    ordem: 4,
    skillVinculada: "COMERCIAL",
    perguntas: [
      { texto: "Política de desconto - limite e contexto", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { texto: "O agente pode oferecer desconto por iniciativa própria?", tipo: "SIM_NAO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
      { texto: "Gatilhos que nunca viram desconto", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 3, repetivel: false, opcoes: [] },
    ],
  },
  {
    titulo: "Objeções",
    ordem: 5,
    skillVinculada: "COMERCIAL",
    perguntas: [
      { texto: "Objeção mais comum", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 1, repetivel: true, opcoes: [] },
      { texto: "Como o time responde hoje", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 2, repetivel: true, opcoes: [] },
      { texto: "Objeção que ninguém resolve bem hoje", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 3, repetivel: true, opcoes: [] },
    ],
  },
  {
    titulo: "Concorrência",
    ordem: 6,
    skillVinculada: "COMERCIAL",
    perguntas: [
      { texto: "Principais concorrentes diretos", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { texto: "Resposta padrão vs. seguro tradicional", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 2, repetivel: false, opcoes: [] },
      { texto: "Resposta padrão vs. outra associação", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 3, repetivel: false, opcoes: [] },
    ],
  },
  {
    titulo: "Processo de adesão",
    ordem: 7,
    skillVinculada: "COMERCIAL",
    perguntas: [
      { texto: "Documentos exigidos", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { texto: "Vistoria obrigatória? Como funciona", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
      { texto: "Tempo do fechamento até proteção ativa", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 3, repetivel: false, opcoes: [] },
    ],
  },
  {
    titulo: "Limites e transferência para humano",
    ordem: 8,
    skillVinculada: null,
    perguntas: [
      { texto: "Cenários de transferência obrigatória", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { texto: "Quem recebe cada tipo de transferência", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
      { texto: "O que o agente jamais pode prometer", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 3, repetivel: false, opcoes: [] },
    ],
  },
  {
    titulo: "Materiais de apoio",
    ordem: 9,
    skillVinculada: null,
    perguntas: [
      { texto: "Upload de script/manual/apostila existente", tipo: "ARQUIVO", obrigatoria: false, ordem: 1, repetivel: false, opcoes: [] },
      { texto: "Upload de FAQ", tipo: "ARQUIVO", obrigatoria: false, ordem: 2, repetivel: false, opcoes: [] },
      { texto: "Upload/print de conversa modelo", tipo: "ARQUIVO", obrigatoria: false, ordem: 3, repetivel: false, opcoes: [] },
    ],
  },
  {
    titulo: "Cobrança",
    ordem: 10,
    skillVinculada: "COBRANCA",
    perguntas: [
      { texto: "Onde ficam os dados de vencimento hoje", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { texto: "Regra de disparo - dias antes/depois", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
      { texto: "Tom desejado no lembrete", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 3, repetivel: false, opcoes: [] },
    ],
  },
  {
    titulo: "SAC",
    ordem: 11,
    skillVinculada: "SAC",
    perguntas: [
      { texto: "As 5 demandas mais frequentes", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { texto: "Resposta padrão já usada", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 2, repetivel: false, opcoes: [] },
    ],
  },
  {
    titulo: "Reativação de base",
    ordem: 12,
    skillVinculada: "REATIVACAO",
    perguntas: [
      { texto: "Critério de base inativa - tempo sem interação", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { texto: "Oferta ou abordagem usada em reativação", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
    ],
  },
  {
    titulo: "Indicação",
    ordem: 13,
    skillVinculada: "INDICACAO",
    perguntas: [
      { texto: "Existe programa de indicação estruturado? Regras e comissão", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { texto: "Quem recebe indicações captadas pelo agente", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
    ],
  },
  {
    titulo: "Fechamento",
    ordem: 14,
    skillVinculada: null,
    perguntas: [
      { texto: "Sinal de implantação bem-sucedida em 30 dias", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { texto: "Receios ou pontos de atenção antes de começar", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 2, repetivel: false, opcoes: [] },
    ],
  },
] as const;

async function main() {
  for (const blockData of blocks) {
    const existingBlock = await prisma.bloco.findFirst({ where: { titulo: blockData.titulo } });

    if (existingBlock) {
      for (const question of blockData.perguntas) {
        const existingQuestion = await prisma.pergunta.findFirst({
          where: { blocoId: existingBlock.id, texto: question.texto },
        });

        if (!existingQuestion) {
          await prisma.pergunta.create({
            data: {
              blocoId: existingBlock.id,
              texto: question.texto,
              tipo: question.tipo as any,
              obrigatoria: question.obrigatoria,
              ordem: question.ordem,
              repetivel: question.repetivel,
              opcoes: question.opcoes,
            },
          });
        }
      }

      continue;
    }

    const bloco = await prisma.bloco.create({
      data: {
        titulo: blockData.titulo,
        ordem: blockData.ordem,
        skillVinculada: blockData.skillVinculada,
        perguntas: {
          create: blockData.perguntas.map((question) => ({
            texto: question.texto,
            tipo: question.tipo as any,
            obrigatoria: question.obrigatoria,
            ordem: question.ordem,
            repetivel: question.repetivel,
            opcoes: question.opcoes,
          })),
        },
      },
    });

    console.log(`Seeded bloco: ${bloco.titulo}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const sampleClientNames = ["Associação do Vale", "Liga Norte"];
const sampleClientTokens = ["vale-1001", "norte-2002"];

type QuestionSeed = {
  texto: string;
  tipo: Prisma.PerguntaCreateInput["tipo"];
  obrigatoria: boolean;
  ordem: number;
  repetivel: boolean;
  opcoes: string[];
};

type BlockSeed = {
  titulo: string;
  ordem: number;
  skillVinculada: string | null;
  perguntas: QuestionSeed[];
};

const blocks: BlockSeed[] = [
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
      { texto: "Em três palavras, como a associação quer ser percebida na conversa?", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
      { texto: "Expressões, gírias ou forma de falar característica da associação", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 3, repetivel: false, opcoes: [] },
      { texto: "Formas de falar que devem ser evitadas", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 4, repetivel: false, opcoes: [] },
      { texto: "Qual nome o agente deve usar?", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 5, repetivel: false, opcoes: [] },
      { texto: "Preferências de formatação: limite de linhas por mensagem, se pode usar listas com hífen, nível de uso de emoji (nenhum/moderado/frequente)", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 6, repetivel: false, opcoes: [] },
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
      { texto: "Departamentos de transferência: nome do departamento e quando transferir pra ele", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 4, repetivel: true, opcoes: [] },
      { texto: "Existe canal de emergência/24h que o agente informa diretamente, sem transferir? Qual número/contato e quais situações se aplicam?", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 5, repetivel: false, opcoes: [] },
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
    titulo: "Operação e regras críticas",
    ordem: 10,
    skillVinculada: null,
    perguntas: [
      { texto: "Horário de atendimento humano, detalhado por dia da semana", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { texto: "Quais formas de pagamento existem, e existe alguma que o agente NUNCA deve mencionar mesmo se o cliente perguntar diretamente?", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
      { texto: "Existe protocolo ou texto formal fixo para pedidos de cancelamento? Cole o texto exato, se houver", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 3, repetivel: false, opcoes: [] },
      { texto: "Existe mensagem-gatilho fixa (campanha, anúncio, botão) que deve acionar um fluxo específico? Qual mensagem e qual fluxo?", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 4, repetivel: false, opcoes: [] },
    ],
  },
  {
    titulo: "Cobrança",
    ordem: 11,
    skillVinculada: "COBRANCA",
    perguntas: [
      { texto: "Onde ficam os dados de vencimento hoje", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { texto: "Regra de disparo - dias antes/depois", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
      { texto: "Tom desejado no lembrete", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 3, repetivel: false, opcoes: [] },
    ],
  },
  {
    titulo: "SAC",
    ordem: 12,
    skillVinculada: "SAC",
    perguntas: [
      { texto: "As 5 demandas mais frequentes", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { texto: "Resposta padrão já usada", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 2, repetivel: false, opcoes: [] },
    ],
  },
  {
    titulo: "Reativação de base",
    ordem: 13,
    skillVinculada: "REATIVACAO",
    perguntas: [
      { texto: "Critério de base inativa - tempo sem interação", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { texto: "Oferta ou abordagem usada em reativação", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
    ],
  },
  {
    titulo: "Indicação",
    ordem: 14,
    skillVinculada: "INDICACAO",
    perguntas: [
      { texto: "Existe programa de indicação estruturado? Regras e comissão", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { texto: "Quem recebe indicações captadas pelo agente", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
    ],
  },
  {
    titulo: "Fechamento",
    ordem: 15,
    skillVinculada: null,
    perguntas: [
      { texto: "Sinal de implantação bem-sucedida em 30 dias", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { texto: "Receios ou pontos de atenção antes de começar", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 2, repetivel: false, opcoes: [] },
    ],
  },
];

async function removeTestClients() {
  const testClients = await prisma.cliente.findMany({
    where: {
      OR: [{ nome: { in: sampleClientNames } }, { token: { in: sampleClientTokens } }],
    },
    select: { id: true },
  });

  const clientIds = testClients.map((client) => client.id);
  if (!clientIds.length) {
    return;
  }

  await prisma.resposta.deleteMany({ where: { clienteId: { in: clientIds } } });
  await prisma.pergunta.deleteMany({ where: { clienteId: { in: clientIds } } });
  await prisma.cliente.deleteMany({ where: { id: { in: clientIds } } });
}

async function removeStaleBlocksAndQuestions(expectedQuestionTexts: Set<string>) {
  const existingBlocks = await prisma.bloco.findMany({ select: { id: true, titulo: true } });
  const expectedBlockTitles = new Set(blocks.map((block) => block.titulo));
  const staleBlockIds = existingBlocks.filter((block) => !expectedBlockTitles.has(block.titulo)).map((block) => block.id);

  if (staleBlockIds.length) {
    await prisma.resposta.deleteMany({ where: { pergunta: { blocoId: { in: staleBlockIds } } } });
    await prisma.pergunta.deleteMany({ where: { blocoId: { in: staleBlockIds } } });
    await prisma.bloco.deleteMany({ where: { id: { in: staleBlockIds } } });
  }

  const existingQuestions = await prisma.pergunta.findMany({ select: { id: true, texto: true } });
  const staleQuestionIds = existingQuestions.filter((question) => !expectedQuestionTexts.has(question.texto)).map((question) => question.id);

  if (staleQuestionIds.length) {
    await prisma.resposta.deleteMany({ where: { perguntaId: { in: staleQuestionIds } } });
    await prisma.pergunta.deleteMany({ where: { id: { in: staleQuestionIds } } });
  }
}

async function upsertBlock(blockData: BlockSeed) {
  const existingBlock = await prisma.bloco.findFirst({ where: { titulo: blockData.titulo } });

  if (existingBlock) {
    return prisma.bloco.update({
      where: { id: existingBlock.id },
      data: {
        ordem: blockData.ordem,
        skillVinculada: blockData.skillVinculada,
      },
    });
  }

  return prisma.bloco.create({
    data: {
      titulo: blockData.titulo,
      ordem: blockData.ordem,
      skillVinculada: blockData.skillVinculada,
    },
  });
}

async function upsertQuestion(blockId: string, questionData: QuestionSeed) {
  const existingQuestion = await prisma.pergunta.findFirst({ where: { blocoId: blockId, texto: questionData.texto } });

  const payload = {
    texto: questionData.texto,
    tipo: questionData.tipo as Prisma.PerguntaCreateInput["tipo"],
    obrigatoria: questionData.obrigatoria,
    ordem: questionData.ordem,
    repetivel: questionData.repetivel,
    opcoes: questionData.opcoes,
  };

  if (existingQuestion) {
    return prisma.pergunta.update({
      where: { id: existingQuestion.id },
      data: payload,
    });
  }

  return prisma.pergunta.create({
    data: {
      ...payload,
      blocoId: blockId,
    },
  });
}

async function main() {
  await removeTestClients();

  const expectedQuestionTexts = new Set(blocks.flatMap((block) => block.perguntas.map((question) => question.texto)));
  await removeStaleBlocksAndQuestions(expectedQuestionTexts);

  const insertedCounts: Record<string, number> = {};

  for (const blockData of blocks) {
    const bloco = await upsertBlock(blockData);
    let count = 0;

    for (const question of blockData.perguntas) {
      await upsertQuestion(bloco.id, question);
      count += 1;
    }

    insertedCounts[blockData.titulo] = count;
    console.log(`Seeded bloco: ${bloco.titulo} (${count} perguntas)`);
  }

  const totalPerguntas = await prisma.pergunta.count();
  const clientesRestantes = await prisma.cliente.count({ where: { OR: [{ nome: { in: sampleClientNames } }, { token: { in: sampleClientTokens } }] } });

  console.log("\nResumo do seed:");
  for (const [titulo, count] of Object.entries(insertedCounts)) {
    console.log(`- ${titulo}: ${count} perguntas`);
  }

  console.log(`\nTotal de perguntas no banco: ${totalPerguntas}`);
  console.log(`Clientes de teste removidos: ${clientesRestantes}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

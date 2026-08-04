import type { Block, ClientRecord, Plano, Skill } from "@/types/form";

export const skillLabels: Record<Skill, string> = {
  COMERCIAL: "Comercial / SDR",
  COBRANCA: "Cobrança",
  SAC: "SAC",
  REATIVACAO: "Reativação de base",
  INDICACAO: "Indicação",
};

export const planLabels: Record<Plano, string> = {
  FLOW: "Flow",
  SCALE: "Scale",
  TEAM: "Team",
};

export const planLimits: Record<Plano, { skills: number; whatsapp: number }> = {
  FLOW: { skills: 1, whatsapp: 1 },
  SCALE: { skills: 3, whatsapp: 5 },
  TEAM: { skills: 6, whatsapp: 10 },
};

export const initialBlocks: Block[] = [
  {
    id: "identificacao",
    titulo: "Identificação e contratação",
    ordem: 1,
    skillVinculada: null,
    perguntas: [
      { id: "ident-nome-associacao", blocoId: "identificacao", texto: "Nome da associação", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { id: "ident-responsavel", blocoId: "identificacao", texto: "Responsável pelo projeto", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
      { id: "ident-plano", blocoId: "identificacao", texto: "Plano contratado", tipo: "SELECT", obrigatoria: true, ordem: 3, repetivel: false, opcoes: ["FLOW", "SCALE", "TEAM"] },
      { id: "ident-integracao", blocoId: "identificacao", texto: "Vocês têm integração com algum sistema?", tipo: "SIM_NAO", obrigatoria: true, ordem: 4, repetivel: false, opcoes: [] },
      { id: "ident-skills", blocoId: "identificacao", texto: "Quais skills você quer ativar?", tipo: "MULTISELECT", obrigatoria: true, ordem: 5, repetivel: false, opcoes: ["COMERCIAL", "COBRANCA", "SAC", "REATIVACAO", "INDICACAO"] },
    ],
  },
  {
    id: "tom",
    titulo: "Identidade e tom",
    ordem: 2,
    skillVinculada: null,
    perguntas: [
      { id: "tom-apresentacao", blocoId: "tom", texto: "Como o agente deve se apresentar?", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { id: "tom-palavras", blocoId: "tom", texto: "Em três palavras, como a associação quer ser percebida?", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
    ],
  },
  {
    id: "planos",
    titulo: "Planos e produtos",
    ordem: 3,
    skillVinculada: "COMERCIAL",
    perguntas: [
      { id: "planos-nome", blocoId: "planos", texto: "Nome do plano", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 1, repetivel: true, opcoes: [] },
      { id: "planos-valor", blocoId: "planos", texto: "Valor da mensalidade", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 2, repetivel: true, opcoes: [] },
    ],
  },
  {
    id: "comerciais",
    titulo: "Regras comerciais",
    ordem: 4,
    skillVinculada: "COMERCIAL",
    perguntas: [
      { id: "comerciais-desconto", blocoId: "comerciais", texto: "Política de desconto", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
    ],
  },
  {
    id: "limitacoes",
    titulo: "Limites e transferência para humano",
    ordem: 5,
    skillVinculada: null,
    perguntas: [
      { id: "limitacoes-cenarios", blocoId: "limitacoes", texto: "Cenários de transferência obrigatória", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
    ],
  },
  {
    id: "materiais",
    titulo: "Materiais de apoio",
    ordem: 6,
    skillVinculada: null,
    perguntas: [
      { id: "materiais-script", blocoId: "materiais", texto: "Upload de script ou manual existente", tipo: "ARQUIVO", obrigatoria: false, ordem: 1, repetivel: false, opcoes: [] },
    ],
  },
  {
    id: "cobranca",
    titulo: "Cobrança",
    ordem: 7,
    skillVinculada: "COBRANCA",
    perguntas: [
      { id: "cobranca-regra", blocoId: "cobranca", texto: "Regra de disparo do lembrete", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
    ],
  },
  {
    id: "sac",
    titulo: "SAC",
    ordem: 8,
    skillVinculada: "SAC",
    perguntas: [
      { id: "sac-demandas", blocoId: "sac", texto: "Cinco demandas mais frequentes", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
    ],
  },
  {
    id: "reativacao",
    titulo: "Reativação de base",
    ordem: 9,
    skillVinculada: "REATIVACAO",
    perguntas: [
      { id: "reativacao-critério", blocoId: "reativacao", texto: "Critério de base inativa", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
    ],
  },
  {
    id: "indicacao",
    titulo: "Indicação",
    ordem: 10,
    skillVinculada: "INDICACAO",
    perguntas: [
      { id: "indicacao-programa", blocoId: "indicacao", texto: "Existe programa de indicação estruturado?", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
    ],
  },
  {
    id: "fechamento",
    titulo: "Fechamento",
    ordem: 11,
    skillVinculada: null,
    perguntas: [
      { id: "fechamento-sinal", blocoId: "fechamento", texto: "Sinal de implantação bem-sucedida em 30 dias", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 1, repetivel: false, opcoes: [] },
    ],
  },
];

export const initialClients: ClientRecord[] = [];

export function getVisibleBlocks(blocks: Block[], skillsAtivas: Skill[]) {
  return blocks.filter((block) => !block.skillVinculada || skillsAtivas.includes(block.skillVinculada));
}

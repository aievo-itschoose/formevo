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
      { id: "ident-nome-associacao", blocoId: "identificacao", texto: "Nome da associação/empresa", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { id: "ident-responsavel", blocoId: "identificacao", texto: "Responsável pelo projeto - nome", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
      { id: "ident-whatsapp", blocoId: "identificacao", texto: "WhatsApp do responsável", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 3, repetivel: false, opcoes: [] },
      { id: "ident-email", blocoId: "identificacao", texto: "E-mail do responsável", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 4, repetivel: false, opcoes: [] },
      { id: "ident-plano", blocoId: "identificacao", texto: "Plano contratado", tipo: "SELECT", obrigatoria: true, ordem: 5, repetivel: false, opcoes: ["Flow", "Scale", "Team"] },
      { id: "ident-integracao", blocoId: "identificacao", texto: "Vocês têm integração com algum sistema?", tipo: "SIM_NAO", obrigatoria: true, ordem: 6, repetivel: false, opcoes: [] },
      { id: "ident-sistema-integracao", blocoId: "identificacao", texto: "Qual sistema de integração?", tipo: "SELECT", obrigatoria: false, ordem: 7, repetivel: false, opcoes: ["Power", "SGA", "Siprov", "Outro"] },
      { id: "ident-admin-acesso", blocoId: "identificacao", texto: "Nome completo de quem recebe o primeiro acesso admin", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 8, repetivel: false, opcoes: [] },
      { id: "ident-nicho", blocoId: "identificacao", texto: "Nicho de atuação", tipo: "SELECT", obrigatoria: true, ordem: 9, repetivel: false, opcoes: ["Proteção veicular", "Outro"] },
      { id: "ident-skills", blocoId: "identificacao", texto: "Quais Skills vocês querem ativar no agente?", tipo: "MULTISELECT", obrigatoria: true, ordem: 10, repetivel: false, opcoes: ["Comercial/SDR", "Cobrança", "SAC", "Reativação de base", "Indicação"] },
      { id: "ident-instancias", blocoId: "identificacao", texto: "Quantas instâncias de WhatsApp serão usadas, e para qual finalidade cada uma?", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 11, repetivel: false, opcoes: [] },
    ],
  },
  {
    id: "tom",
    titulo: "Identidade e tom",
    ordem: 2,
    skillVinculada: null,
    perguntas: [
      { id: "tom-apresentacao", blocoId: "tom", texto: "Como o agente deve se apresentar?", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { id: "tom-palavras", blocoId: "tom", texto: "Em três palavras, como a empresa quer ser percebida na conversa?", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
      { id: "tom-girias", blocoId: "tom", texto: "Expressões, gírias ou forma de falar característica da empresa", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 3, repetivel: false, opcoes: [] },
      { id: "tom-evitar", blocoId: "tom", texto: "Formas de falar que devem ser evitadas", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 4, repetivel: false, opcoes: [] },
      { id: "tom-nome-agente", blocoId: "tom", texto: "Qual nome o agente deve usar?", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 5, repetivel: false, opcoes: [] },
      { id: "tom-formatacao", blocoId: "tom", texto: "Preferências de formatação: limite de linhas por mensagem, se pode usar listas com hífen, nível de uso de emoji (nenhum/moderado/frequente)", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 6, repetivel: false, opcoes: [] },
    ],
  },
  {
    id: "planos",
    titulo: "Planos e produtos",
    ordem: 3,
    skillVinculada: "COMERCIAL",
    perguntas: [
      { id: "planos-nome", blocoId: "planos", texto: "Nome do plano/produto/serviço", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 1, repetivel: true, opcoes: [] },
      { id: "planos-categoria-veicular", blocoId: "planos", texto: "Categoria de veículo elegível e faixa de ano/valor", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 2, repetivel: true, opcoes: [], nichoVinculado: "veicular" },
      { id: "planos-categoria-outro", blocoId: "planos", texto: "Categoria/tipo do produto ou serviço, e perfil de cliente elegível", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 2, repetivel: true, opcoes: [], nichoVinculado: "outro" },
      { id: "planos-valor", blocoId: "planos", texto: "Valor", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 3, repetivel: true, opcoes: [] },
      { id: "planos-incluso", blocoId: "planos", texto: "O que está incluso", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 4, repetivel: true, opcoes: [] },
      { id: "planos-nao-incluso", blocoId: "planos", texto: "O que NÃO está incluso", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 5, repetivel: true, opcoes: [] },
      { id: "planos-carencia", blocoId: "planos", texto: "Carência - tempo e situações, se houver", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 6, repetivel: true, opcoes: [] },
      { id: "planos-taxas", blocoId: "planos", texto: "Taxas adicionais", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 7, repetivel: true, opcoes: [] },
      { id: "planos-diferencial", blocoId: "planos", texto: "Diferencial forte desse plano/produto", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 8, repetivel: true, opcoes: [] },
      { id: "planos-garantia", blocoId: "planos", texto: "Prazo de garantia oferecido, se houver", tipo: "TEXTO_CURTO", obrigatoria: false, ordem: 9, repetivel: true, opcoes: [] },
    ],
  },
  {
    id: "comerciais",
    titulo: "Regras comerciais",
    ordem: 4,
    skillVinculada: "COMERCIAL",
    perguntas: [
      { id: "comerciais-desconto", blocoId: "comerciais", texto: "Política de desconto - limite e contexto", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { id: "comerciais-desconto-iniciativa", blocoId: "comerciais", texto: "O agente pode oferecer desconto por iniciativa própria?", tipo: "SIM_NAO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
      { id: "comerciais-gatilhos", blocoId: "comerciais", texto: "Gatilhos que nunca viram desconto", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 3, repetivel: false, opcoes: [] },
    ],
  },
  {
    id: "objecoes",
    titulo: "Objeções",
    ordem: 5,
    skillVinculada: "COMERCIAL",
    perguntas: [
      { id: "objecoes-comum", blocoId: "objecoes", texto: "Objeção mais comum", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 1, repetivel: true, opcoes: [] },
      { id: "objecoes-resposta", blocoId: "objecoes", texto: "Como o time responde hoje", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 2, repetivel: true, opcoes: [] },
      { id: "objecoes-nao-resolvida", blocoId: "objecoes", texto: "Objeção que ninguém resolve bem hoje", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 3, repetivel: true, opcoes: [] },
    ],
  },
  {
    id: "concorrencia",
    titulo: "Concorrência",
    ordem: 6,
    skillVinculada: "COMERCIAL",
    perguntas: [
      { id: "concorrencia-principais", blocoId: "concorrencia", texto: "Principais concorrentes diretos", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { id: "concorrencia-seguro-tradicional", blocoId: "concorrencia", texto: "Resposta padrão vs. seguro tradicional", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 2, repetivel: false, opcoes: [], nichoVinculado: "veicular" },
      { id: "concorrencia-comparacoes", blocoId: "concorrencia", texto: "Resposta padrão a comparações com concorrentes diretos", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 3, repetivel: false, opcoes: [] },
    ],
  },
  {
    id: "adesao",
    titulo: "Processo de adesão",
    ordem: 7,
    skillVinculada: "COMERCIAL",
    perguntas: [
      { id: "adesao-documentos", blocoId: "adesao", texto: "Documentos exigidos", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { id: "adesao-vistoria-veicular", blocoId: "adesao", texto: "Vistoria obrigatória? Como funciona", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [], nichoVinculado: "veicular" },
      { id: "adesao-diagnostico-outro", blocoId: "adesao", texto: "Existe avaliação ou diagnóstico presencial obrigatório antes do orçamento? Como funciona?", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [], nichoVinculado: "outro" },
      { id: "adesao-tempo-fechamento", blocoId: "adesao", texto: "Tempo do fechamento até conclusão/entrega", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 3, repetivel: false, opcoes: [] },
      { id: "adesao-atendimento-presencial", blocoId: "adesao", texto: "Existe atendimento presencial? Endereço da loja/escritório, se houver", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 4, repetivel: false, opcoes: [] },
      { id: "adesao-logistica", blocoId: "adesao", texto: "Oferece logística de busca/entrega do produto ou equipamento?", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 5, repetivel: false, opcoes: [], nichoVinculado: "outro" },
    ],
  },
  {
    id: "limitacoes",
    titulo: "Limites e transferência para humano",
    ordem: 8,
    skillVinculada: null,
    perguntas: [
      { id: "limitacoes-cenarios", blocoId: "limitacoes", texto: "Cenários de transferência obrigatória", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { id: "limitacoes-quem-recebe", blocoId: "limitacoes", texto: "Quem recebe cada tipo de transferência", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
      { id: "limitacoes-nao-prometer", blocoId: "limitacoes", texto: "O que o agente jamais pode prometer", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 3, repetivel: false, opcoes: [] },
      { id: "limitacoes-departamentos", blocoId: "limitacoes", texto: "Departamentos de transferência: nome do departamento e quando transferir pra ele", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 4, repetivel: true, opcoes: [] },
      { id: "limitacoes-emergencia", blocoId: "limitacoes", texto: "Existe canal de emergência/24h que o agente informa diretamente, sem transferir? Qual número/contato e quais situações se aplicam?", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 5, repetivel: false, opcoes: [] },
      { id: "limitacoes-nunca-pedir", blocoId: "limitacoes", texto: "Existe alguma informação que o agente NUNCA deve pedir ao cliente? (ex: nota fiscal, CPF)", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 6, repetivel: false, opcoes: [] },
    ],
  },
  {
    id: "materiais",
    titulo: "Materiais de apoio",
    ordem: 9,
    skillVinculada: null,
    perguntas: [
      { id: "materiais-script", blocoId: "materiais", texto: "Upload de script/manual/apostila existente", tipo: "ARQUIVO", obrigatoria: false, ordem: 1, repetivel: false, opcoes: [] },
      { id: "materiais-faq", blocoId: "materiais", texto: "Upload de FAQ", tipo: "ARQUIVO", obrigatoria: false, ordem: 2, repetivel: false, opcoes: [] },
      { id: "materiais-conversa", blocoId: "materiais", texto: "Upload/print de conversa modelo", tipo: "ARQUIVO", obrigatoria: false, ordem: 3, repetivel: false, opcoes: [] },
      { id: "materiais-prova-social", blocoId: "materiais", texto: "Links de prova social (avaliações Google, posts, redes sociais) que o agente pode usar", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 4, repetivel: false, opcoes: [] },
    ],
  },
  {
    id: "operacao",
    titulo: "Operação e regras críticas",
    ordem: 10,
    skillVinculada: null,
    perguntas: [
      { id: "operacao-horario", blocoId: "operacao", texto: "Horário de atendimento humano, detalhado por dia da semana", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { id: "operacao-feriados", blocoId: "operacao", texto: "Feriados ou datas específicas de fechamento, além do horário semanal padrão", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 2, repetivel: false, opcoes: [] },
      { id: "operacao-pagamento", blocoId: "operacao", texto: "Quais formas de pagamento existem, e existe alguma que o agente NUNCA deve mencionar mesmo se o cliente perguntar diretamente?", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 3, repetivel: false, opcoes: [] },
      { id: "operacao-cancelamento", blocoId: "operacao", texto: "Existe protocolo ou texto formal fixo para pedidos de cancelamento? Cole o texto exato, se houver", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 4, repetivel: false, opcoes: [] },
      { id: "operacao-gatilho", blocoId: "operacao", texto: "Existe mensagem-gatilho fixa (campanha, anúncio, botão) que deve acionar um fluxo específico? Qual mensagem e qual fluxo?", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 5, repetivel: false, opcoes: [] },
    ],
  },
  {
    id: "cobranca",
    titulo: "Cobrança",
    ordem: 11,
    skillVinculada: "COBRANCA",
    perguntas: [
      { id: "cobranca-vencimento", blocoId: "cobranca", texto: "Onde ficam os dados de vencimento hoje", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { id: "cobranca-regra-disparo", blocoId: "cobranca", texto: "Regra de disparo - dias antes/depois", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
      { id: "cobranca-tom", blocoId: "cobranca", texto: "Tom desejado no lembrete", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 3, repetivel: false, opcoes: [] },
    ],
  },
  {
    id: "sac",
    titulo: "SAC",
    ordem: 12,
    skillVinculada: "SAC",
    perguntas: [
      { id: "sac-demandas", blocoId: "sac", texto: "As 5 demandas mais frequentes", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { id: "sac-resposta-padrao", blocoId: "sac", texto: "Resposta padrão já usada", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 2, repetivel: false, opcoes: [] },
    ],
  },
  {
    id: "reativacao",
    titulo: "Reativação de base",
    ordem: 13,
    skillVinculada: "REATIVACAO",
    perguntas: [
      { id: "reativacao-criterio", blocoId: "reativacao", texto: "Critério de base inativa - tempo sem interação", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { id: "reativacao-oferta", blocoId: "reativacao", texto: "Oferta ou abordagem usada em reativação", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
    ],
  },
  {
    id: "indicacao",
    titulo: "Indicação",
    ordem: 14,
    skillVinculada: "INDICACAO",
    perguntas: [
      { id: "indicacao-programa", blocoId: "indicacao", texto: "Existe programa de indicação estruturado? Regras e comissão", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { id: "indicacao-quem-recebe", blocoId: "indicacao", texto: "Quem recebe indicações captadas pelo agente", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: 2, repetivel: false, opcoes: [] },
    ],
  },
  {
    id: "fechamento",
    titulo: "Fechamento",
    ordem: 15,
    skillVinculada: null,
    perguntas: [
      { id: "fechamento-sinal", blocoId: "fechamento", texto: "Sinal de implantação bem-sucedida em 30 dias", tipo: "TEXTO_LONGO", obrigatoria: true, ordem: 1, repetivel: false, opcoes: [] },
      { id: "fechamento-receios", blocoId: "fechamento", texto: "Receios ou pontos de atenção antes de começar", tipo: "TEXTO_LONGO", obrigatoria: false, ordem: 2, repetivel: false, opcoes: [] },
    ],
  },
];

export const initialClients: ClientRecord[] = [];

export function getVisibleBlocks(blocks: Block[], skillsAtivas: Skill[]) {
  return blocks.filter((block) => !block.skillVinculada || skillsAtivas.includes(block.skillVinculada));
}

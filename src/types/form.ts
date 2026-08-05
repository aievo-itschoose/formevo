export type Plano = "FLOW" | "SCALE" | "TEAM";
export type Skill = "COMERCIAL" | "COBRANCA" | "SAC" | "REATIVACAO" | "INDICACAO";
export type StatusImplantacao = "NAO_INICIADO" | "EM_ANDAMENTO" | "CONCLUIDO";
export type QuestionType =
  | "TEXTO_CURTO"
  | "TEXTO_LONGO"
  | "SELECT"
  | "MULTISELECT"
  | "ARQUIVO"
  | "SIM_NAO";

export interface Question {
  id: string;
  blocoId: string;
  texto: string;
  tipo: QuestionType;
  obrigatoria: boolean;
  ordem: number;
  repetivel: boolean;
  opcoes: string[];
  nichoVinculado?: string | null;
  clienteId?: string;
}

export interface Block {
  id: string;
  titulo: string;
  ordem: number;
  skillVinculada: Skill | null;
  perguntas: Question[];
}

export interface ClientRecord {
  id: string;
  nome: string;
  token: string;
  plano: Plano;
  temIntegracao: boolean;
  sistemaIntegracao?: string;
  skillsAtivas: Skill[];
  nicho: "veicular" | "outro";
  status: StatusImplantacao;
  criadoEm: string;
  perguntasExtras?: Question[];
}

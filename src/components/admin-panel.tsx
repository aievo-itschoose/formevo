"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { initialBlocks, planLabels, skillLabels } from "@/lib/mock-data";
import type { Block, ClientRecord, Plano, QuestionType, Skill, StatusImplantacao } from "@/types/form";

interface AdminPanelProps {
  view: "perguntas" | "clientes" | "respostas";
}

interface AnswersSummary {
  blocos: Array<{
    titulo: string;
    perguntas: Array<{ texto: string; tipo: string; obrigatoria: boolean; valores: string[] }>;
  }>;
}

function SortableBlockCard({ block, onEditQuestion, onAddQuestion, onDeleteQuestion }: { block: Block; onEditQuestion: (blockId: string, questionId: string, field: "texto" | "tipo", value: string) => void; onAddQuestion: (blockId: string) => void; onDeleteQuestion: (blockId: string, questionId: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-2xl border border-white/10 bg-[#111118] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button type="button" className="cursor-grab text-zinc-500" {...attributes} {...listeners}>⋮⋮</button>
          <h3 className="text-lg font-semibold text-white">{block.titulo}</h3>
        </div>
        <button type="button" onClick={() => onAddQuestion(block.id)} className="rounded-full border border-[#7d4af9]/30 px-3 py-1 text-sm text-[#a65df9]">Adicionar pergunta</button>
      </div>
      <div className="space-y-2">
        {block.perguntas.map((question, index) => (
          <div key={question.id} className="rounded-xl border border-white/10 bg-[#0a0a0f] p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-zinc-400">{index + 1}. {question.texto || "Nova pergunta"}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-[0.25em] text-zinc-500">{question.tipo}</span>
                <button type="button" onClick={() => onDeleteQuestion(block.id, question.id)} className="rounded-full border border-red-500/30 p-2 text-red-300 transition hover:bg-red-500/10" aria-label="Excluir pergunta">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <input
              value={question.texto}
              onChange={(event) => onEditQuestion(block.id, question.id, "texto", event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#111118] px-3 py-2 text-sm text-white"
              placeholder="Digite a pergunta"
            />
            <select
              value={question.tipo}
              onChange={(event) => onEditQuestion(block.id, question.id, "tipo", event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#111118] px-3 py-2 text-sm text-white"
            >
              <option value="TEXTO_CURTO">Texto curto</option>
              <option value="TEXTO_LONGO">Texto longo</option>
              <option value="SELECT">Select</option>
              <option value="MULTISELECT">Multiselect</option>
              <option value="ARQUIVO">Arquivo</option>
              <option value="SIM_NAO">Sim/Não</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminPanel({ view }: AdminPanelProps) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPlan, setClientPlan] = useState<Plano>("SCALE");
  const [clientSkills, setClientSkills] = useState<Skill[]>(["COMERCIAL"]);
  const [clientNicho, setClientNicho] = useState<ClientRecord["nicho"]>("veicular");
  const [pendingDelete, setPendingDelete] = useState<{ blockId: string; questionId: string } | null>(null);
  const [pendingDeleteClientId, setPendingDeleteClientId] = useState<string | null>(null);
  const [copiedClientId, setCopiedClientId] = useState<string | null>(null);
  const [extraQuestionText, setExtraQuestionText] = useState("");
  const [extraQuestionType, setExtraQuestionType] = useState<QuestionType>("TEXTO_CURTO");
  const [extraQuestionRequired, setExtraQuestionRequired] = useState(true);
  const [showExtraQuestionForm, setShowExtraQuestionForm] = useState(false);
  const [answersSummary, setAnswersSummary] = useState<AnswersSummary | null>(null);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [generatingPrompt, setGeneratingPrompt] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  useEffect(() => {
    const storedBlocks = window.localStorage.getItem("form-evo-blocks");
    const nextBlocks = storedBlocks ? JSON.parse(storedBlocks) as Block[] : initialBlocks;
    setBlocks(nextBlocks);
    setLoaded(true);

    fetch("/api/clientes")
      .then((response) => response.json())
      .then((data: ClientRecord[]) => {
        setClients(data);
        setSelectedClientId(data[0]?.id ?? null);
      })
      .catch(() => toast.error("Não foi possível carregar os clientes."));
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem("form-evo-blocks", JSON.stringify(blocks));
  }, [loaded, blocks]);

  useEffect(() => {
    if (view !== "respostas" || !selectedClientId) {
      setAnswersSummary(null);
      return;
    }

    setLoadingAnswers(true);
    setGeneratedPrompt(null);
    fetch(`/api/clientes/${selectedClientId}/respostas`)
      .then((response) => response.json())
      .then((data: AnswersSummary) => setAnswersSummary(data))
      .catch(() => toast.error("Não foi possível carregar as respostas deste cliente."))
      .finally(() => setLoadingAnswers(false));
  }, [view, selectedClientId]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setBlocks((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
    toast.success("Blocos reordenados.");
  };

  const addQuestion = (blockId: string) => {
    setBlocks((items) => items.map((block) => block.id === blockId ? { ...block, perguntas: [...block.perguntas, { id: `q-${crypto.randomUUID()}`, blocoId: block.id, texto: "Nova pergunta", tipo: "TEXTO_CURTO", obrigatoria: true, ordem: block.perguntas.length + 1, repetivel: false, opcoes: [] }] } : block));
    toast.success("Pergunta adicionada.");
  };

  const editQuestion = (blockId: string, questionId: string, field: "texto" | "tipo", value: string) => {
    setBlocks((items) => items.map((block) => block.id === blockId ? { ...block, perguntas: block.perguntas.map((question) => question.id === questionId ? { ...question, [field]: value } : question) } : block));
  };

  const deleteQuestion = (blockId: string, questionId: string) => {
    setPendingDelete({ blockId, questionId });
  };

  const confirmDeleteQuestion = async () => {
    if (!pendingDelete) return;

    try {
      const response = await fetch(`/api/perguntas/${pendingDelete.questionId}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Falha ao excluir");
      }

      setBlocks((items) => items.map((block) => block.id === pendingDelete.blockId ? { ...block, perguntas: block.perguntas.filter((question) => question.id !== pendingDelete.questionId) } : block));
      toast.success("Pergunta removida.");
    } catch {
      toast.error("Não foi possível remover a pergunta.");
    } finally {
      setPendingDelete(null);
    }
  };

  const createClient = async () => {
    if (!clientName.trim()) return;

    try {
      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: clientName.trim(), plano: clientPlan, skillsAtivas: clientSkills, nicho: clientNicho }),
      });
      if (!response.ok) throw new Error("Falha ao criar cliente");

      const newClient = await response.json() as ClientRecord;
      setClients((items) => [newClient, ...items]);
      setSelectedClientId(newClient.id);
      setClientName("");
      toast.success(`Cliente criado. Link: /implantacao/${newClient.token}`);
    } catch {
      toast.error("Não foi possível criar o cliente.");
    }
  };

  const deleteClient = (clientId: string) => {
    setPendingDeleteClientId(clientId);
  };

  const confirmDeleteClient = async () => {
    if (!pendingDeleteClientId) return;

    try {
      const response = await fetch(`/api/clientes/${pendingDeleteClientId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Falha ao excluir");

      setClients((items) => items.filter((client) => client.id !== pendingDeleteClientId));
      setSelectedClientId((current) => (current === pendingDeleteClientId ? null : current));
      toast.success("Cliente removido.");
    } catch {
      toast.error("Não foi possível remover o cliente.");
    } finally {
      setPendingDeleteClientId(null);
    }
  };

  const logout = () => {
    document.cookie = "evo-admin-auth=; path=/; max-age=0";
    router.push("/admin");
  };

  const getClientUrl = (token: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "https://implantacao.evoialab.com.br");
    return `${baseUrl.replace(/\/$/, "")}/implantacao/${token}`;
  };

  const copyClientLink = async (client: ClientRecord) => {
    const url = getClientUrl(client.token);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedClientId(client.id);
      window.setTimeout(() => setCopiedClientId(null), 1600);
      toast.success("Link copiado com sucesso.");
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  };

  const addExtraQuestion = async (clienteId: string) => {
    if (!extraQuestionText.trim()) return;

    try {
      const response = await fetch(`/api/clientes/${clienteId}/perguntas-extras`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: extraQuestionText.trim(), tipo: extraQuestionType, obrigatoria: extraQuestionRequired }),
      });
      if (!response.ok) throw new Error("Falha ao salvar");

      const newQuestion = await response.json();
      setClients((items) => items.map((client) => client.id === clienteId ? { ...client, perguntasExtras: [...(client.perguntasExtras ?? []), newQuestion] } : client));
      setExtraQuestionText("");
      setExtraQuestionType("TEXTO_CURTO");
      setExtraQuestionRequired(true);
      setShowExtraQuestionForm(false);
      toast.success("Pergunta adicional salva para este cliente.");
    } catch {
      toast.error("Não foi possível salvar a pergunta adicional.");
    }
  };

  const removeExtraQuestion = async (clientId: string, questionId: string) => {
    try {
      const response = await fetch(`/api/perguntas-extras/${questionId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Falha ao remover");

      setClients((items) => items.map((client) => client.id === clientId ? { ...client, perguntasExtras: (client.perguntasExtras ?? []).filter((question) => question.id !== questionId) } : client));
      toast.success("Pergunta adicional removida.");
    } catch {
      toast.error("Não foi possível remover a pergunta adicional.");
    }
  };

  const updateClientStatus = async (clientId: string, status: StatusImplantacao) => {
    try {
      const response = await fetch(`/api/clientes/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Falha ao atualizar");

      setClients((items) => items.map((client) => client.id === clientId ? { ...client, status } : client));
    } catch {
      toast.error("Não foi possível atualizar o status.");
    }
  };

  const generatePrompt = async (clientId: string) => {
    setGeneratingPrompt(true);
    setGeneratedPrompt(null);
    try {
      const response = await fetch(`/api/clientes/${clientId}/gerar-prompt`, { method: "POST" });
      if (!response.ok) throw new Error("Falha ao gerar prompt");

      const data = await response.json() as { prompt: string };
      setGeneratedPrompt(data.prompt);
      toast.success("Prompt gerado.");
    } catch {
      toast.error("Não foi possível gerar o prompt.");
    } finally {
      setGeneratingPrompt(false);
    }
  };

  const copyGeneratedPrompt = async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopiedPrompt(true);
      window.setTimeout(() => setCopiedPrompt(false), 1600);
    } catch {
      toast.error("Não foi possível copiar o prompt.");
    }
  };

  const selectedClient = useMemo(() => clients.find((client) => client.id === selectedClientId) ?? null, [clients, selectedClientId]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#111118] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <img src="/evo_ia_roxo.png" alt="Evo" className="mb-3 h-8 w-auto" />
            <h2 className="text-2xl font-semibold text-white">Painel de implantação</h2>
            <p className="mt-2 text-sm text-zinc-400">Gerencie perguntas, organize blocos e crie links únicos para cada cliente.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/perguntas" className="rounded-full border border-white/10 px-3 py-2 text-sm text-zinc-300">Perguntas</Link>
            <Link href="/admin/clientes" className="rounded-full border border-white/10 px-3 py-2 text-sm text-zinc-300">Clientes</Link>
            <Link href="/admin/respostas" className="rounded-full border border-[#7d4af9]/30 bg-[#7d4af9]/10 px-3 py-2 text-sm text-[#a65df9]">Respostas</Link>
            <button type="button" onClick={logout} className="rounded-full border border-red-500/30 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10">Sair</button>
          </div>
        </div>
      </div>

      {view === "perguntas" && (
        <div className="space-y-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
              {blocks.map((block) => <SortableBlockCard key={block.id} block={block} onEditQuestion={editQuestion} onAddQuestion={addQuestion} onDeleteQuestion={deleteQuestion} />)}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {view === "clientes" && (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-white/10 bg-[#111118] p-6">
            <h3 className="text-xl font-semibold text-white">Criar novo cliente</h3>
            <div className="mt-4 space-y-3">
              <input value={clientName} onChange={(event) => setClientName(event.target.value)} placeholder="Nome da associação" className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-white" />
              <select value={clientPlan} onChange={(event) => setClientPlan(event.target.value as Plano)} className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-white">
                <option value="FLOW">Flow</option>
                <option value="SCALE">Scale</option>
                <option value="TEAM">Team</option>
              </select>
              <select value={clientNicho} onChange={(event) => setClientNicho(event.target.value as ClientRecord["nicho"])} className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-white">
                <option value="veicular">Proteção veicular</option>
                <option value="outro">Outro</option>
              </select>
              <div className="flex flex-wrap gap-2">
                {Object.entries(skillLabels).map(([value, label]) => {
                  const skillValue = value as Skill;
                  const checked = clientSkills.includes(skillValue);
                  return (
                    <label key={value} className={`rounded-full border px-3 py-2 text-sm ${checked ? "border-[#7d4af9] bg-[#7d4af9]/20 text-white" : "border-white/10 bg-[#0a0a0f] text-zinc-400"}`}>
                      <input type="checkbox" className="mr-2" checked={checked} onChange={() => setClientSkills((items) => items.includes(skillValue) ? items.filter((item) => item !== skillValue) : [...items, skillValue])} />
                      {label}
                    </label>
                  );
                })}
              </div>
              <button type="button" onClick={createClient} className="rounded-full bg-[#7d4af9] px-4 py-2 font-medium text-white">Criar implantação</button>
              {selectedClient && (
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0f] p-4 text-sm text-zinc-300">
                  <p className="font-semibold text-white">Link público</p>
                  <p className="mt-2 break-all text-zinc-400">{getClientUrl(selectedClient.token)}</p>
                  <button type="button" onClick={() => copyClientLink(selectedClient)} className="mt-3 rounded-full border border-[#7d4af9]/30 px-3 py-2 text-sm text-[#a65df9]">{copiedClientId === selectedClient.id ? "Copiado!" : "Copiar link"}</button>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111118] p-6">
            <h3 className="text-xl font-semibold text-white">Implantações</h3>
            <div className="mt-4 space-y-3">
              {clients.map((client) => (
                <div key={client.id} className={`w-full rounded-2xl border p-4 text-left ${selectedClientId === client.id ? "border-[#7d4af9] bg-[#7d4af9]/10" : "border-white/10 bg-[#0a0a0f]"}`}>
                  <button type="button" onClick={() => setSelectedClientId(client.id)} className="w-full text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{client.nome}</span>
                      <span className="text-xs uppercase tracking-[0.25em] text-zinc-500">{client.status}</span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-400">{client.plano} • {client.skillsAtivas.join(", ")}</p>
                    <p className="mt-2 break-all text-xs text-zinc-500">{getClientUrl(client.token)}</p>
                  </button>
                  <div className="mt-3 flex items-center gap-2">
                    <button type="button" onClick={() => copyClientLink(client)} className="rounded-full border border-[#7d4af9]/30 px-3 py-2 text-sm text-[#a65df9]">{copiedClientId === client.id ? "Copiado!" : "Copiar link"}</button>
                    <button type="button" onClick={() => deleteClient(client.id)} className="rounded-full border border-red-500/30 p-2 text-red-300 transition hover:bg-red-500/10" aria-label="Excluir cliente">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          <p className="font-medium">Tem certeza que deseja excluir esta pergunta?</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={confirmDeleteQuestion} className="rounded-full bg-red-500 px-3 py-2 text-white">Excluir</button>
            <button type="button" onClick={() => setPendingDelete(null)} className="rounded-full border border-white/10 px-3 py-2 text-zinc-300">Cancelar</button>
          </div>
        </div>
      )}

      {pendingDeleteClientId && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          <p className="font-medium">Tem certeza que deseja excluir este cliente? O link de implantação dele deixará de funcionar.</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={confirmDeleteClient} className="rounded-full bg-red-500 px-3 py-2 text-white">Excluir</button>
            <button type="button" onClick={() => setPendingDeleteClientId(null)} className="rounded-full border border-white/10 px-3 py-2 text-zinc-300">Cancelar</button>
          </div>
        </div>
      )}

      {view === "respostas" && (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-white/10 bg-[#111118] p-6">
            <h3 className="text-xl font-semibold text-white">Resumo das implantações</h3>
            <div className="mt-4 space-y-3">
              {clients.map((client) => (
                <div key={client.id} className={`rounded-2xl border p-4 ${selectedClientId === client.id ? "border-[#7d4af9] bg-[#7d4af9]/10" : "border-white/10 bg-[#0a0a0f]"}`}>
                  <button type="button" onClick={() => setSelectedClientId(client.id)} className="w-full text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{client.nome}</span>
                      <span className="text-xs uppercase tracking-[0.25em] text-zinc-500">{client.status}</span>
                    </div>
                  </button>
                  <p className="mt-2 text-sm text-zinc-400">Plano: {planLabels[client.plano]}</p>
                  <p className="mt-2 break-all text-xs text-zinc-500">{getClientUrl(client.token)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => updateClientStatus(client.id, "EM_ANDAMENTO")} className="rounded-full border border-white/10 px-3 py-1 text-sm text-zinc-300">Em andamento</button>
                    <button type="button" onClick={() => updateClientStatus(client.id, "CONCLUIDO")} className="rounded-full border border-[#7d4af9]/30 px-3 py-1 text-sm text-[#a65df9]">Concluir</button>
                    <button type="button" onClick={() => copyClientLink(client)} className="rounded-full border border-[#7d4af9]/30 px-3 py-1 text-sm text-[#a65df9]">{copiedClientId === client.id ? "Copiado!" : "Copiar link"}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111118] p-6">
            <h3 className="text-xl font-semibold text-white">Detalhes</h3>
            {selectedClient ? (
              <div className="mt-4 space-y-3 text-sm text-zinc-400">
                <p><span className="font-semibold text-white">Cliente:</span> {selectedClient.nome}</p>
                <p><span className="font-semibold text-white">Token:</span> {selectedClient.token}</p>
                <p><span className="font-semibold text-white">Plano:</span> {planLabels[selectedClient.plano]}</p>
                <p><span className="font-semibold text-white">Skills:</span> {selectedClient.skillsAtivas.join(", ")}</p>

                <div className="rounded-2xl border border-white/10 bg-[#0a0a0f] p-4">
                  <p className="font-semibold text-white">Respostas por bloco</p>
                  {loadingAnswers && <p className="mt-2 text-sm text-zinc-500">Carregando respostas...</p>}
                  {!loadingAnswers && answersSummary && !answersSummary.blocos.length && (
                    <p className="mt-2 text-sm text-zinc-500">Este cliente ainda não respondeu o formulário.</p>
                  )}
                  {!loadingAnswers && answersSummary && answersSummary.blocos.length > 0 && (
                    <div className="mt-3 space-y-4">
                      {answersSummary.blocos.map((bloco) => (
                        <div key={bloco.titulo}>
                          <p className="text-sm font-semibold text-[#a65df9]">{bloco.titulo}</p>
                          <div className="mt-2 space-y-2">
                            {bloco.perguntas.map((pergunta) => (
                              <div key={pergunta.texto} className="rounded-xl border border-white/10 bg-[#111118] p-3">
                                <p className="text-xs text-zinc-500">{pergunta.texto}</p>
                                <p className="mt-1 text-sm text-white">{pergunta.valores.length ? pergunta.valores.join(", ") : "—"}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0a0a0f] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-white">Prompt do agente</p>
                    <button type="button" onClick={() => generatePrompt(selectedClient.id)} disabled={generatingPrompt} className="rounded-full bg-[#7d4af9] px-3 py-1 text-sm font-medium text-white disabled:opacity-50">
                      {generatingPrompt ? "Gerando..." : "Gerar prompt"}
                    </button>
                  </div>
                  {generatedPrompt && (
                    <div className="mt-3 space-y-2">
                      <textarea readOnly value={generatedPrompt} className="h-64 w-full rounded-xl border border-white/10 bg-[#111118] px-3 py-2 text-xs text-zinc-300" />
                      <button type="button" onClick={copyGeneratedPrompt} className="rounded-full border border-[#7d4af9]/30 px-3 py-2 text-sm text-[#a65df9]">{copiedPrompt ? "Copiado!" : "Copiar prompt"}</button>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0a0a0f] p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-white">Perguntas adicionais deste cliente</p>
                    <button type="button" onClick={() => setShowExtraQuestionForm((value) => !value)} className="rounded-full border border-[#7d4af9]/30 px-3 py-1 text-sm text-[#a65df9]">{showExtraQuestionForm ? "Fechar" : "Adicionar pergunta"}</button>
                  </div>
                  {showExtraQuestionForm && (
                    <div className="mt-3 space-y-2">
                      <input value={extraQuestionText} onChange={(event) => setExtraQuestionText(event.target.value)} placeholder="Texto da pergunta" className="w-full rounded-xl border border-white/10 bg-[#111118] px-3 py-2 text-sm text-white" />
                      <select value={extraQuestionType} onChange={(event) => setExtraQuestionType(event.target.value as QuestionType)} className="w-full rounded-xl border border-white/10 bg-[#111118] px-3 py-2 text-sm text-white">
                        <option value="TEXTO_CURTO">Texto curto</option>
                        <option value="TEXTO_LONGO">Texto longo</option>
                        <option value="SELECT">Select</option>
                        <option value="MULTISELECT">Multiselect</option>
                        <option value="ARQUIVO">Arquivo</option>
                        <option value="SIM_NAO">Sim/Não</option>
                      </select>
                      <label className="flex items-center gap-2 text-sm text-zinc-300">
                        <input type="checkbox" checked={extraQuestionRequired} onChange={() => setExtraQuestionRequired((value) => !value)} />
                        Obrigatória
                      </label>
                      <button type="button" onClick={() => addExtraQuestion(selectedClient.id)} className="rounded-full bg-[#7d4af9] px-3 py-2 text-sm font-medium text-white">Salvar pergunta</button>
                    </div>
                  )}
                  <div className="mt-3 space-y-2">
                    {(selectedClient.perguntasExtras ?? []).map((question) => (
                      <div key={question.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#111118] px-3 py-2 text-sm text-zinc-300">
                        <div>
                          <p className="text-white">{question.texto}</p>
                          <p className="text-xs text-zinc-500">{question.tipo} • {question.obrigatoria ? "Obrigatória" : "Opcional"}</p>
                        </div>
                        <button type="button" onClick={() => removeExtraQuestion(selectedClient.id, question.id)} className="rounded-full border border-red-500/30 px-2 py-1 text-xs text-red-300">Excluir</button>
                      </div>
                    ))}
                    {!selectedClient.perguntasExtras?.length && <p className="text-sm text-zinc-500">Nenhuma pergunta extra adicionada para este cliente.</p>}
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-zinc-400">Selecione uma implantação para ver os detalhes.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

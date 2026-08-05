"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getVisibleBlocks, planLimits, skillLabels } from "@/lib/mock-data";
import type { Block, ClientRecord, Skill } from "@/types/form";

const NICHO_OPTIONS = {
  veicular: "Proteção veicular",
  outro: "Outro",
} as const;

const ADMIN_ONLY_QUESTION_TEXTS = new Set([
  "Plano contratado",
  "Quais Skills vocês querem ativar no agente?",
  "Quantas instâncias de WhatsApp serão usadas, e para qual finalidade cada uma?",
]);

type FormValues = Record<string, unknown>;

interface PublicFormProps {
  token: string;
}

export function PublicForm({ token }: PublicFormProps) {
  const [cliente, setCliente] = useState<ClientRecord | null>(null);
  const [loadingCliente, setLoadingCliente] = useState(true);
  const [allBlocks, setAllBlocks] = useState<Block[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit } = useForm<FormValues>();

  const selectedSkills = useMemo(() => cliente?.skillsAtivas ?? [], [cliente]);
  const selectedPlan = cliente?.plano ?? "SCALE";
  const selectedNicho = cliente?.nicho ?? "veicular";

  useEffect(() => {
    setLoadingCliente(true);
    fetch(`/api/clientes/token/${token}`)
      .then((response) => {
        if (!response.ok) throw new Error("Cliente não encontrado");
        return response.json() as Promise<ClientRecord>;
      })
      .then((foundClient) => setCliente(foundClient))
      .catch(() => setCliente(null))
      .finally(() => setLoadingCliente(false));

    fetch("/api/blocos")
      .then((response) => response.json())
      .then((data: Block[]) => setAllBlocks(data))
      .catch(() => toast.error("Não foi possível carregar as perguntas do formulário."));
  }, [token]);

  const blocks = useMemo(() => getVisibleBlocks(allBlocks, selectedSkills as Skill[]), [allBlocks, selectedSkills]);

  const planSummary = useMemo(() => planLimits[selectedPlan], [selectedPlan]);
  const extraQuestionsBlock = useMemo(() => {
    if (!cliente?.perguntasExtras?.length) return null;
    return {
      id: "cliente-extra",
      titulo: "Perguntas adicionais",
      ordem: 999,
      skillVinculada: null,
      perguntas: cliente.perguntasExtras.map((question) => ({
        id: question.id,
        blocoId: "cliente-extra",
        texto: question.texto,
        tipo: question.tipo,
        obrigatoria: question.obrigatoria,
        ordem: 1,
        repetivel: false,
        opcoes: question.opcoes ?? [],
      })),
    } as Block;
  }, [cliente]);

  const visibleBlocks = useMemo(() => {
    const filteredBlocks = blocks.map((block) => ({
      ...block,
      perguntas: block.perguntas.filter((question) => {
        if (ADMIN_ONLY_QUESTION_TEXTS.has(question.texto)) return false;
        const matchesNicho = !question.nichoVinculado || question.nichoVinculado === selectedNicho;
        const matchesSkill = !block.skillVinculada || selectedSkills.includes(block.skillVinculada as Skill);
        return matchesNicho && matchesSkill;
      }),
    })).filter((block) => block.perguntas.length > 0);

    if (!extraQuestionsBlock) return filteredBlocks;
    return [...filteredBlocks, extraQuestionsBlock];
  }, [blocks, extraQuestionsBlock, selectedNicho, selectedSkills]);

  const onSubmit = async (data: FormValues) => {
    if (!cliente) return;

    const respostas = visibleBlocks
      .flatMap((block) => block.perguntas)
      .map((question) => {
        const rawValue = data[question.id];
        const valor = Array.isArray(rawValue) ? rawValue.join(", ") : rawValue;
        return { perguntaId: question.id, valor: valor != null ? String(valor) : "" };
      })
      .filter((resposta) => resposta.valor !== "");

    setSubmitting(true);
    try {
      const response = await fetch("/api/respostas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clienteId: cliente.id, respostas }),
      });
      if (!response.ok) throw new Error("Falha ao enviar");
      setSubmitted(true);
      toast.success("Respostas salvas com sucesso.");
    } catch {
      toast.error("Não foi possível salvar as respostas. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCliente) {
    return <div className="rounded-2xl border border-white/10 bg-[#111118] p-6 text-sm text-zinc-400">Carregando...</div>;
  }

  if (!cliente) {
    return <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-sm text-red-200">Token inválido ou não encontrado.</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#111118] p-6 shadow-2xl shadow-black/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <img src="/evo_ia_roxo.png" alt="Evo" className="h-8 w-auto" />
            <p className="mt-3 text-sm uppercase tracking-[0.3em] text-[#a65df9]">Implantação Evo</p>
            <h1 className="text-3xl font-semibold text-white">Configuração inicial do agente</h1>
            <p className="mt-2 text-sm text-zinc-400">Olá, {cliente.nome}. Complete as informações abaixo para preparar a implantação.</p>
          </div>
          <div className="rounded-2xl border border-[#7d4af9]/30 bg-[#0a0a0f] p-4 text-sm text-zinc-300">
            <div>Plano: <span className="font-semibold text-white">{cliente.plano}</span></div>
            <div>Nicho: <span className="font-semibold text-white">{NICHO_OPTIONS[cliente.nicho]}</span></div>
            <div>Skills: <span className="font-semibold text-white">{cliente.skillsAtivas.join(", ")}</span></div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#111118] p-4">
          <p className="text-sm text-zinc-400">Limite de skills</p>
          <p className="mt-2 text-2xl font-semibold text-white">{planSummary.skills}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#111118] p-4">
          <p className="text-sm text-zinc-400">Instâncias de WhatsApp</p>
          <p className="mt-2 text-2xl font-semibold text-white">{planSummary.whatsapp}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#111118] p-4">
          <p className="text-sm text-zinc-400">Skills selecionadas</p>
          <p className="mt-2 text-sm font-semibold text-white">{selectedSkills.length ? selectedSkills.map((skill) => skillLabels[skill as Skill]).join(" • ") : "Nenhuma"}</p>
        </div>
      </div>

      {visibleBlocks.map((block) => (
        <section key={block.id} className="rounded-2xl border border-white/10 bg-[#111118] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">{block.titulo}</h2>
            <span className="rounded-full border border-[#7d4af9]/30 bg-[#7d4af9]/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-[#a65df9]">{block.skillVinculada ?? "Sempre visível"}</span>
          </div>
          <div className="space-y-4">
            {block.perguntas.map((question) => (
              <label key={question.id} className="block space-y-2 text-sm text-zinc-300">
                <span>{question.texto}</span>
                {question.tipo === "TEXTO_LONGO" ? (
                  <textarea {...register(question.id as keyof FormValues)} className="min-h-24 w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-white outline-none ring-0" />
                ) : question.tipo === "SELECT" ? (
                  <select {...register(question.id as keyof FormValues)} className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-white outline-none ring-0">
                    {question.opcoes.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                ) : question.tipo === "MULTISELECT" ? (
                  <div className="flex flex-wrap gap-2">
                    {question.opcoes.map((option) => (
                      <label key={option} className="rounded-full border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-zinc-400">
                        <input type="checkbox" value={option} className="mr-2" {...register(question.id as keyof FormValues)} />
                        {option}
                      </label>
                    ))}
                  </div>
                ) : question.tipo === "ARQUIVO" ? (
                  <input type="file" className="w-full rounded-xl border border-dashed border-white/10 bg-[#0a0a0f] px-3 py-2 text-white" />
                ) : question.tipo === "SIM_NAO" ? (
                  <div className="flex gap-3">
                    <label className="rounded-full border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-zinc-400">
                      <input type="radio" value="SIM" className="mr-2" {...register(question.id as keyof FormValues)} />
                      Sim
                    </label>
                    <label className="rounded-full border border-white/10 bg-[#0a0a0f] px-3 py-2 text-sm text-zinc-400">
                      <input type="radio" value="NAO" className="mr-2" {...register(question.id as keyof FormValues)} />
                      Não
                    </label>
                  </div>
                ) : (
                  <input {...register(question.id as keyof FormValues)} className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-white outline-none ring-0" />
                )}
              </label>
            ))}
          </div>
        </section>
      ))}

      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#111118] p-4">
        <p className="text-sm text-zinc-400">{submitted ? "Seu envio foi registrado e ficará disponível no painel admin." : "Suas respostas ficam salvas e disponíveis no painel admin."}</p>
        <button type="submit" disabled={submitting} className="rounded-full bg-[#7d4af9] px-4 py-2 font-medium text-white transition hover:bg-[#a65df9] disabled:opacity-50">{submitting ? "Enviando..." : "Enviar respostas"}</button>
      </div>
    </form>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { getVisibleBlocks, initialBlocks, initialClients, planLimits, skillLabels } from "@/lib/mock-data";
import type { Block, ClientRecord, Plano, Skill } from "@/types/form";

const NICHO_OPTIONS = {
  veicular: "Proteção veicular",
  outro: "Outro",
} as const;

const schema = z.object({
  nomeAssociacao: z.string().min(1, "Informe o nome da associação"),
  responsavel: z.string().min(1, "Informe o responsável"),
  whatsapp: z.string().min(1, "Informe o WhatsApp"),
  email: z.string().email("Informe um e-mail válido"),
  plano: z.enum(["FLOW", "SCALE", "TEAM"]),
  skillsAtivas: z.array(z.string()).min(1, "Selecione ao menos uma skill"),
  instanciasWhatsapp: z.string().min(1, "Informe quantas instâncias serão usadas"),
});

type FormValues = z.infer<typeof schema> & Record<string, unknown>;

interface PublicFormProps {
  token: string;
}

export function PublicForm({ token }: PublicFormProps) {
  const [cliente, setCliente] = useState<ClientRecord | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      nomeAssociacao: "",
      responsavel: "",
      whatsapp: "",
      email: "",
      plano: "SCALE",
      skillsAtivas: ["COMERCIAL"],
      instanciasWhatsapp: "",
    } as FormValues,
  });

  const selectedSkills = (watch("skillsAtivas") as Skill[]) || [];
  const selectedPlan = (watch("plano") as Plano) || "SCALE";
  const selectedNicho = cliente?.nicho ?? "veicular";

  useEffect(() => {
    const storedClients = window.localStorage.getItem("form-evo-clients");
    const persistedClients = storedClients ? (JSON.parse(storedClients) as ClientRecord[]) : initialClients;
    const foundClient = persistedClients.find((item) => item.token === token) ?? initialClients.find((item) => item.token === token) ?? null;
    setCliente(foundClient);
    if (foundClient) {
      setValue("plano", foundClient.plano);
      setValue("skillsAtivas", foundClient.skillsAtivas);
    }

    const visibleBlocks = getVisibleBlocks(initialBlocks, foundClient?.skillsAtivas ?? ["COMERCIAL"]);
    setBlocks(visibleBlocks);
  }, [token, setValue]);

  useEffect(() => {
    const visibleBlocks = getVisibleBlocks(initialBlocks, selectedSkills as Skill[]);
    setBlocks(visibleBlocks);
  }, [selectedSkills]);

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
        const matchesNicho = !question.nichoVinculado || question.nichoVinculado === selectedNicho;
        const matchesSkill = !block.skillVinculada || selectedSkills.includes(block.skillVinculada as Skill);
        return matchesNicho && matchesSkill;
      }),
    })).filter((block) => block.perguntas.length > 0);

    if (!extraQuestionsBlock) return filteredBlocks;
    return [...filteredBlocks, extraQuestionsBlock];
  }, [blocks, extraQuestionsBlock, selectedNicho, selectedSkills]);

  const onSubmit = (data: FormValues) => {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error("Revise os campos obrigatórios antes de enviar.");
      return;
    }

    const payload = {
      token,
      cliente: cliente?.nome ?? "Cliente",
      submittedAt: new Date().toISOString(),
      ...data,
    };

    const existingDrafts = JSON.parse(localStorage.getItem("form-evo-drafts") ?? "[]") as Array<Record<string, unknown>>;
    localStorage.setItem("form-evo-drafts", JSON.stringify([...existingDrafts, payload]));
    setSubmitted(true);
    toast.success("Respostas salvas com sucesso.");
  };

  if (!cliente) {
    return <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-sm text-red-200">Token inválido ou não encontrado.</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#111118] p-6 shadow-2xl shadow-black/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#a65df9]">Implantação Evo</p>
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

      <div className="rounded-2xl border border-white/10 bg-[#111118] p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-zinc-300">
            <span>Nome da associação</span>
            <input {...register("nomeAssociacao")} className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-white outline-none ring-0" />
          </label>
          <label className="space-y-2 text-sm text-zinc-300">
            <span>Responsável pelo projeto</span>
            <input {...register("responsavel")} className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-white outline-none ring-0" />
          </label>
          <label className="space-y-2 text-sm text-zinc-300">
            <span>WhatsApp</span>
            <input {...register("whatsapp")} className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-white outline-none ring-0" />
          </label>
          <label className="space-y-2 text-sm text-zinc-300">
            <span>E-mail</span>
            <input type="email" {...register("email")} className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-white outline-none ring-0" />
          </label>
          <label className="space-y-2 text-sm text-zinc-300">
            <span>Plano contratado</span>
            <select {...register("plano")} className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-white outline-none ring-0">
              <option value="FLOW">Flow</option>
              <option value="SCALE">Scale</option>
              <option value="TEAM">Team</option>
            </select>
          </label>
          <label className="space-y-2 text-sm text-zinc-300">
            <span>Instâncias de WhatsApp</span>
            <input {...register("instanciasWhatsapp")} className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-3 py-2 text-white outline-none ring-0" />
          </label>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-sm font-medium text-white">Skills a ativar</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(skillLabels).map(([value, label]) => {
              const skillValue = value as Skill;
              const checked = (selectedSkills as Skill[]).includes(skillValue);
              return (
                <label key={value} className={`rounded-full border px-3 py-2 text-sm ${checked ? "border-[#7d4af9] bg-[#7d4af9]/20 text-white" : "border-white/10 bg-[#0a0a0f] text-zinc-400"}`}>
                  <input
                    type="checkbox"
                    value={skillValue}
                    className="mr-2"
                    checked={checked}
                    onChange={(event) => {
                      const current = [...(selectedSkills as Skill[])];
                      if (event.target.checked) {
                        current.push(skillValue);
                      } else {
                        const index = current.indexOf(skillValue);
                        if (index > -1) current.splice(index, 1);
                      }
                      setValue("skillsAtivas", current);
                    }}
                  />
                  {label}
                </label>
              );
            })}
          </div>
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
        <p className="text-sm text-zinc-400">{submitted ? "Seu envio foi registrado e ficará disponível no painel admin." : "As respostas ficam salvas localmente para simular o fluxo completo da implantação."}</p>
        <button type="submit" className="rounded-full bg-[#7d4af9] px-4 py-2 font-medium text-white transition hover:bg-[#a65df9]">Enviar respostas</button>
      </div>
    </form>
  );
}

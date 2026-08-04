import { promises as fs } from "fs";
import path from "path";
import { initialBlocks, initialClients } from "@/lib/mock-data";
import type { Block, ClientRecord } from "@/types/form";

export interface AdminStore {
  blocks: Block[];
  clients: ClientRecord[];
  responses: Array<{
    id: string;
    clientId: string;
    clientName: string;
    createdAt: string;
    answers: Record<string, unknown>;
  }>;
}

const storePath = path.join(process.cwd(), "data", "admin-store.json");

async function ensureStoreFile() {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  try {
    await fs.access(storePath);
  } catch {
    const initialStore: AdminStore = {
      blocks: initialBlocks,
      clients: initialClients,
      responses: [],
    };
    await fs.writeFile(storePath, JSON.stringify(initialStore, null, 2), "utf8");
  }
}

export async function loadAdminStore(): Promise<AdminStore> {
  await ensureStoreFile();
  const raw = await fs.readFile(storePath, "utf8");
  return JSON.parse(raw) as AdminStore;
}

export async function saveAdminStore(store: AdminStore) {
  await ensureStoreFile();
  await fs.writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
}

export async function getAdminBlocks() {
  const store = await loadAdminStore();
  return store.blocks;
}

export async function deleteQuestion(questionId: string) {
  const store = await loadAdminStore();
  const nextBlocks = store.blocks.map((block) => ({
    ...block,
    perguntas: block.perguntas.filter((question) => question.id !== questionId),
  }));
  store.blocks = nextBlocks;
  await saveAdminStore(store);
  return nextBlocks;
}

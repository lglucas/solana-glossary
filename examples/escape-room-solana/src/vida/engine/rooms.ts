/**
 * @arquivo rooms.ts
 * @descricao Sistema de salas online — cria, entra, sincroniza via Supabase Realtime
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao (@lg_lucas) — Tokenfy.me
 */
import { supabase } from "../../lib/supabase";

// ─── Tipos ─────────────────────────────────────────────────────────────────

export interface RoomPlayer {
  id: string;
  nickname: string;
  avatar: string;
  color: string;
  walletAddress: string;
  isHost: boolean;
  joinedAt: string;
}

export interface Room {
  code: string;
  theme: string;
  hostWallet: string;
  status: "waiting" | "playing" | "finished";
  players: RoomPlayer[];
  createdAt: string;
}

const STORAGE_KEY = "vida_rooms";
const COLORS = [
  "#9945FF",
  "#14F195",
  "#00D1FF",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#8B5CF6",
  "#10B981",
];

// ─── Gerar codigo de sala ──────────────────────────────────────────────────

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++)
    code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ─── Storage local (fallback se Supabase nao configurado) ──────────────────

function loadRooms(): Record<string, Room> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveRooms(rooms: Record<string, Room>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
}

// ─── API publica ───────────────────────────────────────────────────────────

/** Cria uma sala nova. Retorna o codigo. */
export function createRoom(
  theme: string,
  host: { nickname: string; avatar: string; walletAddress: string },
): string {
  const code = generateCode();
  const room: Room = {
    code,
    theme,
    hostWallet: host.walletAddress,
    status: "waiting",
    players: [
      {
        id: crypto.randomUUID(),
        nickname: host.nickname,
        avatar: host.avatar,
        color: COLORS[0],
        walletAddress: host.walletAddress,
        isHost: true,
        joinedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  };
  const rooms = loadRooms();
  rooms[code] = room;
  saveRooms(rooms);
  syncRoomToSupabase(room);
  return code;
}

/** Entra em uma sala existente. Retorna a sala ou null se nao existe. */
export function joinRoom(
  code: string,
  player: { nickname: string; avatar: string; walletAddress: string },
): Room | null {
  const rooms = loadRooms();
  const room = rooms[code];
  if (!room || room.status !== "waiting") return null;
  if (room.players.length >= 8) return null;
  if (room.players.some((p) => p.walletAddress === player.walletAddress))
    return room;

  room.players.push({
    id: crypto.randomUUID(),
    nickname: player.nickname,
    avatar: player.avatar,
    color: COLORS[room.players.length % COLORS.length],
    walletAddress: player.walletAddress,
    isHost: false,
    joinedAt: new Date().toISOString(),
  });
  saveRooms(rooms);
  syncRoomToSupabase(room);
  return room;
}

/** Busca uma sala por codigo */
export function getRoom(code: string): Room | null {
  return loadRooms()[code] ?? null;
}

/** Atualiza status da sala */
export function updateRoomStatus(code: string, status: Room["status"]): void {
  const rooms = loadRooms();
  if (rooms[code]) {
    rooms[code].status = status;
    saveRooms(rooms);
  }
}

/** Gera URL de convite */
export function getInviteUrl(code: string): string {
  return `${window.location.origin}/vida/sala/${code}`;
}

// ─── Supabase sync (melhor esforco) ────────────────────────────────────────

async function syncRoomToSupabase(room: Room): Promise<void> {
  try {
    const url = import.meta.env.VITE_SUPABASE_URL;
    if (!url || url === "" || url === "https://xxx.supabase.co") return;
    await (
      supabase.from("multiplayer_rooms") as ReturnType<typeof supabase.from>
    ).upsert(
      {
        code: room.code,
        board: room.theme,
        status: room.status,
        host_id: room.hostWallet,
        game_state: JSON.stringify(room),
      } as never,
      { onConflict: "code" },
    );
  } catch {
    /* noop */
  }
}

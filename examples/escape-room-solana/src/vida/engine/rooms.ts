/**
 * @arquivo rooms.ts
 * @descricao Sistema de salas online — Supabase como storage primario
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
}

export interface Room {
  code: string;
  theme: string;
  hostWallet: string;
  status: "waiting" | "playing" | "finished";
  players: RoomPlayer[];
}

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

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++)
    code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ─── Criar sala ────────────────────────────────────────────────────────────

export async function createRoom(
  theme: string,
  host: { nickname: string; avatar: string; walletAddress: string },
): Promise<string> {
  const code = generateCode();

  await supabase.from("multiplayer_rooms" as never).insert({
    code,
    board: theme,
    host_wallet: host.walletAddress,
    status: "waiting",
  } as never);

  await supabase.from("room_players" as never).insert({
    room_id: await getRoomId(code),
    wallet_address: host.walletAddress,
    nickname: host.nickname,
    avatar: host.avatar,
    color: COLORS[0],
    is_host: true,
  } as never);

  return code;
}

// ─── Entrar na sala ────────────────────────────────────────────────────────

export async function joinRoom(
  code: string,
  player: { nickname: string; avatar: string; walletAddress: string },
): Promise<Room | null> {
  const roomId = await getRoomId(code);
  if (!roomId) return null;

  const { data: room } = await supabase
    .from("multiplayer_rooms" as never)
    .select("*")
    .eq("code", code)
    .single();
  if (!room || (room as { status: string }).status !== "waiting") return null;

  const { data: existing } = await supabase
    .from("room_players" as never)
    .select("*")
    .eq("room_id", roomId)
    .eq("wallet_address", player.walletAddress);
  if (existing && (existing as unknown[]).length > 0) return getRoom(code);

  const { data: allPlayers } = await supabase
    .from("room_players" as never)
    .select("*")
    .eq("room_id", roomId);
  const count = (allPlayers as unknown[] | null)?.length ?? 0;
  if (count >= 8) return null;

  await supabase.from("room_players" as never).insert({
    room_id: roomId,
    wallet_address: player.walletAddress,
    nickname: player.nickname,
    avatar: player.avatar,
    color: COLORS[count % COLORS.length],
    is_host: false,
  } as never);

  return getRoom(code);
}

// ─── Buscar sala ───────────────────────────────────────────────────────────

export async function getRoom(code: string): Promise<Room | null> {
  const { data: room } = await supabase
    .from("multiplayer_rooms" as never)
    .select("*")
    .eq("code", code)
    .single();
  if (!room) return null;
  const r = room as {
    id: string;
    code: string;
    board: string;
    host_wallet: string;
    status: string;
  };

  const { data: players } = await supabase
    .from("room_players" as never)
    .select("*")
    .eq("room_id", r.id)
    .order("joined_at" as never);

  const mapped: RoomPlayer[] = ((players as unknown[]) ?? []).map(
    (p: unknown) => {
      const rp = p as {
        id: string;
        nickname: string;
        avatar: string;
        color: string;
        wallet_address: string;
        is_host: boolean;
      };
      return {
        id: rp.id,
        nickname: rp.nickname,
        avatar: rp.avatar ?? "⚡",
        color: rp.color,
        walletAddress: rp.wallet_address,
        isHost: rp.is_host,
      };
    },
  );

  return {
    code: r.code,
    theme: r.board,
    hostWallet: r.host_wallet,
    status: r.status as Room["status"],
    players: mapped,
  };
}

/** Atualiza status da sala */
export async function updateRoomStatus(
  code: string,
  status: Room["status"],
): Promise<void> {
  await supabase
    .from("multiplayer_rooms" as never)
    .update({ status } as never)
    .eq("code", code);
}

/** Gera URL de convite */
export function getInviteUrl(code: string): string {
  return `${window.location.origin}/vida/sala/${code}`;
}

// ─── Helper ────────────────────────────────────────────────────────────────

async function getRoomId(code: string): Promise<string | null> {
  const { data } = await supabase
    .from("multiplayer_rooms" as never)
    .select("id")
    .eq("code", code)
    .single();
  return data ? (data as { id: string }).id : null;
}

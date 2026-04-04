/**
 * @arquivo Lobby.tsx
 * @descricao Sala de espera online — criar sala, compartilhar codigo, aguardar jogadores
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao (@lg_lucas) — Tokenfy.me
 */
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useProfile } from "../../hooks/useProfile";
import {
  createRoom,
  joinRoom,
  getRoom,
  getInviteUrl,
  type Room,
} from "../engine/rooms";

interface Props {
  theme: string;
  roomCode?: string;
  onStart: (
    players: Array<{ name: string; color: string }>,
    roomCode?: string,
  ) => void;
}

export default function Lobby({ theme, roomCode, onStart }: Props) {
  const { t } = useTranslation();
  const { profile, connected } = useProfile();
  const [room, setRoom] = useState<Room | null>(null);
  const [joinCode, setJoinCode] = useState(roomCode ?? "");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-entrar se veio por link de convite
  useEffect(() => {
    if (!profile || !roomCode) return;
    setLoading(true);
    joinRoom(roomCode, profile).then((r) => {
      if (r) setRoom(r);
      else setError(t("vida.roomNotFound"));
      setLoading(false);
    });
  }, [roomCode, profile]);

  // Poll Supabase para atualizar jogadores
  useEffect(() => {
    if (!room) return;
    const interval = setInterval(() => {
      getRoom(room.code).then((updated) => {
        if (updated) setRoom(updated);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [room?.code]);

  const handleCreate = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    const code = await createRoom(theme, profile);
    const r = await getRoom(code);
    setRoom(r);
    setLoading(false);
  }, [theme, profile]);

  const handleJoin = useCallback(async () => {
    if (!profile || !joinCode.trim()) return;
    setLoading(true);
    const r = await joinRoom(joinCode.trim().toUpperCase(), profile);
    if (r) {
      setRoom(r);
      setError("");
    } else setError(t("vida.roomNotFound"));
    setLoading(false);
  }, [profile, joinCode]);

  const handleCopy = () => {
    if (!room) return;
    navigator.clipboard.writeText(getInviteUrl(room.code));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStart = () => {
    if (!room || room.players.length < 2) return;
    onStart(
      room.players.map((p) => ({ name: p.nickname, color: p.color })),
      room.code,
    );
  };

  const isHost = room && profile && room.hostWallet === profile.walletAddress;

  if (!connected || !profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-sm mb-2">{t("vida.connectFirst")}</p>
        <p className="text-gray-600 text-xs">{t("vida.connectHint")}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!room) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm mx-auto space-y-6"
      >
        <div className="text-center mb-4">
          <span className="text-3xl">{profile.avatar}</span>
          <p className="text-sm text-white mt-2">{profile.nickname}</p>
        </div>
        <button
          onClick={handleCreate}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-opacity"
        >
          {t("vida.createRoom")}
        </button>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-gray-600">{t("vida.or")}</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        <div className="flex gap-2">
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder={t("vida.enterCode")}
            maxLength={6}
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center font-mono tracking-widest text-lg focus:border-cyan-400 outline-none uppercase"
          />
          <button
            onClick={handleJoin}
            className="px-6 py-3 rounded-xl border border-white/20 text-white hover:border-cyan-400 transition-colors"
          >
            {t("vida.join")}
          </button>
        </div>
        {error && <p className="text-red-400 text-xs text-center">{error}</p>}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="text-center mb-6">
        <p className="text-xs text-gray-500 mb-1">{t("vida.roomCode")}</p>
        <p className="text-4xl font-bold font-mono tracking-[0.3em] text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">
          {room.code}
        </p>
        <button
          onClick={handleCopy}
          className="mt-2 text-xs text-gray-500 hover:text-cyan-400 transition-colors"
        >
          {copied ? "✓ " + t("vida.copied") : t("vida.copyLink")}
        </button>
      </div>
      <div className="space-y-2 mb-6">
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          {t("vida.playersInRoom", { count: room.players.length })}
        </p>
        {room.players.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5"
          >
            <div
              className="w-5 h-5 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-sm">{p.avatar}</span>
            <span className="text-sm text-white flex-1">{p.nickname}</span>
            {p.isHost && (
              <span className="text-[10px] text-yellow-400 font-mono">
                HOST
              </span>
            )}
          </div>
        ))}
      </div>
      {isHost ? (
        <button
          onClick={handleStart}
          disabled={room.players.length < 2}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {room.players.length < 2
            ? t("vida.waitingPlayers")
            : t("vida.startGame")}
        </button>
      ) : (
        <p className="text-center text-sm text-gray-500">
          {t("vida.waitingHost")}
        </p>
      )}
    </motion.div>
  );
}

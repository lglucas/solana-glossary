/**
 * @arquivo BoardCard.tsx
 * @descricao Card de preview de tabuleiro com visual distinto por variante
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao — AceleradoraECO
 */

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { NeonGrid } from "./NeonGrid";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface BoardInfo {
  id: string;
  nameKey: string;
  desc: string;
  variant: "neon" | "matrix" | "pixel";
  accent: string;
  glow: string;
  players: string;
  font: string;
}

// ---------------------------------------------------------------------------
// Dados dos 3 tabuleiros
// ---------------------------------------------------------------------------

export const BOARDS: BoardInfo[] = [
  {
    id: "normie",
    nameKey: "vida.boards.normie",
    desc: "Evolua de novato a validator na rede Solana",
    variant: "neon",
    accent: "#00fff0",
    glow: "#00fff044",
    players: "2-8",
    font: "'Orbitron', sans-serif",
  },
  {
    id: "startup",
    nameKey: "vida.boards.startup",
    desc: "Construa sua startup no ecossistema Solana",
    variant: "matrix",
    accent: "#00ff41",
    glow: "#00ff4144",
    players: "2-8",
    font: "'Share Tech Mono', monospace",
  },
  {
    id: "timeline",
    nameKey: "vida.boards.timeline",
    desc: "Reviva os marcos historicos da Solana",
    variant: "pixel",
    accent: "#ff6ec7",
    glow: "#ff6ec744",
    players: "2-8",
    font: "'Press Start 2P', cursive",
  },
];

// ---------------------------------------------------------------------------
// Animacao
// ---------------------------------------------------------------------------

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

interface BoardCardProps {
  board: BoardInfo;
  onPlay: () => void;
  playLabel: string;
  playersLabel: string;
}

export function BoardCard({
  board,
  onPlay,
  playLabel,
  playersLabel,
}: BoardCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4, scale: 1.02 }}
      className="rounded-xl overflow-hidden flex flex-col"
      style={{
        border: `1px solid ${board.accent}33`,
        background: "#0a0a1eee",
        boxShadow: `0 0 30px ${board.glow}`,
      }}
    >
      {/* Preview visual — muda por variante */}
      <div className="h-32 relative overflow-hidden">
        <NeonGrid variant={board.variant} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-lg font-bold tracking-wider opacity-60"
            style={{ fontFamily: board.font, color: board.accent }}
          >
            {board.variant === "pixel" ? "PIXEL" : board.variant.toUpperCase()}
          </span>
        </div>
        {/* Fade inferior */}
        <div
          className="absolute bottom-0 inset-x-0 h-8"
          style={{
            background: "linear-gradient(transparent, #0a0a1e)",
          }}
        />
      </div>

      {/* Informacoes */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <h3
          className="text-base font-semibold"
          style={{ fontFamily: board.font, color: board.accent }}
        >
          {t(board.nameKey)}
        </h3>
        <p className="text-xs flex-1" style={{ color: "#9ca3af" }}>
          {board.desc}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[10px]" style={{ color: "#6b6375" }}>
            {board.players} {playersLabel.toLowerCase()}
          </span>
          <button
            onClick={onPlay}
            className="px-4 py-1.5 rounded-lg text-xs tracking-wider uppercase
                       cursor-pointer transition-all hover:scale-105"
            style={{
              color: board.accent,
              border: `1px solid ${board.accent}55`,
              background: `${board.accent}0d`,
            }}
          >
            {playLabel}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * @arquivo Board.tsx
 * @descricao Tabuleiro visual com casas e tokens de jogadores
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao (@lg_lucas) — Tokenfy.me
 */
import { motion } from "framer-motion";
import type { BoardSpace, Player, SpaceType } from "../engine/types";
import { SPACE_ICONS } from "../engine/board";

interface BoardProps {
  spaces: BoardSpace[];
  players: Player[];
  currentPlayerId: number;
}

const TYPE_BORDER: Record<SpaceType, string> = {
  start: "border-green-500",
  finish: "border-yellow-500",
  normal: "border-gray-700",
  event: "border-purple-500",
  challenge: "border-cyan-500",
  bonus: "border-yellow-400",
  trap: "border-red-500",
};

const TYPE_BG: Record<SpaceType, string> = {
  start: "bg-green-900/30",
  finish: "bg-yellow-900/30",
  normal: "bg-white/[0.02]",
  event: "bg-purple-900/20",
  challenge: "bg-cyan-900/20",
  bonus: "bg-yellow-900/20",
  trap: "bg-red-900/20",
};

export default function Board({
  spaces,
  players,
  currentPlayerId,
}: BoardProps) {
  return (
    <div className="grid grid-cols-10 gap-1 w-full max-w-2xl mx-auto">
      {spaces.map((sp) => {
        const here = players.filter(
          (p) => p.position === sp.index && !p.finished,
        );
        const isActive = here.some((p) => p.id === currentPlayerId);
        return (
          <div
            key={sp.index}
            className={`relative w-full aspect-square rounded border ${TYPE_BORDER[sp.type]} ${TYPE_BG[sp.type]} flex flex-col items-center justify-center text-[8px] transition-all ${isActive ? "ring-1 ring-yellow-400/50" : ""}`}
          >
            <span className="text-xs">{SPACE_ICONS[sp.type]}</span>
            <span className="text-[7px] text-gray-600">{sp.index}</span>
            {here.length > 0 && (
              <div className="absolute -top-1 -right-1 flex gap-0.5">
                {here.map((p) => (
                  <motion.div
                    key={p.id}
                    layoutId={`token-${p.id}`}
                    className="w-3 h-3 rounded-full border border-black/50"
                    style={{ backgroundColor: p.color }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

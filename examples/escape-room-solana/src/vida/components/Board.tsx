/**
 * @arquivo Board.tsx
 * @descricao Tabuleiro visual snake-path com casas grandes e pins animados
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

const TYPE_STYLE: Record<
  SpaceType,
  { border: string; bg: string; glow: string }
> = {
  start: {
    border: "border-green-400",
    bg: "bg-green-900/30",
    glow: "shadow-green-400/20",
  },
  finish: {
    border: "border-yellow-400",
    bg: "bg-yellow-900/30",
    glow: "shadow-yellow-400/30",
  },
  normal: { border: "border-gray-700/50", bg: "bg-white/[0.02]", glow: "" },
  event: {
    border: "border-purple-400",
    bg: "bg-purple-900/20",
    glow: "shadow-purple-400/15",
  },
  challenge: {
    border: "border-cyan-400",
    bg: "bg-cyan-900/20",
    glow: "shadow-cyan-400/15",
  },
  bonus: {
    border: "border-yellow-400",
    bg: "bg-yellow-900/15",
    glow: "shadow-yellow-400/15",
  },
  trap: {
    border: "border-red-400",
    bg: "bg-red-900/15",
    glow: "shadow-red-400/15",
  },
};

const COLS = 10;

/** Converte index linear em posicao snake (linhas pares L→R, impares R→L) */
function snakePos(idx: number): { col: number; row: number } {
  const row = Math.floor(idx / COLS);
  const col = row % 2 === 0 ? idx % COLS : COLS - 1 - (idx % COLS);
  return { col, row };
}

export default function Board({
  spaces,
  players,
  currentPlayerId,
}: BoardProps) {
  const rows = Math.ceil(spaces.length / COLS);

  return (
    <div className="w-full max-w-3xl mx-auto overflow-x-auto">
      <div
        className="grid gap-1.5 min-w-[640px]"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {spaces.map((sp) => {
          const { col, row } = snakePos(sp.index);
          const style = TYPE_STYLE[sp.type];
          const here = players.filter(
            (p) => p.position === sp.index && !p.finished,
          );
          const isActive = here.some((p) => p.id === currentPlayerId);

          return (
            <div
              key={sp.index}
              className={`relative rounded-lg border ${style.border} ${style.bg} ${style.glow} flex flex-col items-center justify-center p-1 transition-all min-h-[56px] ${isActive ? "ring-2 ring-yellow-400/60 scale-105" : ""} ${sp.type !== "normal" ? "shadow-lg" : ""}`}
              style={{ gridColumn: col + 1, gridRow: row + 1 }}
            >
              <span className="text-lg leading-none">
                {SPACE_ICONS[sp.type]}
              </span>
              <span className="text-[9px] text-gray-500 font-mono mt-0.5">
                {sp.index}
              </span>

              {/* Player pins */}
              {here.length > 0 && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex gap-1">
                  {here.map((p) => (
                    <motion.div
                      key={p.id}
                      layoutId={`pin-${p.id}`}
                      className="w-7 h-7 rounded-full border-2 border-white/80 flex items-center justify-center text-[10px] font-bold text-white shadow-lg"
                      style={{
                        backgroundColor: p.color,
                        boxShadow: `0 0 10px ${p.color}80`,
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

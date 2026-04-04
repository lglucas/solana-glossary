/**
 * @arquivo NeonGrid.tsx
 * @descricao Fundo animado com variantes neon, matrix e pixel
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao — AceleradoraECO
 */

import { motion } from "framer-motion";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type GridVariant = "neon" | "matrix" | "pixel";

interface NeonGridProps {
  /** Estilo visual do grid */
  variant?: GridVariant;
  /** Classe CSS extra */
  className?: string;
}

// ---------------------------------------------------------------------------
// Configuracao por variante
// ---------------------------------------------------------------------------

const CONFIGS: Record<
  GridVariant,
  {
    stroke: string;
    patternSize: number;
    opacity: number;
    dashArray?: string;
    strokeWidth: number;
    glow: string;
  }
> = {
  neon: {
    stroke: "#00fff0",
    patternSize: 60,
    opacity: 0.12,
    strokeWidth: 0.5,
    glow: "#00fff0",
  },
  matrix: {
    stroke: "#00ff41",
    patternSize: 40,
    opacity: 0.08,
    strokeWidth: 0.4,
    glow: "#00ff41",
  },
  pixel: {
    stroke: "#ff6ec7",
    patternSize: 24,
    opacity: 0.15,
    dashArray: "2 6",
    strokeWidth: 1,
    glow: "#ff6ec7",
  },
};

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function NeonGrid({ variant = "neon", className = "" }: NeonGridProps) {
  const cfg = CONFIGS[variant];
  const patternId = `grid-${variant}`;

  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      animate={{ opacity: [cfg.opacity, cfg.opacity * 1.4, cfg.opacity] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={patternId}
            width={cfg.patternSize}
            height={cfg.patternSize}
            patternUnits="userSpaceOnUse"
          >
            {variant === "pixel" ? (
              <>
                {/* Grade pontilhada retro */}
                <circle cx={cfg.patternSize} cy={0} r={1} fill={cfg.stroke} />
                <circle cx={0} cy={cfg.patternSize} r={1} fill={cfg.stroke} />
                <circle
                  cx={cfg.patternSize}
                  cy={cfg.patternSize}
                  r={1}
                  fill={cfg.stroke}
                />
              </>
            ) : (
              <path
                d={`M${cfg.patternSize} 0L0 0 0 ${cfg.patternSize}`}
                fill="none"
                stroke={cfg.stroke}
                strokeWidth={cfg.strokeWidth}
                strokeDasharray={cfg.dashArray}
              />
            )}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      {/* Scanlines para variante matrix */}
      {variant === "matrix" && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(0deg," +
              "rgba(0,255,65,.03) 0px," +
              "rgba(0,255,65,.03) 1px," +
              "transparent 1px," +
              "transparent 3px)",
          }}
        />
      )}

      {/* Glow sutil no canto inferior */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%]"
        style={{
          background: `radial-gradient(ellipse at center, ${cfg.glow}08, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}

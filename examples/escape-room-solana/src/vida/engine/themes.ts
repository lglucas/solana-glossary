/**
 * @arquivo themes.ts
 * @descricao Configuracao dos 3 tabuleiros do Jogo da Vida Solana
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao (@lg_lucas) — Tokenfy.me
 */
import type { BoardConfig, BoardThemeId } from "./types";

const BOARD_CONFIGS: Record<BoardThemeId, BoardConfig> = {
  normie: {
    id: "normie",
    totalSpaces: 50,
    eventFrequency: 4,
    challengeFrequency: 6,
    categories: [
      "blockchain-general",
      "core-protocol",
      "network",
      "infrastructure",
    ],
  },
  startup: {
    id: "startup",
    totalSpaces: 50,
    eventFrequency: 4,
    challengeFrequency: 6,
    categories: ["token-ecosystem", "defi", "web3", "solana-ecosystem"],
  },
  timeline: {
    id: "timeline",
    totalSpaces: 50,
    eventFrequency: 4,
    challengeFrequency: 6,
    categories: [
      "programming-model",
      "dev-tools",
      "programming-fundamentals",
      "security",
    ],
  },
};

export const BOARD_THEMES = Object.values(BOARD_CONFIGS);

export function getBoardConfig(theme: BoardThemeId): BoardConfig {
  return BOARD_CONFIGS[theme];
}

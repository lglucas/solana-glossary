/**
 * @arquivo useVidaGame.ts
 * @descricao Hook principal do Jogo da Vida — gerencia estado e acoes
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao (@lg_lucas) — Tokenfy.me
 */
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { GameState, BoardThemeId } from "../engine/types";
import {
  createInitialState,
  performRoll,
  resolveSpace,
  applyEvent,
  applyChallenge,
  nextTurn,
} from "../engine/turns";

export function useVidaGame(
  theme: BoardThemeId,
  players: Array<{ name: string; color: string }>,
) {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const [state, setState] = useState<GameState>(() =>
    createInitialState(theme, players),
  );

  const roll = useCallback(() => {
    setState((s) => {
      const rolled = performRoll(s);
      // Auto-resolve apos breve delay (movimento visual)
      setTimeout(() => setState((s2) => resolveSpace(s2, locale)), 800);
      return rolled;
    });
  }, [locale]);

  const dismissEvent = useCallback(() => {
    setState((s) => {
      const applied = applyEvent(s);
      setTimeout(() => setState(nextTurn), 300);
      return applied;
    });
  }, []);

  const answerChallenge = useCallback((correct: boolean) => {
    setState((s) => {
      const applied = applyChallenge(s, correct);
      setTimeout(() => setState(nextTurn), 300);
      return applied;
    });
  }, []);

  const skipToNext = useCallback(() => {
    setState((s) => {
      if (s.turnPhase === "resolve") return nextTurn(s);
      return s;
    });
  }, []);

  const restart = useCallback(() => {
    setState(createInitialState(theme, players));
  }, [theme, players]);

  const currentPlayer = state.players[state.currentPlayerIndex];

  return {
    state,
    currentPlayer,
    roll,
    dismissEvent,
    answerChallenge,
    skipToNext,
    restart,
  };
}

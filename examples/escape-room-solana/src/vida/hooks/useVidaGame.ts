/**
 * @arquivo useVidaGame.ts
 * @descricao Hook principal do Jogo da Vida — multiplayer via Supabase sync
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao (@lg_lucas) — Tokenfy.me
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useWallet } from "@solana/wallet-adapter-react";
import type { GameState, BoardThemeId } from "../engine/types";
import {
  createInitialState,
  performRoll,
  resolveSpace,
  applyEvent,
  applyChallenge,
  nextTurn,
} from "../engine/turns";
import { saveGameState, loadGameState } from "../engine/rooms";

interface UseVidaGameOpts {
  theme: BoardThemeId;
  players: Array<{ name: string; color: string }>;
  roomCode?: string;
}

export function useVidaGame({ theme, players, roomCode }: UseVidaGameOpts) {
  const { i18n } = useTranslation();
  const { publicKey } = useWallet();
  const locale = i18n.language;
  const myWallet = publicKey?.toBase58() ?? "";
  const [state, setState] = useState<GameState>(() =>
    createInitialState(theme, players),
  );
  const syncRef = useRef(false);

  // Identifica qual player index sou eu (por posicao na lista, mapeado por wallet na sala)
  const myPlayerIndex = state.players.findIndex(
    (p) =>
      p.name ===
      players.find((_, i) => {
        // Match por cor (que é atribuída na ordem de entrada na sala)
        return state.players[i]?.color === p.color;
      })?.name,
  );

  const isMyTurn =
    state.currentPlayerIndex < state.players.length &&
    state.players[state.currentPlayerIndex]?.name ===
      (myWallet ? players[myPlayerIndex]?.name : players[0]?.name);

  // Salva state no Supabase apos cada mudanca (se tem roomCode)
  useEffect(() => {
    if (!roomCode || !syncRef.current) {
      syncRef.current = true;
      return;
    }
    saveGameState(roomCode, state);
  }, [state, roomCode]);

  // Poll Supabase para receber state de outros jogadores
  useEffect(() => {
    if (!roomCode) return;
    const interval = setInterval(async () => {
      const remote = await loadGameState(roomCode);
      if (!remote) return;
      const rs = remote as GameState;
      // So atualiza se o turno ou fase mudou (evita loop infinito)
      if (
        rs.turnCount !== state.turnCount ||
        rs.turnPhase !== state.turnPhase ||
        rs.currentPlayerIndex !== state.currentPlayerIndex
      ) {
        setState(rs);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [roomCode, state.turnCount, state.turnPhase, state.currentPlayerIndex]);

  const roll = useCallback(() => {
    setState((s) => {
      const rolled = performRoll(s);
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
    setState((s) => (s.turnPhase === "resolve" ? nextTurn(s) : s));
  }, []);

  const currentPlayer = state.players[state.currentPlayerIndex];

  return {
    state,
    currentPlayer,
    isMyTurn,
    roll,
    dismissEvent,
    answerChallenge,
    skipToNext,
  };
}

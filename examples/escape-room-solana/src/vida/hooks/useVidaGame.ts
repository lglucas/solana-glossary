/**
 * @arquivo useVidaGame.ts
 * @descricao Hook principal do Jogo da Vida — multiplayer via Supabase sync
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao (@lg_lucas) — Tokenfy.me
 */
import { useState, useCallback, useEffect, useRef } from "react";
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
import { saveGameState, loadGameState } from "../engine/rooms";
import { audioManager } from "../../lib/audio";

interface UseVidaGameOpts {
  theme: BoardThemeId;
  players: Array<{ name: string; color: string; wallet: string }>;
  roomCode?: string;
  myWallet: string;
}

export function useVidaGame({
  theme,
  players,
  roomCode,
  myWallet,
}: UseVidaGameOpts) {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const [state, setState] = useState<GameState>(() =>
    createInitialState(theme, players),
  );
  const fromPollRef = useRef(false);
  const initialRef = useRef(true);

  const currentPlayer = state.players[state.currentPlayerIndex];
  const isMyTurn = currentPlayer?.wallet === myWallet;

  // Salva state no Supabase apos acao local (pula poll e render inicial)
  useEffect(() => {
    if (!roomCode || fromPollRef.current || initialRef.current) {
      fromPollRef.current = false;
      initialRef.current = false;
      return;
    }
    saveGameState(roomCode, state);
  }, [state, roomCode]);

  // Poll Supabase para receber state do jogador ativo
  useEffect(() => {
    if (!roomCode) return;
    const interval = setInterval(async () => {
      const remote = await loadGameState(roomCode);
      if (!remote) return;
      const rs = remote as GameState;
      // Atualiza se qualquer campo relevante mudou
      const changed =
        rs.turnCount !== state.turnCount ||
        rs.turnPhase !== state.turnPhase ||
        rs.currentPlayerIndex !== state.currentPlayerIndex ||
        rs.diceValue !== state.diceValue ||
        JSON.stringify(rs.players.map((p) => p.position)) !==
          JSON.stringify(state.players.map((p) => p.position));
      if (changed) {
        fromPollRef.current = true;
        setState(rs);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [
    roomCode,
    state.turnCount,
    state.turnPhase,
    state.currentPlayerIndex,
    state.diceValue,
  ]);

  const roll = useCallback(() => {
    audioManager.playSfx("tick");
    setState((s) => {
      const rolled = performRoll(s);
      setTimeout(() => {
        audioManager.playSfx("correct");
        setState((s2) => resolveSpace(s2, locale));
      }, 800);
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
    audioManager.playSfx(correct ? "correct" : "wrong");
    setState((s) => {
      const applied = applyChallenge(s, correct);
      setTimeout(() => setState(nextTurn), 300);
      return applied;
    });
  }, []);

  const skipToNext = useCallback(() => {
    setState((s) => (s.turnPhase === "resolve" ? nextTurn(s) : s));
  }, []);

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

/**
 * @arquivo useVidaGame.ts
 * @descricao Hook principal do Jogo da Vida — multiplayer via Supabase sync
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao (@lg_lucas) — Tokenfy.me
 */
import { useState, useCallback, useEffect } from "react";
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

/** Salva state no Supabase (fire-and-forget) */
function save(code: string | undefined, s: GameState): void {
  if (code) saveGameState(code, s);
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

  const currentPlayer = state.players[state.currentPlayerIndex];
  const isMyTurn = currentPlayer?.wallet === myWallet;

  // Poll Supabase para receber state do outro jogador
  useEffect(() => {
    if (!roomCode) return;
    const interval = setInterval(async () => {
      const remote = await loadGameState(roomCode);
      if (!remote) return;
      const rs = remote as GameState;
      const changed =
        rs.turnCount !== state.turnCount ||
        rs.turnPhase !== state.turnPhase ||
        rs.currentPlayerIndex !== state.currentPlayerIndex ||
        rs.diceValue !== state.diceValue;
      if (changed) setState(rs);
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
      save(roomCode, rolled);
      setTimeout(() => {
        setState((s2) => {
          const resolved = resolveSpace(s2, locale);
          save(roomCode, resolved);
          // Auto-pass se casa normal (sem evento/desafio)
          if (
            !resolved.activeEvent &&
            !resolved.activeChallenge &&
            !resolved.winner
          ) {
            setTimeout(() => {
              setState((s3) => {
                const nx = nextTurn(s3);
                save(roomCode, nx);
                return nx;
              });
            }, 600);
          }
          return resolved;
        });
        audioManager.playSfx("correct");
      }, 800);
      return rolled;
    });
  }, [locale, roomCode]);

  const dismissEvent = useCallback(() => {
    setState((s) => {
      const applied = applyEvent(s);
      save(roomCode, applied);
      setTimeout(() => {
        setState((s2) => {
          const nx = nextTurn(s2);
          save(roomCode, nx);
          return nx;
        });
      }, 300);
      return applied;
    });
  }, [roomCode]);

  const answerChallenge = useCallback(
    (correct: boolean) => {
      audioManager.playSfx(correct ? "correct" : "wrong");
      setState((s) => {
        const applied = applyChallenge(s, correct);
        save(roomCode, applied);
        setTimeout(() => {
          setState((s2) => {
            const nx = nextTurn(s2);
            save(roomCode, nx);
            return nx;
          });
        }, 800);
        return applied;
      });
    },
    [roomCode],
  );

  return {
    state,
    currentPlayer,
    isMyTurn,
    roll,
    dismissEvent,
    answerChallenge,
  };
}

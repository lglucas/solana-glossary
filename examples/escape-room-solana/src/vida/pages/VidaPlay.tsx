/**
 * @arquivo VidaPlay.tsx
 * @descricao Pagina de gameplay do Jogo da Vida — lobby online → jogo
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao (@lg_lucas) — Tokenfy.me
 */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import Layout from "../../components/Layout";
import type { BoardThemeId } from "../engine/types";
import { useVidaGame } from "../hooks/useVidaGame";
import Board from "../components/Board";
import Dice from "../components/Dice";
import Lobby from "../components/Lobby";
import EventCardModal from "../components/EventCardModal";
import ChallengeModal from "../components/ChallengeModal";

type Phase = "lobby" | "playing";

export default function VidaPlay() {
  const { tema, code } = useParams<{ tema: string; code?: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = (tema ?? "normie") as BoardThemeId;
  const [phase, setPhase] = useState<Phase>("lobby");
  const [playersCfg, setPlayersCfg] = useState<
    Array<{ name: string; color: string }>
  >([]);

  const handleStart = (ps: Array<{ name: string; color: string }>) => {
    setPlayersCfg(ps);
    setPhase("playing");
  };

  if (phase === "lobby") {
    return (
      <Layout>
        <div className="min-h-screen bg-[#0a0015] text-white flex items-center justify-center px-4 py-20">
          <Lobby theme={theme} roomCode={code} onStart={handleStart} />
        </div>
      </Layout>
    );
  }

  return (
    <GameBoard theme={theme} players={playersCfg} navigate={navigate} t={t} />
  );
}

function GameBoard({
  theme,
  players,
  navigate,
  t,
}: {
  theme: BoardThemeId;
  players: Array<{ name: string; color: string }>;
  navigate: ReturnType<typeof useNavigate>;
  t: ReturnType<typeof useTranslation>["t"];
}) {
  const {
    state,
    currentPlayer,
    roll,
    dismissEvent,
    answerChallenge,
    skipToNext,
  } = useVidaGame(theme, players);

  if (state.winner) {
    setTimeout(() => {
      navigate(`/vida/resultado/${theme}`, {
        state: {
          players: state.players,
          winner: state.winner,
          turnCount: state.turnCount,
          theme,
        },
      });
    }, 1500);
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#0a0015] text-white px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: currentPlayer.color }}
              />
              <span className="text-sm font-bold">{currentPlayer.name}</span>
              <span className="text-xs text-gray-500">
                Casa {currentPlayer.position}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>
                {t("common.score")}:{" "}
                <b className="text-cyan-400">{currentPlayer.score}</b>
              </span>
              <span>Turno {state.turnCount + 1}</span>
            </div>
          </div>
          <Board
            spaces={state.board}
            players={state.players}
            currentPlayerId={currentPlayer.id}
          />
          <div className="flex justify-center mt-6">
            <Dice
              value={state.diceValue}
              disabled={state.turnPhase !== "roll"}
              onRoll={roll}
            />
          </div>
          <div className="flex justify-center gap-3 mt-4 flex-wrap">
            {state.players.map((p) => (
              <div
                key={p.id}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all ${p.id === currentPlayer.id ? "bg-white/10 border border-white/20" : "opacity-50"}`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span>{p.name}</span>
                <span className="text-gray-500">{p.score}</span>
              </div>
            ))}
          </div>
          {state.turnPhase === "resolve" &&
            !state.activeEvent &&
            !state.activeChallenge &&
            !state.winner && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={skipToNext}
                  className="px-6 py-2 rounded-lg bg-white/10 border border-white/10 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {t("common.next")}
                </button>
              </div>
            )}
        </div>
        <AnimatePresence>
          {state.activeEvent && (
            <EventCardModal card={state.activeEvent} onDismiss={dismissEvent} />
          )}
          {state.activeChallenge && (
            <ChallengeModal
              question={state.activeChallenge}
              onAnswer={answerChallenge}
            />
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}

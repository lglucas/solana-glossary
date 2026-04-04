/**
 * @arquivo VidaPlay.tsx
 * @descricao Pagina de gameplay do Jogo da Vida — lobby online → jogo
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao (@lg_lucas) — Tokenfy.me
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "../../components/Layout";
import { useProfile } from "../../hooks/useProfile";
import { startBgm, stopBgm } from "../../lib/bgm";
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
    Array<{ name: string; color: string; wallet: string }>
  >([]);
  const [activeCode, setActiveCode] = useState<string | undefined>(code);

  const handleStart = (
    ps: Array<{ name: string; color: string; wallet: string }>,
    roomCode?: string,
  ) => {
    setPlayersCfg(ps);
    if (roomCode) setActiveCode(roomCode);
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
    <GameBoard
      theme={theme}
      players={playersCfg}
      roomCode={activeCode}
      navigate={navigate}
      t={t}
    />
  );
}

function GameBoard({
  theme,
  players,
  roomCode,
  navigate,
  t,
}: {
  theme: BoardThemeId;
  players: Array<{ name: string; color: string; wallet: string }>;
  roomCode?: string;
  navigate: ReturnType<typeof useNavigate>;
  t: ReturnType<typeof useTranslation>["t"];
}) {
  const { profile } = useProfile();
  const myWallet = profile?.walletAddress ?? "";

  useEffect(() => {
    startBgm("defi");
    return () => stopBgm();
  }, []);

  const {
    state,
    currentPlayer,
    isMyTurn,
    roll,
    dismissEvent,
    answerChallenge,
  } = useVidaGame({ theme, players, roomCode, myWallet });

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
          {/* HUD */}
          <div className="flex items-center justify-between mb-5 px-2 py-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full border-2 border-white/60 flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: currentPlayer.color,
                  boxShadow: `0 0 12px ${currentPlayer.color}60`,
                }}
              >
                {currentPlayer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-sm font-bold block">
                  {currentPlayer.name}
                </span>
                <span className="text-[10px] text-gray-500">
                  Casa {currentPlayer.position}/49
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="text-center">
                <span className="text-cyan-400 font-bold text-lg block">
                  {currentPlayer.score}
                </span>
                <span className="text-gray-600 text-[9px]">
                  {t("common.score")}
                </span>
              </div>
              <div className="text-center">
                <span className="text-gray-300 font-bold text-lg block">
                  {state.turnCount + 1}
                </span>
                <span className="text-gray-600 text-[9px]">Turno</span>
              </div>
            </div>
          </div>
          {/* Turn indicator */}
          {isMyTurn ? (
            <motion.p
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-center text-sm text-yellow-400 font-bold mb-3"
            >
              {t("vida.yourTurn")}
            </motion.p>
          ) : (
            <p className="text-center text-sm text-gray-500 mb-3">
              {t("vida.waitingTurn")}
            </p>
          )}
          <Board
            spaces={state.board}
            players={state.players}
            currentPlayerId={currentPlayer.id}
          />
          <div className="flex justify-center mt-6">
            <Dice
              value={state.diceValue}
              disabled={state.turnPhase !== "roll" || !isMyTurn}
              onRoll={roll}
            />
            {!isMyTurn && state.turnPhase === "roll" && (
              <p className="text-xs text-gray-500 mt-2">
                {t("vida.waitingTurn")}
              </p>
            )}
          </div>
          <div className="flex justify-center gap-2 mt-5 flex-wrap">
            {state.players.map((p) => (
              <div
                key={p.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all ${p.id === currentPlayer.id ? "bg-white/10 border border-white/20 scale-105" : "opacity-40 border border-transparent"}`}
              >
                <div
                  className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center text-[9px] font-bold"
                  style={{ backgroundColor: p.color }}
                >
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="block text-white">{p.name}</span>
                  <span className="text-gray-500">
                    {p.score} pts • Casa {p.position}
                  </span>
                </div>
              </div>
            ))}
          </div>
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

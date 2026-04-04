/** @arquivo GamePlay.tsx @descricao Escape room gameplay @projeto Solana Glossary — Escape Room Solana @autor Lucas Galvao — AceleradoraECO */
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTimer } from "../hooks/useTimer";
import { useHints } from "../hooks/useHints";
import { useScore } from "../hooks/useScore";
import { selectPuzzleTerms, type PuzzleTerm } from "../lib/glossary";
import { getLevelConfig, type ThemeId, type LevelId } from "../engine/themes";
import Layout from "../components/Layout";
import AnimatedBlobs, { type BlobVariant } from "../components/AnimatedBlobs";
import GameHud from "../components/GameHud";
import HintsPanel from "../components/HintsPanel";

type GamePhase = "playing" | "won" | "lost";
const ABCD = ["A", "B", "C", "D"] as const;

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = Math.floor(((s - 1) / 2147483646) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// prettier-ignore
export default function GamePlay() {
  const { tema, nivel } = useParams<{ tema: string; nivel: string }>();
  const navigate = useNavigate();
  const tId = (tema ?? "genesis") as ThemeId, lId = (nivel ?? "surface") as LevelId;
  const lc = useMemo(() => getLevelConfig(tId, lId), [tId, lId]);
  const blob: BlobVariant = tId === "defi" ? "defi" : tId === "lab" ? "lab" : "genesis";
  const terms = useMemo(() => selectPuzzleTerms(tId, lId, undefined, Date.now()), [tId, lId]);
  const pool = useMemo(() => selectPuzzleTerms(tId, lId, undefined, Date.now() + 7), [tId, lId]);

  const [idx, setIdx] = useState(0);
  const [selId, setSelId] = useState<string | null>(null);
  const [fb, setFb] = useState(false);
  const [phase, setPhase] = useState<GamePhase>("playing");
  const fbRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timer = useTimer({ totalSeconds: lc.timeSeconds, autoStart: true, onExpire: () => setPhase("lost") });
  const hints = useHints({ terms, maxHints: lc.maxHints, penaltyPerHint: lc.hintPenalty });
  const score = useScore({ multiplier: lc.scoreMultiplier });
  const cur = terms[idx] as PuzzleTerm | undefined;

  const opts = useMemo(() => {
    if (!cur) return [];
    return seededShuffle([cur, ...pool.filter(d => d.id !== cur.id).slice(0, 3)], idx * 997 + 42);
  }, [cur, pool, idx]);

  const handleAnswer = useCallback((tid: string) => {
    if (fb || phase !== "playing" || !cur) return;
    setSelId(tid); setFb(true);
    if (tid === cur.id) score.addCorrect(); else score.addWrong();
    fbRef.current = setTimeout(() => {
      setFb(false); setSelId(null);
      if (idx + 1 >= terms.length) setPhase("won"); else setIdx(p => p + 1);
    }, 900);
  }, [fb, phase, cur, idx, terms.length, score]);

  useEffect(() => {
    if (phase === "playing") return;
    timer.pause();
    const fs = score.calculateFinal(timer.remaining, hints.totalPenalty);
    navigate(`/resultado/${tId}/${lId}`, {
      state: { score: fs, correct: score.correctCount, wrong: score.wrongCount, timeLeft: timer.remaining, hintPenalty: hints.totalPenalty, phase },
    });
  }, [phase]);

  useEffect(() => () => { if (fbRef.current) clearTimeout(fbRef.current); }, []);

  const bc = (o: PuzzleTerm) => {
    const s = "w-full text-left px-5 py-4 rounded-xl border font-medium transition-all flex items-center gap-3";
    if (!fb) return `${s} bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-purple-500/40`;
    if (o.id === cur?.id) return `${s} bg-emerald-600/30 border-emerald-400/50 text-emerald-200`;
    if (o.id === selId) return `${s} bg-red-600/30 border-red-400/50 text-red-200`;
    return `${s} bg-white/5 border-white/10 text-gray-500 opacity-50`;
  };

  return (
    <Layout>
      <div className="relative min-h-screen bg-[#0a0015] text-white font-['Space_Grotesk',sans-serif]">
        <AnimatedBlobs variant={blob} />
        <GameHud timer={{ display: timer.display, percent: timer.percent, isExpired: timer.isExpired }}
          score={score.total} theme={tId} level={lId} station={idx} totalStations={terms.length} onPause={timer.pause} />
        <div className="relative z-10 flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto px-6 py-8">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {cur && (
                <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
                    <p className="text-xs text-purple-300 uppercase tracking-wider mb-2">Qual termo corresponde a esta definicao?</p>
                    <p className="text-lg text-gray-100 leading-relaxed">{cur.definition}</p>
                  </div>
                  <div className="space-y-3">
                    {opts.map((o, i) => (
                      <motion.button key={o.id} onClick={() => handleAnswer(o.id)} disabled={fb} className={bc(o)}
                        whileHover={!fb ? { scale: 1.01 } : {}} whileTap={!fb ? { scale: 0.98 } : {}}>
                        <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-sm font-bold shrink-0">{ABCD[i]}</span>
                        <span className="text-sm">{o.term}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <HintsPanel hints={hints.hints} usedCount={hints.usedCount} maxHints={hints.maxHints}
            canUseHint={hints.canUseHint} totalPenalty={hints.totalPenalty} hintPenaltyCost={lc.hintPenalty}
            disabled={fb || phase !== "playing"} onUseHint={hints.revealNext} />
        </div>
      </div>
    </Layout>
  );
}

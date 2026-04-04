/**
 * @arquivo GameResult.tsx
 * @descricao Tela de resultado (vitoria/derrota) com estatisticas e particulas
 * @projeto Solana Glossary — Escape Room Solana
 * @autor Lucas Galvao — AceleradoraECO
 */

import { useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import AnimatedBlobs from "../components/AnimatedBlobs";
import type { BlobVariant } from "../components/AnimatedBlobs";
interface ResultState {
  won: boolean;
  score: number;
  timeLeft: number;
  correctCount: number;
  wrongCount: number;
  hintsUsed: number;
  theme: string;
  level: string;
}
const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const COLORS = ["#9945FF", "#14F195", "#00D1FF", "#FFD700", "#FF6B6B"];
function Confetti() {
  const dots = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        color: COLORS[i % 5],
        x: Math.random() * 100,
        delay: Math.random() * 2,
        dur: 2 + Math.random() * 3,
        size: 4 + Math.random() * 8,
      })),
    [],
  );
  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {dots.map((d) => (
        <motion.div
          key={d.id}
          className="absolute rounded-full"
          style={{
            background: d.color,
            width: d.size,
            height: d.size,
            left: `${d.x}%`,
            top: -10,
          }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [0, 360],
            opacity: [1, 0.6, 0],
          }}
          transition={{
            duration: d.dur,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}
export default function GameResult() {
  const { t } = useTranslation();
  const { state: locState } = useLocation();
  const { tema, nivel } = useParams<{ tema: string; nivel: string }>();

  const s: ResultState = (locState as ResultState) ?? {
    won: false,
    score: 0,
    timeLeft: 0,
    correctCount: 0,
    wrongCount: 0,
    hintsUsed: 0,
    theme: tema ?? "genesis",
    level: nivel ?? "surface",
  };
  const blob: BlobVariant =
    s.theme === "defi" ? "defi" : s.theme === "lab" ? "lab" : "genesis";
  const timeFmt = `${Math.floor(s.timeLeft / 60)}:${String(s.timeLeft % 60).padStart(2, "0")}`;
  const stats = [
    {
      label: "Pontuacao",
      val: s.score,
      color: s.won ? "text-cyan-400" : "text-orange-400",
    },
    { label: "Tempo Restante", val: timeFmt, color: "text-green-400" },
    { label: "Acertos", val: s.correctCount, color: "text-emerald-400" },
    { label: "Erros", val: s.wrongCount, color: "text-red-400" },
    { label: "Dicas Usadas", val: s.hintsUsed, color: "text-yellow-400" },
  ];
  const titleGrad = s.won
    ? "from-green-400 via-cyan-400 to-green-300"
    : "from-red-500 via-orange-400 to-red-500";

  return (
    <Layout>
      <div className="relative min-h-screen bg-[#0a0015] text-white font-['Space_Grotesk',sans-serif]">
        <AnimatedBlobs variant={blob} />
        {s.won && <Confetti />}

        <motion.div
          className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Titulo — vitoria ou derrota com shake na derrota */}
          <motion.h1
            variants={fadeUp}
            animate={s.won ? undefined : { x: [0, -8, 8, -6, 6, -3, 3, 0] }}
            transition={s.won ? undefined : { duration: 0.6, delay: 0.5 }}
            className={`text-5xl md:text-6xl font-extrabold text-center mb-4 font-['Orbitron',sans-serif] bg-gradient-to-r ${titleGrad} bg-clip-text text-transparent`}
          >
            {s.won ? t("escape.victory") : t("escape.defeat")}
          </motion.h1>

          {/* Subtitulo com tema e nivel */}
          <motion.p
            variants={fadeUp}
            className="text-gray-400 text-center mb-8"
          >
            {t(`escape.themes.${s.theme}`)} &mdash;{" "}
            {t(`escape.levels.${s.level}`)}
          </motion.p>

          {/* Card de estatisticas — glassmorphism */}
          <motion.div
            variants={fadeUp}
            className="w-full max-w-md rounded-2xl p-[1px] bg-gradient-to-br from-purple-600/50 via-cyan-400/30 to-green-400/50 mb-10"
          >
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
              <h2 className="text-center text-sm text-gray-400 uppercase tracking-wider mb-4">
                Estatisticas
              </h2>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {stats.slice(0, 3).map((st) => (
                  <div
                    key={st.label}
                    className="flex flex-col items-center gap-1 py-3"
                  >
                    <span className={`text-2xl font-bold ${st.color}`}>
                      {st.val}
                    </span>
                    <span className="text-xs text-gray-400">{st.label}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {stats.slice(3).map((st) => (
                  <div
                    key={st.label}
                    className="flex flex-col items-center gap-1 py-3"
                  >
                    <span className={`text-2xl font-bold ${st.color}`}>
                      {st.val}
                    </span>
                    <span className="text-xs text-gray-400">{st.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Botoes de acao */}
          <motion.div variants={fadeUp} className="flex gap-4">
            <Link
              to={`/jogar/${s.theme}/${s.level}`}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity text-sm"
            >
              Jogar Novamente
            </Link>
            <Link
              to="/temas"
              className="px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-colors text-sm"
            >
              Voltar aos Temas
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}

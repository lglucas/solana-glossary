/**
 * @arquivo Leaderboard.tsx
 * @descricao Ranking de pontuacoes com filtro por tema e destaque do jogador
 * @projeto Solana Glossary — Escape Room Solana
 * @autor Lucas Galvao — AceleradoraECO
 */
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import Layout from "../components/Layout";
import AnimatedBlobs from "../components/AnimatedBlobs";
import { getTopScores, type ScoreEntry } from "../lib/leaderboard";

const TABS = ["all", "genesis", "defi", "lab"] as const;
type Tab = (typeof TABS)[number];

const TAB_COLORS: Record<Tab, string> = {
  all: "border-cyan-400 text-cyan-300",
  genesis: "border-purple-400 text-purple-300",
  defi: "border-emerald-400 text-emerald-300",
  lab: "border-blue-400 text-blue-300",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/** Agrupa scores por jogador: retorna o melhor score de cada wallet */
function aggregateBest(scores: ScoreEntry[]): ScoreEntry[] {
  const map = new Map<string, ScoreEntry>();
  for (const s of scores) {
    const existing = map.get(s.walletAddress);
    if (!existing || s.score > existing.score) map.set(s.walletAddress, s);
  }
  return [...map.values()].sort((a, b) => b.score - a.score);
}

export default function Leaderboard() {
  const { t } = useTranslation();
  const { publicKey } = useWallet();
  const [tab, setTab] = useState<Tab>("all");
  const myWallet = publicKey?.toBase58() ?? "";

  const scores = useMemo(() => {
    const raw = getTopScores(100, tab === "all" ? undefined : tab);
    return aggregateBest(raw);
  }, [tab]);

  return (
    <Layout>
      <div className="relative min-h-screen bg-[#0a0015] text-white font-['Space_Grotesk',sans-serif]">
        <AnimatedBlobs
          variant={tab === "defi" ? "defi" : tab === "lab" ? "lab" : "genesis"}
        />
        <motion.div
          className="relative z-10 flex flex-col items-center px-6 pt-20 pb-12"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold font-['Orbitron',sans-serif] bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400 bg-clip-text text-transparent mb-8"
          >
            {t("leaderboard.title")}
          </motion.h1>

          {/* Tabs de filtro */}
          <motion.div variants={fadeUp} className="flex gap-2 mb-8">
            {TABS.map((id) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`text-xs px-4 py-1.5 rounded-full border transition-colors ${
                  tab === id
                    ? TAB_COLORS[id]
                    : "border-white/20 text-gray-500 hover:text-white"
                }`}
              >
                {id === "all" ? t("leaderboard.all") : t(`escape.themes.${id}`)}
              </button>
            ))}
          </motion.div>

          {/* Tabela de ranking */}
          <motion.div
            variants={fadeUp}
            className="w-full max-w-3xl rounded-2xl p-[1px] bg-gradient-to-br from-purple-600/50 via-cyan-400/30 to-green-400/50"
          >
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                    <th className="px-4 py-3 text-center w-12">
                      {t("leaderboard.rank")}
                    </th>
                    <th className="px-4 py-3 text-left">
                      {t("leaderboard.player")}
                    </th>
                    <th className="px-4 py-3 text-right">
                      {t("leaderboard.bestScore")}
                    </th>
                    <th className="px-4 py-3 text-center hidden md:table-cell">
                      {t("leaderboard.theme")}
                    </th>
                    <th className="px-4 py-3 text-center hidden md:table-cell">
                      {t("leaderboard.level")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {scores.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-12 text-center text-gray-500"
                      >
                        {t("leaderboard.empty")}
                      </td>
                    </tr>
                  )}
                  {scores.map((s, i) => {
                    const isMe = s.walletAddress === myWallet;
                    return (
                      <tr
                        key={s.id}
                        className={`border-b border-white/5 transition-colors ${isMe ? "bg-purple-600/10" : "hover:bg-white/5"}`}
                      >
                        <td className="px-4 py-3 text-center font-bold">
                          {i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{s.avatar}</span>
                            <div>
                              <p
                                className={`font-medium ${isMe ? "text-cyan-300" : "text-white"}`}
                              >
                                {s.nickname}
                                {isMe ? " (you)" : ""}
                              </p>
                              <p className="text-xs text-gray-500 font-mono">
                                {s.walletAddress.slice(0, 4)}...
                                {s.walletAddress.slice(-4)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-cyan-400">
                          {s.score}
                        </td>
                        <td className="px-4 py-3 text-center hidden md:table-cell text-gray-400 text-xs">
                          {t(`escape.themes.${s.theme}`)}
                        </td>
                        <td className="px-4 py-3 text-center hidden md:table-cell text-gray-400 text-xs">
                          {t(`escape.levels.${s.level}`)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}

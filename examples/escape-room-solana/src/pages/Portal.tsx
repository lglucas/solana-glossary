/**
 * @arquivo Portal.tsx
 * @descricao Pagina de entrada retro-Solana estilo Sonic/Mega Man X
 * @projeto Solana Glossary — Escape Room Solana + Jogo da Vida
 * @autor Lucas Galvao (@lg_lucas) — Tokenfy.me
 */
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { getTopScores } from "../lib/leaderboard";

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const GAMES = [
  {
    id: "escape",
    path: "/escape",
    gradient: "from-purple-600 via-cyan-500 to-green-400",
    border: "border-purple-500/40 hover:border-cyan-400/60",
    glow: "shadow-purple-500/20",
    icon: "🔓",
    bgPattern:
      "bg-[radial-gradient(circle_at_30%_50%,rgba(153,69,255,0.15),transparent_50%)]",
  },
  {
    id: "vida",
    path: "/vida",
    gradient: "from-emerald-400 via-yellow-400 to-orange-500",
    border: "border-emerald-500/40 hover:border-yellow-400/60",
    glow: "shadow-emerald-500/20",
    icon: "🎲",
    bgPattern:
      "bg-[radial-gradient(circle_at_70%_50%,rgba(16,185,129,0.15),transparent_50%)]",
  },
];

export default function Portal() {
  const { t, i18n } = useTranslation();
  const topScores = getTopScores(5);

  return (
    <Layout hideBack>
      <div className="relative min-h-screen bg-[#0a0015] text-white overflow-hidden">
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.1) 2px,rgba(255,255,255,0.1) 4px)",
          }}
        />
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(153,69,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(20,241,149,0.1) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <motion.div
          className="relative z-10 flex flex-col items-center px-6 pt-16 pb-12"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="mb-2">
            <h1 className="text-5xl md:text-7xl font-extrabold text-center font-['Orbitron',sans-serif] tracking-wider">
              <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(153,69,255,0.5)]">
                SOLANA
              </span>
            </h1>
            <h2 className="text-3xl md:text-5xl font-extrabold text-center font-['Orbitron',sans-serif] tracking-widest mt-1">
              <span className="bg-gradient-to-r from-cyan-300 via-green-300 to-emerald-400 bg-clip-text text-transparent">
                GLOSSARY
              </span>
            </h2>
          </motion.div>
          <motion.p
            variants={fadeUp}
            className="text-sm text-gray-500 font-mono tracking-widest mb-2"
          >
            ━━━ PRESS START ━━━
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="text-gray-400 text-center max-w-md mb-8 text-sm"
          >
            {t("portal.subtitle")}
          </motion.p>

          {/* Idioma */}
          <motion.div variants={fadeUp} className="flex gap-2 mb-10">
            {["pt-BR", "es"].map((lang) => (
              <button
                key={lang}
                onClick={() => i18n.changeLanguage(lang)}
                className={`text-xs px-4 py-1.5 rounded-full border font-mono transition-colors ${i18n.language === lang ? "border-cyan-400 text-cyan-300" : "border-white/20 text-gray-500 hover:text-white"}`}
              >
                {lang === "pt-BR" ? "PT-BR" : "ES"}
              </button>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-12">
            {GAMES.map((g) => (
              <motion.div key={g.id} variants={scaleIn}>
                <Link
                  to={g.path}
                  className={`block rounded-2xl p-[1px] bg-gradient-to-br ${g.gradient} shadow-xl ${g.glow} hover:shadow-2xl transition-all duration-300 group`}
                >
                  <div
                    className={`rounded-2xl bg-[#0a0015]/90 backdrop-blur-xl p-8 ${g.bgPattern} h-full`}
                  >
                    <div className="text-5xl mb-4">{g.icon}</div>
                    <h3
                      className={`text-2xl font-bold font-['Orbitron',sans-serif] bg-gradient-to-r ${g.gradient} bg-clip-text text-transparent mb-2`}
                    >
                      {t(`portal.games.${g.id}`)}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {t(`portal.games.${g.id}Desc`)}
                    </p>
                    <span
                      className={`inline-block text-xs px-4 py-1.5 rounded-full border ${g.border} font-mono tracking-wider group-hover:text-white transition-colors`}
                    >
                      {t("portal.play")} →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mini leaderboard */}
          <motion.div variants={fadeUp} className="w-full max-w-3xl mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-mono text-gray-500 tracking-widest uppercase">
                {t("portal.topPlayers")}
              </h3>
              <Link
                to="/ranking"
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono"
              >
                {t("portal.viewAll")} →
              </Link>
            </div>
            {topScores.length === 0 ? (
              <p className="text-gray-600 text-sm font-mono text-center py-6">
                {t("portal.noScores")}
              </p>
            ) : (
              <div className="grid gap-2">
                {topScores.map((s, i) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5"
                  >
                    <span className="text-sm font-bold w-6">
                      {i < 3 ? ["🥇", "🥈", "🥉"][i] : `${i + 1}.`}
                    </span>
                    <span className="text-lg">{s.avatar}</span>
                    <span className="text-sm text-white flex-1">
                      {s.nickname}
                    </span>
                    <span className="text-sm font-bold text-cyan-400 font-mono">
                      {s.score}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Footer */}
          <motion.footer
            variants={fadeUp}
            className="text-xs text-gray-600 text-center font-mono"
          >
            {t("portal.footer")}
          </motion.footer>
        </motion.div>
      </div>
    </Layout>
  );
}

/**
 * @arquivo Home.tsx
 * @descricao Landing page do Escape Room com cards de temas e animacoes
 * @projeto Solana Glossary — Escape Room Solana
 * @autor Lucas Galvao — AceleradoraECO
 */

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import AnimatedBlobs from "../components/AnimatedBlobs";
import Layout from "../components/Layout";
import ThemeCard from "../components/ThemeCard";
import type { ThemeData } from "../components/ThemeCard";

// ─── Dados dos temas ────────────────────────────────────────────────────────

const THEMES: ThemeData[] = [
  {
    id: "genesis",
    nameKey: "escape.themes.genesis",
    descKey: "escape.themes.genesisDesc",
    gradient: "from-purple-600 via-violet-500 to-cyan-400",
    border: "border-purple-500/30",
    glow: "hover:shadow-purple-500/20",
    icon: "\u26A1",
  },
  {
    id: "defi",
    nameKey: "escape.themes.defi",
    descKey: "escape.themes.defiDesc",
    gradient: "from-emerald-500 via-teal-400 to-purple-500",
    border: "border-emerald-500/30",
    glow: "hover:shadow-emerald-500/20",
    icon: "\uD83D\uDD10",
  },
  {
    id: "lab",
    nameKey: "escape.themes.lab",
    descKey: "escape.themes.labDesc",
    gradient: "from-blue-500 via-orange-400 to-pink-500",
    border: "border-blue-500/30",
    glow: "hover:shadow-blue-500/20",
    icon: "\uD83E\uddEA",
  },
];

// ─── Variantes de animacao ──────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// ─── Componente ─────────────────────────────────────────────────────────────

export default function Home() {
  const { t, i18n } = useTranslation();

  return (
    <Layout hideBack>
      <div className="relative min-h-screen bg-[#0a0015] text-white overflow-hidden font-['Space_Grotesk',sans-serif]">
        <AnimatedBlobs variant="genesis" />

        {/* ── Conteudo central ──────────────────────────────────────── */}
        <motion.div
          className="relative z-10 flex flex-col items-center px-6 pt-20 pb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Titulo */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold text-center leading-tight mb-4 font-['Orbitron',sans-serif] bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400 bg-clip-text text-transparent"
          >
            {t("escape.title")}
          </motion.h1>

          {/* Subtitulo */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 text-center max-w-xl mb-12"
          >
            {t("escape.subtitle")}
          </motion.p>

          {/* Toggle idioma (inline) */}
          <motion.div variants={itemVariants} className="flex gap-2 mb-10">
            <button
              onClick={() => i18n.changeLanguage("pt-BR")}
              className={`text-xs px-4 py-1.5 rounded-full border transition-colors ${
                i18n.language === "pt-BR"
                  ? "border-cyan-400 text-cyan-300"
                  : "border-white/20 text-gray-500 hover:text-white"
              }`}
            >
              PT-BR
            </button>
            <button
              onClick={() => i18n.changeLanguage("es")}
              className={`text-xs px-4 py-1.5 rounded-full border transition-colors ${
                i18n.language === "es"
                  ? "border-cyan-400 text-cyan-300"
                  : "border-white/20 text-gray-500 hover:text-white"
              }`}
            >
              ES
            </button>
          </motion.div>

          {/* Cards de temas */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-12"
          >
            {THEMES.map((theme) => (
              <ThemeCard key={theme.id} theme={theme} t={t} />
            ))}
          </motion.div>

          {/* Links de navegacao */}
          <motion.div variants={itemVariants} className="flex gap-4 mb-8">
            <Link
              to="/temas"
              className="px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-colors text-sm"
            >
              {t("escape.viewAllThemes")}
            </Link>
            <Link
              to="/ranking"
              className="px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-colors text-sm"
            >
              {t("common.leaderboard")}
            </Link>
          </motion.div>

          {/* Wallet placeholder */}
          <motion.button
            variants={itemVariants}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity mb-16"
          >
            {t("common.connectWallet")}
          </motion.button>

          {/* Footer */}
          <motion.footer
            variants={itemVariants}
            className="text-xs text-gray-600 text-center"
          >
            {t("escape.footer")}
          </motion.footer>
        </motion.div>
      </div>
    </Layout>
  );
}

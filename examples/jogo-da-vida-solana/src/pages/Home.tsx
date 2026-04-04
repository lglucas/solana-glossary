/**
 * @arquivo Home.tsx
 * @descricao Landing page — selecao de tabuleiros e CTA multiplayer
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao — AceleradoraECO
 */

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { NeonGrid } from "../components/NeonGrid";
import { BoardCard, BOARDS } from "../components/BoardCard";

// ---------------------------------------------------------------------------
// Animacoes
// ---------------------------------------------------------------------------

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.15 } },
};

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  function toggleLang() {
    const next = i18n.language === "pt-BR" ? "es" : "pt-BR";
    i18n.changeLanguage(next);
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "#050510",
        fontFamily: "'Share Tech Mono', monospace",
      }}
    >
      {/* Fundo animado */}
      <NeonGrid variant="neon" />

      {/* Barra superior */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-20 flex items-center justify-between px-6 py-4"
      >
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: "#00fff066" }}
        >
          Solana Glossary
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="text-xs px-3 py-1 rounded border cursor-pointer
                       border-violet-500/30 text-violet-400
                       hover:bg-violet-500/10 transition-colors"
          >
            {i18n.language === "pt-BR" ? "PT-BR" : "ES"}
          </button>
          <WalletMultiButton
            style={{
              fontSize: "12px",
              height: "30px",
              padding: "0 12px",
              borderRadius: "6px",
              background: "#14142b",
              border: "1px solid #00fff033",
            }}
          />
        </div>
      </motion.header>

      {/* Conteudo principal */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 pb-16"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        {/* Titulo com glow neon */}
        <motion.div variants={fadeUp} className="text-center pt-8 pb-2">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              color: "#00fff0",
              textShadow:
                "0 0 20px #00fff066, 0 0 40px #00fff033, 0 0 80px #bf5af222",
            }}
          >
            {t("vida.title")}
          </h1>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="text-center text-sm md:text-base mb-12"
          style={{ color: "#bf5af2aa" }}
        >
          Sua jornada no ecossistema Solana comeca aqui
        </motion.p>

        {/* Cards dos tabuleiros */}
        <motion.div
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {BOARDS.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onPlay={() => navigate(`/jogar/${board.id}`)}
              playLabel={t("common.play")}
              playersLabel={t("common.players")}
            />
          ))}
        </motion.div>

        {/* Callout multiplayer */}
        <motion.div
          variants={fadeUp}
          className="text-center rounded-xl p-6 mx-auto max-w-lg"
          style={{
            border: "1px solid #bf5af233",
            background: "linear-gradient(135deg, #0a0a2a88, #15053088)",
            boxShadow: "0 0 40px #bf5af211",
          }}
        >
          <p
            className="text-lg font-semibold mb-2"
            style={{
              color: "#bf5af2",
              fontFamily: "'Orbitron', sans-serif",
            }}
          >
            Multiplayer Online
          </p>
          <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>
            Jogue online com amigos! Gere um link de convite.
          </p>
          <button
            onClick={() => navigate("/tabuleiros")}
            className="px-6 py-2 rounded-lg text-sm tracking-wider uppercase
                       cursor-pointer transition-all hover:scale-105"
            style={{
              color: "#00fff0",
              border: "1px solid #00fff055",
              background: "#00fff00d",
              boxShadow: "0 0 20px #00fff022",
            }}
          >
            {t("vida.createRoom")}
          </button>
        </motion.div>

        {/* Rodape */}
        <motion.footer variants={fadeUp} className="text-center mt-16 pb-4">
          <div
            className="h-px w-1/3 mx-auto mb-6"
            style={{
              background:
                "linear-gradient(90deg, transparent, #bf5af244, transparent)",
            }}
          />
          <p className="text-[10px]" style={{ color: "#6b637544" }}>
            Solana Glossary — Superteam Brazil Competition 2026
          </p>
          <p className="text-[10px]" style={{ color: "#6b637533" }}>
            Lucas Galvao — AceleradoraECO
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
}

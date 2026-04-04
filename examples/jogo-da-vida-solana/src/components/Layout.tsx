/**
 * @arquivo Layout.tsx
 * @descricao Layout compartilhado — barra superior, controles e conteudo
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao — AceleradoraECO
 */

import { type ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";
import { audioManager } from "../lib/audio";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface LayoutProps {
  children: ReactNode;
  /** Numero de jogadores na sala (exibido no badge) */
  playerCount?: number;
  /** Exibir botao de voltar (padrao: true, exceto na home) */
  showBack?: boolean;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function Layout({ children, playerCount, showBack }: LayoutProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [muted, setMuted] = useState(audioManager.isMuted());

  // Na rota "/" nao exibir botao voltar por padrao
  const exibirVoltar = showBack ?? location.pathname !== "/";

  /** Alterna idioma entre pt-BR e es */
  function toggleLang() {
    const next = i18n.language === "pt-BR" ? "es" : "pt-BR";
    i18n.changeLanguage(next);
  }

  /** Alterna mudo/som */
  function toggleMute() {
    const nowMuted = audioManager.toggleMute();
    setMuted(nowMuted);
  }

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        background: "#050510",
        fontFamily: "'Share Tech Mono', monospace",
      }}
    >
      {/* ---- Barra superior ---- */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-30 flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid #ffffff0d" }}
      >
        {/* Lado esquerdo: voltar + badge jogadores */}
        <div className="flex items-center gap-3">
          {exibirVoltar && (
            <button
              onClick={() => navigate(-1)}
              className="text-sm px-3 py-1 rounded border cursor-pointer
                         border-cyan-500/30 text-cyan-400
                         hover:bg-cyan-500/10 transition-colors"
            >
              {t("common.back")}
            </button>
          )}

          {playerCount !== undefined && playerCount > 0 && (
            <span
              className="text-xs px-2 py-1 rounded"
              style={{
                color: "#00fff0",
                border: "1px solid #00fff033",
                background: "#00fff00a",
              }}
            >
              {playerCount} {t("common.players")}
            </span>
          )}
        </div>

        {/* Lado direito: idioma, mute, wallet */}
        <div className="flex items-center gap-2">
          {/* Toggle idioma */}
          <button
            onClick={toggleLang}
            className="text-xs px-2 py-1 rounded border cursor-pointer
                       border-violet-500/30 text-violet-400
                       hover:bg-violet-500/10 transition-colors"
            title={t("common.language")}
          >
            {i18n.language === "pt-BR" ? "PT" : "ES"}
          </button>

          {/* Toggle mute */}
          <button
            onClick={toggleMute}
            className="text-xs px-2 py-1 rounded border cursor-pointer
                       border-violet-500/30 text-violet-400
                       hover:bg-violet-500/10 transition-colors"
            title={muted ? t("common.unmute") : t("common.mute")}
          >
            {muted ? "MUTE" : "SOM"}
          </button>

          {/* Wallet */}
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

      {/* ---- Conteudo principal ---- */}
      <main className="flex-1 relative z-10">{children}</main>
    </div>
  );
}

/**
 * @arquivo GamePlay.tsx
 * @descricao Tela principal do jogo — tabuleiro, dado e eventos
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao — AceleradoraECO
 */

import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "../components/Layout";
import { NeonGrid } from "../components/NeonGrid";

// ---------------------------------------------------------------------------
// Mapa de variantes por tabuleiro
// ---------------------------------------------------------------------------

const VARIANT_MAP: Record<string, "neon" | "matrix" | "pixel"> = {
  normie: "neon",
  startup: "matrix",
  timeline: "pixel",
};

// ---------------------------------------------------------------------------
// Componente (placeholder — sera implementado na sprint de gameplay)
// ---------------------------------------------------------------------------

export default function GamePlay() {
  const { tabuleiro } = useParams<{ tabuleiro: string }>();
  const { t } = useTranslation();
  const variant = VARIANT_MAP[tabuleiro ?? "normie"] ?? "neon";

  return (
    <Layout playerCount={1}>
      <div className="relative min-h-[60vh] flex items-center justify-center">
        <NeonGrid variant={variant} />
        <div className="relative z-10 text-center">
          <h2
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              color: "#00fff0",
              textShadow: "0 0 20px #00fff044",
            }}
          >
            {t(`vida.boards.${tabuleiro}`) || tabuleiro}
          </h2>
          <p className="text-sm" style={{ color: "#6b6375" }}>
            Tabuleiro em construcao...
          </p>
        </div>
      </div>
    </Layout>
  );
}

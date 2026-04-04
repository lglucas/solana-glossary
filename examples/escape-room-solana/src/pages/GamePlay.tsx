/**
 * @arquivo GamePlay.tsx
 * @descricao Pagina de gameplay (placeholder para implementacao futura)
 * @projeto Solana Glossary — Escape Room Solana
 * @autor Lucas Galvao — AceleradoraECO
 */

import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import AnimatedBlobs from "../components/AnimatedBlobs";
import type { BlobVariant } from "../components/AnimatedBlobs";

// ─── Componente ─────────────────────────────────────────────────────────────

export default function GamePlay() {
  const { tema, nivel } = useParams<{ tema: string; nivel: string }>();
  const { t } = useTranslation();

  // Determina variante de blob pelo tema
  const variant: BlobVariant =
    tema === "defi" ? "defi" : tema === "lab" ? "lab" : "genesis";

  return (
    <Layout>
      <div className="relative min-h-screen bg-[#0a0015] text-white font-['Space_Grotesk',sans-serif]">
        <AnimatedBlobs variant={variant} />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
          <h1 className="text-4xl font-bold font-['Orbitron',sans-serif] bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400 bg-clip-text text-transparent mb-4">
            {tema && t(`escape.themes.${tema}`)}
          </h1>
          <p className="text-gray-400 text-lg mb-2">
            {nivel && t(`escape.levels.${nivel}`)}
          </p>
          <p className="text-gray-500 text-sm">Em breve...</p>
        </div>
      </div>
    </Layout>
  );
}

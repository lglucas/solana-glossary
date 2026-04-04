/**
 * @arquivo Lobby.tsx
 * @descricao Sala de espera multiplayer — aguarda jogadores antes de iniciar
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao — AceleradoraECO
 */

import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "../components/Layout";

// ---------------------------------------------------------------------------
// Componente (placeholder — sera implementado na sprint de multiplayer)
// ---------------------------------------------------------------------------

export default function Lobby() {
  const { codigo } = useParams<{ codigo: string }>();
  const { t } = useTranslation();

  return (
    <Layout playerCount={1}>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              color: "#00fff0",
              textShadow: "0 0 20px #00fff044",
            }}
          >
            {t("vida.roomCode")}: {codigo}
          </h2>
          <p className="text-sm" style={{ color: "#6b6375" }}>
            {t("common.waiting")}
          </p>
        </div>
      </div>
    </Layout>
  );
}

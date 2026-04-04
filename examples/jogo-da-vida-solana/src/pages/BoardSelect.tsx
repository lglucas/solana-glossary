/**
 * @arquivo BoardSelect.tsx
 * @descricao Pagina de selecao de tabuleiro antes de criar/entrar em sala
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao — AceleradoraECO
 */

import { useTranslation } from "react-i18next";
import { Layout } from "../components/Layout";

// ---------------------------------------------------------------------------
// Componente (placeholder — sera implementado na sprint de gameplay)
// ---------------------------------------------------------------------------

export default function BoardSelect() {
  const { t } = useTranslation();

  return (
    <Layout>
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
            {t("vida.selectBoard")}
          </h2>
          <p className="text-sm" style={{ color: "#6b6375" }}>
            Em breve...
          </p>
        </div>
      </div>
    </Layout>
  );
}

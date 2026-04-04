/**
 * @arquivo App.tsx
 * @descricao Roteador principal com lazy loading de paginas
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao — AceleradoraECO
 */

import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// ---------------------------------------------------------------------------
// Paginas com lazy loading
// ---------------------------------------------------------------------------

const Home = lazy(() => import("./pages/Home"));
const BoardSelect = lazy(() => import("./pages/BoardSelect"));
const Lobby = lazy(() => import("./pages/Lobby"));
const GamePlay = lazy(() => import("./pages/GamePlay"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));

// ---------------------------------------------------------------------------
// Spinner de carregamento
// ---------------------------------------------------------------------------

function LoadingSpinner() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#050510" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full animate-spin"
          style={{
            border: "3px solid #1a1a3a",
            borderTopColor: "#00fff0",
            boxShadow: "0 0 20px #00fff044",
          }}
        />
        <span
          className="text-sm tracking-widest uppercase"
          style={{
            color: "#00fff0",
            fontFamily: "'Share Tech Mono', monospace",
          }}
        >
          Carregando...
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tabuleiros" element={<BoardSelect />} />
        <Route path="/sala/:codigo" element={<Lobby />} />
        <Route path="/jogar/:tabuleiro" element={<GamePlay />} />
        <Route path="/ranking" element={<Leaderboard />} />
      </Routes>
    </Suspense>
  );
}

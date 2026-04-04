/**
 * @arquivo PuzzleShell.tsx
 * @descricao Wrapper visual compartilhado — glassmorphism, animacao entrada/saida
 * @projeto Solana Glossary — Escape Room Solana
 * @autor Lucas Galvao — AceleradoraECO
 */
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface PuzzleShellProps {
  /** Chave para AnimatePresence (trocar reseta animacao) */
  puzzleKey: string | number;
  /** Chave i18n do titulo do puzzle (ex: "puzzle.trueFalse") */
  titleKey: string;
  /** Instrucao para o jogador (chave i18n) */
  hintKey?: string;
  /** Conteudo do puzzle */
  children: React.ReactNode;
}

/** Variantes de animacao — entrada da esquerda, saida pela direita */
const variants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

export default function PuzzleShell({
  puzzleKey,
  titleKey,
  hintKey,
  children,
}: PuzzleShellProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={puzzleKey}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.35 }}
        className="flex-1"
      >
        {/* Cabecalho do puzzle */}
        <div className="mb-4">
          <span className="text-xs text-purple-300 uppercase tracking-wider font-semibold">
            {t(titleKey)}
          </span>
          {hintKey && (
            <p className="text-sm text-gray-400 mt-1">{t(hintKey)}</p>
          )}
        </div>

        {/* Conteudo do puzzle */}
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

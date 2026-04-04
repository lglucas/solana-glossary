/**
 * @arquivo wallet.tsx
 * @descricao Provider de carteira Solana com Phantom e Solflare
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao — AceleradoraECO
 */

import { type ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// Importa estilos padrao do modal de carteira
import "@solana/wallet-adapter-react-ui/styles.css";

// ---------------------------------------------------------------------------
// Configuracao
// ---------------------------------------------------------------------------

/** RPC customizado via env ou fallback para devnet */
const RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl("devnet");

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

interface WalletProviderProps {
  children: ReactNode;
}

/**
 * Wrapper que encapsula Connection + Wallet + Modal providers.
 * Basta envolver a arvore de componentes com <WalletProvider>.
 */
export function WalletProvider({ children }: WalletProviderProps) {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [],
  );

  return (
    <ConnectionProvider endpoint={RPC_URL}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}

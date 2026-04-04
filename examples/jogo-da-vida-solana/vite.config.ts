/**
 * @arquivo vite.config.ts
 * @descricao Configuracao do Vite com React e TailwindCSS
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao — AceleradoraECO
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});

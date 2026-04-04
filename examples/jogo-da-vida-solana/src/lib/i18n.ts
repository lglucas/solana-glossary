/**
 * @arquivo i18n.ts
 * @descricao Configuracao de internacionalizacao com react-i18next (pt-BR / es)
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao — AceleradoraECO
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ptBR from "../locales/pt-BR.json";
import es from "../locales/es.json";

// ---------------------------------------------------------------------------
// Recursos de traducao
// ---------------------------------------------------------------------------

const resources = {
  "pt-BR": { translation: ptBR },
  es: { translation: es },
};

// ---------------------------------------------------------------------------
// Inicializacao
// ---------------------------------------------------------------------------

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "pt-BR",

    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "lang",
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

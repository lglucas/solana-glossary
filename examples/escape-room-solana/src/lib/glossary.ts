/**
 * @arquivo glossary.ts
 * @descricao Integracao com SDK @stbr/solana-glossary — busca e selecao de termos
 * @projeto Solana Glossary — Escape Room Solana
 * @autor Lucas Galvao — AceleradoraECO
 */
import {
  getTermsByCategory,
  type GlossaryTerm,
  type Category,
} from "@stbr/solana-glossary";
import { getLocalizedTerms } from "@stbr/solana-glossary/i18n";
import type { ThemeId, LevelId } from "../engine/themes";
import { getThemeConfig, getLevelConfig } from "../engine/themes";

/** Termo processado para uso nos puzzles */
export interface PuzzleTerm {
  id: string;
  term: string;
  definition: string;
  category: Category;
  /** IDs de termos relacionados (usado por ConnectionWeb, RelatedTerms, etc.) */
  related: string[];
  /** Abreviacoes/aliases (usado por AliasResolver) */
  aliases: string[];
}

/**
 * Normaliza locale do i18n para o formato do SDK.
 * i18n usa "pt-BR" mas SDK tem "pt.json", nao "pt-BR.json".
 */
function normalizeLocale(locale: string): string {
  const map: Record<string, string> = { "pt-BR": "pt", "pt-br": "pt" };
  return map[locale] ?? locale;
}

/**
 * Busca todos os termos das categorias de um tema.
 * Retorna termos localizados se locale != 'en'.
 */
function getThemeTerms(themeId: ThemeId, locale?: string): GlossaryTerm[] {
  const theme = getThemeConfig(themeId);
  const sdkLocale = locale ? normalizeLocale(locale) : undefined;

  if (sdkLocale && sdkLocale !== "en") {
    // Busca termos localizados e filtra pelas categorias do tema
    const localized = getLocalizedTerms(sdkLocale);
    return localized.filter((t) =>
      theme.categories.includes(t.category as Category),
    );
  }

  // Busca direto por categoria (ingles)
  return theme.categories.flatMap((cat) => getTermsByCategory(cat));
}

/**
 * Embaralha array usando Fisher-Yates.
 * Usa seed opcional para reprodutibilidade.
 */
export function shuffle<T>(arr: T[], seed?: number): T[] {
  const copy = [...arr];
  // Normaliza seed para evitar overflow em Date.now() * 16807
  let s = seed ? (Math.abs(seed) % 2147483646) + 1 : 0;
  const rand = s
    ? () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
      }
    : Math.random;

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Seleciona termos para um puzzle.
 * Retorna `count` termos aleatorios (com 3x pool para variedade).
 * Filtra termos sem definicao.
 */
export function selectPuzzleTerms(
  themeId: ThemeId,
  levelId: LevelId,
  locale?: string,
  sessionSeed?: number,
): PuzzleTerm[] {
  const level = getLevelConfig(themeId, levelId);
  const allTerms = getThemeTerms(themeId, locale);

  // Filtra termos que tem definicao preenchida
  const valid = allTerms.filter((t) => t.definition.length > 0);

  // Embaralha e pega o necessario
  const shuffled = shuffle(valid, sessionSeed);
  const selected = shuffled.slice(0, level.termCount);

  // Ordena por dificuldade crescente (definicao menor = mais facil)
  selected.sort((a, b) => a.definition.length - b.definition.length);

  return selected.map((t) => ({
    id: t.id,
    term: t.term,
    definition: t.definition,
    category: t.category as Category,
    related: t.related ?? [],
    aliases: t.aliases ?? [],
  }));
}

/**
 * Gera uma dica para um termo.
 * Revela a primeira letra + tamanho da palavra.
 */
export function generateHint(term: PuzzleTerm): string {
  const firstLetter = term.term.charAt(0);
  const wordCount = term.term.split(/\s+/).length;
  const charCount = term.term.length;
  return `Comeca com "${firstLetter}", ${wordCount} palavra(s), ${charCount} caracteres`;
}

/**
 * Retorna o total de termos disponiveis para um tema.
 * Util para exibir na UI.
 */
export function getThemeTermCount(themeId: ThemeId): number {
  return getThemeTerms(themeId).filter((t) => t.definition.length > 0).length;
}

/**
 * @arquivo audio.ts
 * @descricao Gerenciador de audio (BGM + SFX) usando Howler.js
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao — AceleradoraECO
 */

import { Howl } from "howler";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

/** Trilhas de fundo disponiveis */
export type BgmTrack = "adventure" | "tension" | "celebration";

/** Efeitos sonoros disponiveis */
export type SfxName =
  | "dice"
  | "move"
  | "advance"
  | "retreat"
  | "event"
  | "quiz-correct"
  | "quiz-wrong";

// ---------------------------------------------------------------------------
// Mapeamento de arquivos
// ---------------------------------------------------------------------------

const BGM_PATHS: Record<BgmTrack, string> = {
  adventure: "/audio/bgm-adventure.mp3",
  tension: "/audio/bgm-tension.mp3",
  celebration: "/audio/bgm-celebration.mp3",
};

const SFX_PATHS: Record<SfxName, string> = {
  dice: "/audio/sfx-dice.mp3",
  move: "/audio/sfx-move.mp3",
  advance: "/audio/sfx-advance.mp3",
  retreat: "/audio/sfx-retreat.mp3",
  event: "/audio/sfx-event.mp3",
  "quiz-correct": "/audio/sfx-quiz-correct.mp3",
  "quiz-wrong": "/audio/sfx-quiz-wrong.mp3",
};

// ---------------------------------------------------------------------------
// Classe AudioManager (Singleton)
// ---------------------------------------------------------------------------

class AudioManager {
  private bgm: Howl | null = null;
  private currentTrack: BgmTrack | null = null;
  private sfxCache: Map<SfxName, Howl> = new Map();
  private volume = 0.5;
  private muted = false;

  // ---- BGM ---------------------------------------------------------------

  /** Inicia uma trilha de fundo (para a anterior se houver) */
  playBgm(track: BgmTrack): void {
    if (this.currentTrack === track && this.bgm?.playing()) return;

    this.stopBgm();

    this.bgm = new Howl({
      src: [BGM_PATHS[track]],
      loop: true,
      volume: this.muted ? 0 : this.volume * 0.6,
    });

    this.bgm.play();
    this.currentTrack = track;
  }

  /** Para a trilha de fundo atual */
  stopBgm(): void {
    if (this.bgm) {
      this.bgm.stop();
      this.bgm.unload();
      this.bgm = null;
      this.currentTrack = null;
    }
  }

  // ---- SFX ---------------------------------------------------------------

  /** Toca um efeito sonoro (usa cache para performance) */
  playSfx(name: SfxName): void {
    if (this.muted) return;

    let sfx = this.sfxCache.get(name);

    if (!sfx) {
      sfx = new Howl({
        src: [SFX_PATHS[name]],
        volume: this.volume,
      });
      this.sfxCache.set(name, sfx);
    }

    sfx.volume(this.volume);
    sfx.play();
  }

  // ---- Volume / Mute -----------------------------------------------------

  /** Define o volume global (0 a 1) */
  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));

    if (this.bgm) {
      this.bgm.volume(this.muted ? 0 : this.volume * 0.6);
    }
  }

  /** Alterna mudo/som */
  toggleMute(): boolean {
    this.muted = !this.muted;

    if (this.bgm) {
      this.bgm.volume(this.muted ? 0 : this.volume * 0.6);
    }

    return this.muted;
  }

  /** Retorna se esta mutado */
  isMuted(): boolean {
    return this.muted;
  }
}

// ---------------------------------------------------------------------------
// Exportacao Singleton
// ---------------------------------------------------------------------------

export const audioManager = new AudioManager();

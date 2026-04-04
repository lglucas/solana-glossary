/**
 * @arquivo audio.ts
 * @descricao Gerenciador de audio singleton usando Howler.js
 * @projeto Solana Glossary — Escape Room Solana
 * @autor Lucas Galvao — AceleradoraECO
 */

import { Howl } from "howler";

// ─── Tipos ───────────────────────────────────────────────────────────────────

/** Trilhas sonoras disponiveis */
export type BgmTrack = "suspense" | "victory" | "defeat";

/** Efeitos sonoros disponiveis */
export type SfxName = "correct" | "wrong" | "tick" | "hint" | "unlock";

// ─── Caminhos dos arquivos ───────────────────────────────────────────────────

const BGM_PATHS: Record<BgmTrack, string> = {
  suspense: "/audio/bgm-suspense.mp3",
  victory: "/audio/bgm-victory.mp3",
  defeat: "/audio/bgm-defeat.mp3",
};

const SFX_PATHS: Record<SfxName, string> = {
  correct: "/audio/sfx-correct.mp3",
  wrong: "/audio/sfx-wrong.mp3",
  tick: "/audio/sfx-tick.mp3",
  hint: "/audio/sfx-hint.mp3",
  unlock: "/audio/sfx-unlock.mp3",
};

// ─── Classe singleton ────────────────────────────────────────────────────────

class AudioManager {
  private bgm: Howl | null = null;
  private sfxCache: Map<SfxName, Howl> = new Map();
  private volume = 0.5;
  private muted = false;

  /** Inicia uma trilha de fundo (para a anterior se houver) */
  playBgm(track: BgmTrack): void {
    this.stopBgm();

    this.bgm = new Howl({
      src: [BGM_PATHS[track]],
      loop: true,
      volume: this.muted ? 0 : this.volume * 0.6,
    });

    this.bgm.play();
  }

  /** Para a trilha de fundo atual */
  stopBgm(): void {
    if (this.bgm) {
      this.bgm.stop();
      this.bgm.unload();
      this.bgm = null;
    }
  }

  /** Toca um efeito sonoro pontual */
  playSfx(name: SfxName): void {
    let sfx = this.sfxCache.get(name);

    if (!sfx) {
      sfx = new Howl({
        src: [SFX_PATHS[name]],
        volume: this.muted ? 0 : this.volume,
      });
      this.sfxCache.set(name, sfx);
    }

    sfx.volume(this.muted ? 0 : this.volume);
    sfx.play();
  }

  /** Define o volume global (0 a 1) */
  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));

    if (this.bgm && !this.muted) {
      this.bgm.volume(this.volume * 0.6);
    }
  }

  /** Alterna mute/unmute */
  toggleMute(): boolean {
    this.muted = !this.muted;

    if (this.bgm) {
      this.bgm.volume(this.muted ? 0 : this.volume * 0.6);
    }

    this.sfxCache.forEach((sfx) => {
      sfx.volume(this.muted ? 0 : this.volume);
    });

    return this.muted;
  }

  /** Retorna o estado atual de mute */
  isMuted(): boolean {
    return this.muted;
  }
}

// ─── Exportacao singleton ────────────────────────────────────────────────────

export const audioManager = new AudioManager();

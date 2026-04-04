/**
 * @arquivo audio.ts
 * @descricao Audio sintetizado 8-bit via Web Audio API — zero dependencias de mp3
 * @projeto Solana Glossary — Escape Room Solana
 * @autor Lucas Galvao — AceleradoraECO
 */

/** Efeitos sonoros disponiveis */
export type SfxName = "correct" | "wrong" | "tick" | "hint" | "unlock";

/** Tema sonoro — altera oitava e waveform */
export type AudioTheme = "genesis" | "defi" | "lab";

// ─── Contexto global ────────────────────────────────────────────────────────

let ctx: AudioContext | null = null;

/** Inicializa o AudioContext (requer interacao do usuario) */
function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

/** Toca uma nota com oscilador */
function playNote(
  freq: number,
  type: OscillatorType,
  duration: number,
  delay = 0,
  vol = 0.15,
): void {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, c.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    c.currentTime + delay + duration,
  );
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime + delay);
  osc.stop(c.currentTime + delay + duration);
}

// ─── Configuracao por tema ──────────────────────────────────────────────────

interface ThemeAudioCfg {
  wave: OscillatorType;
  /** Multiplicador de oitava (0.5 = oitava abaixo, 2 = oitava acima) */
  octave: number;
}

const THEME_CFG: Record<AudioTheme, ThemeAudioCfg> = {
  genesis: { wave: "square", octave: 0.5 },
  defi: { wave: "sawtooth", octave: 1 },
  lab: { wave: "triangle", octave: 1.5 },
};

// ─── Definicoes dos SFX (parametrizadas) ────────────────────────────────────

function sfxCorrect(cfg: ThemeAudioCfg): void {
  playNote(523 * cfg.octave, cfg.wave, 0.12, 0, 0.12);
  playNote(659 * cfg.octave, cfg.wave, 0.18, 0.1, 0.12);
}

function sfxWrong(cfg: ThemeAudioCfg): void {
  playNote(200 * cfg.octave, cfg.wave, 0.25, 0, 0.1);
  playNote(150 * cfg.octave, cfg.wave, 0.2, 0.08, 0.08);
}

function sfxTick(cfg: ThemeAudioCfg): void {
  playNote(800 * cfg.octave, "sine", 0.05, 0, 0.06);
}

function sfxHint(cfg: ThemeAudioCfg): void {
  playNote(440 * cfg.octave, cfg.wave, 0.1, 0, 0.1);
  playNote(554 * cfg.octave, cfg.wave, 0.1, 0.08, 0.1);
  playNote(659 * cfg.octave, cfg.wave, 0.15, 0.16, 0.1);
}

function sfxUnlock(cfg: ThemeAudioCfg): void {
  [523, 587, 659, 784, 880].forEach((f, i) => {
    playNote(f * cfg.octave, cfg.wave, 0.12, i * 0.08, 0.1);
  });
}

type SfxFn = (cfg: ThemeAudioCfg) => void;

const SFX_MAP: Record<SfxName, SfxFn> = {
  correct: sfxCorrect,
  wrong: sfxWrong,
  tick: sfxTick,
  hint: sfxHint,
  unlock: sfxUnlock,
};

// ─── Classe singleton ───────────────────────────────────────────────────────

class AudioManager {
  private muted = false;
  private initialized = false;

  /** Inicializa AudioContext — chamar em qualquer click do usuario */
  init(): void {
    if (this.initialized) return;
    try {
      getCtx();
      this.initialized = true;
    } catch {
      /* noop */
    }
  }

  /** Toca um efeito sonoro sintetizado, variando por tema */
  playSfx(name: SfxName, theme?: AudioTheme): void {
    if (this.muted) return;
    if (!this.initialized) this.init();
    const cfg = THEME_CFG[theme ?? "genesis"];
    try {
      SFX_MAP[name](cfg);
    } catch {
      /* AudioContext nao disponivel */
    }
  }

  /** Alterna mute/unmute */
  toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  /** Retorna estado de mute */
  isMuted(): boolean {
    return this.muted;
  }
}

export const audioManager = new AudioManager();

/** Retorna o AudioContext compartilhado (para uso pelo BGM) */
export function getAudioContext(): AudioContext | null {
  try {
    return getCtx();
  } catch {
    return null;
  }
}

/**
 * @arquivo audio.ts
 * @descricao Audio sintetizado 8-bit via Web Audio API — zero dependencias de mp3
 * @projeto Solana Glossary — Escape Room Solana
 * @autor Lucas Galvao — AceleradoraECO
 */

/** Efeitos sonoros disponiveis */
export type SfxName = "correct" | "wrong" | "tick" | "hint" | "unlock";

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

// ─── Definicoes dos SFX ─────────────────────────────────────────────────────

/** Acerto: duas notas ascendentes (Do-Mi) */
function sfxCorrect(): void {
  playNote(523, "square", 0.12, 0, 0.12);
  playNote(659, "square", 0.18, 0.1, 0.12);
}

/** Erro: nota descendente com buzz */
function sfxWrong(): void {
  playNote(200, "sawtooth", 0.25, 0, 0.1);
  playNote(150, "sawtooth", 0.2, 0.08, 0.08);
}

/** Tick do timer (sutil) */
function sfxTick(): void {
  playNote(800, "sine", 0.05, 0, 0.06);
}

/** Dica revelada: 3 notas ascendentes */
function sfxHint(): void {
  playNote(440, "triangle", 0.1, 0, 0.1);
  playNote(554, "triangle", 0.1, 0.08, 0.1);
  playNote(659, "triangle", 0.15, 0.16, 0.1);
}

/** Desbloqueio / vitoria: escala ascendente rapida */
function sfxUnlock(): void {
  [523, 587, 659, 784, 880].forEach((f, i) => {
    playNote(f, "square", 0.12, i * 0.08, 0.1);
  });
}

const SFX_MAP: Record<SfxName, () => void> = {
  correct: sfxCorrect,
  wrong: sfxWrong,
  tick: sfxTick,
  hint: sfxHint,
  unlock: sfxUnlock,
};

// ─── Classe singleton ───────────────────────────────────────────────────────

class AudioManager {
  private muted = false;

  /** Toca um efeito sonoro sintetizado */
  playSfx(name: SfxName): void {
    if (this.muted) return;
    try {
      SFX_MAP[name]();
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

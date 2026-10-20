// Romantic Web Audio synthesizer - no external assets required, 100% reliable!

class RomanticSoundEngine {
  private ctx: AudioContext | null = null;
  private isMusicPlaying = false;
  private musicTimeout: number | null = null;
  private currentNoteIndex = 0;
  private isMuted = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft romantic chime sound
  playChime(pitchModifier = 1) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const baseFreq = 523.25 * pitchModifier; // C5
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    } catch {
      // AudioContext policy handled gracefully
    }
  }

  // Soft heart pop
  playPop() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {
      // ignore
    }
  }

  // Letter unfold / rustle sound
  playLetterOpen() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // Sparkling ascending chord
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start();
          osc.stop(this.ctx.currentTime + 0.8);
        }, idx * 90);
      });
    } catch {
      // ignore
    }
  }

  // Romantic music box melody notes (Canon / River flows in you inspired soothing romantic chord loops)
  // Frequency in Hz and duration
  private melodyNotes: { f: number; d: number }[] = [
    { f: 523.25, d: 450 }, // C5
    { f: 587.33, d: 450 }, // D5
    { f: 659.25, d: 650 }, // E5
    { f: 523.25, d: 450 }, // C5
    { f: 659.25, d: 450 }, // E5
    { f: 783.99, d: 900 }, // G5

    { f: 698.46, d: 450 }, // F5
    { f: 659.25, d: 450 }, // E5
    { f: 587.33, d: 450 }, // D5
    { f: 523.25, d: 650 }, // C5
    { f: 440.00, d: 900 }, // A4

    { f: 440.00, d: 450 }, // A4
    { f: 493.88, d: 450 }, // B4
    { f: 523.25, d: 650 }, // C5
    { f: 587.33, d: 450 }, // D5
    { f: 659.25, d: 450 }, // E5
    { f: 523.25, d: 900 }, // C5

    { f: 587.33, d: 450 }, // D5
    { f: 659.25, d: 450 }, // E5
    { f: 587.33, d: 450 }, // D5
    { f: 493.88, d: 450 }, // B4
    { f: 523.25, d: 1100 } // C5
  ];

  startMusic() {
    this.initContext();
    this.isMusicPlaying = true;
    this.playNextMusicNote();
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimeout) {
      window.clearTimeout(this.musicTimeout);
      this.musicTimeout = null;
    }
  }

  toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  getIsPlaying(): boolean {
    return this.isMusicPlaying;
  }

  private playNextMusicNote() {
    if (!this.isMusicPlaying) return;

    try {
      if (this.ctx) {
        const item = this.melodyNotes[this.currentNoteIndex];
        this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melodyNotes.length;

        // Music box bell / celesta sound: fundamental + gentle overtone
        const osc = this.ctx.createOscillator();
        const overtone = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(item.f, this.ctx.currentTime);

        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(item.f * 2.005, this.ctx.currentTime); // gentle natural chorus

        gain.gain.setValueAtTime(0.045, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + item.d / 1000 * 1.8);

        osc.connect(gain);
        overtone.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        overtone.start();
        osc.stop(this.ctx.currentTime + item.d / 1000 * 1.8);
        overtone.stop(this.ctx.currentTime + item.d / 1000 * 1.8);

        this.musicTimeout = window.setTimeout(() => {
          this.playNextMusicNote();
        }, item.d);
      }
    } catch {
      // audio error handled
    }
  }
}

export const soundEngine = new RomanticSoundEngine();

/**
 * Web Audio API procedural sound engine & Web Speech synthesis for Genius Galaxy.
 * 100% offline, lightweight, and child-ear friendly (no harsh high-frequencies).
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicInterval: number | null = null;
  private isMusicPlaying = false;
  private isMuted = false;
  private voiceEnabled = true;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policies
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isMusicPlaying) {
      this.stopBgMusic();
      this.isMusicPlaying = true; // remember intent
    } else if (!muted && this.isMusicPlaying) {
      this.startBgMusic();
    }
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
  }

  // --- Core Sound Effects ---

  /** Soft cheerful bubble pop when tapping buttons or items */
  public playPop() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  /** Sweet harmonic chime chord for correct answer (C5 - E5 - G5) */
  public playCorrect() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      const noteTime = now + idx * 0.07;
      gain.gain.setValueAtTime(0.18, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.38);
    });
  }

  /** Gentle soft wooden boing for try-again (encouraging, never punishing) */
  public playTryAgain() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.22);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  /** Star pickup sparkling harp sweep */
  public playStarWin() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [587.33, 739.99, 880.0, 1108.73, 1318.51]; // D5, F#5, A5, C#6, E6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const time = now + idx * 0.05;
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.16, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.42);
    });
  }

  /** Joyful celebratory fanfare when a level is completed */
  public playLevelFanfare() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const chords = [
      { notes: [523.25, 659.25, 783.99], time: 0, dur: 0.18 }, // C
      { notes: [587.33, 739.99, 880.0], time: 0.18, dur: 0.18 }, // D
      { notes: [659.25, 830.61, 987.77], time: 0.36, dur: 0.22 }, // E
      { notes: [783.99, 987.77, 1174.66, 1567.98], time: 0.58, dur: 0.6 }, // G high
    ];

    const now = ctx.currentTime;
    chords.forEach(c => {
      c.notes.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        const start = now + c.time;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + c.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + c.dur + 0.02);
      });
    });
  }

  /** Animal Sound Synthesizer: distinctive procedural sounds for kids' learning */
  public playAnimalSound(animal: string) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const a = animal.toLowerCase();
    const now = ctx.currentTime;

    if (a.includes('lion')) {
      // Warm lion roar: filtered sawtooth ramp
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.8);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(900, now + 0.3);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.8);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.92);
    } else if (a.includes('cow')) {
      // Gentle friendly "Moo"
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(145, now + 0.7);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(480, now);
      filter.Q.setValueAtTime(3.5, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.78);
    } else if (a.includes('cat')) {
      // Cheerful "Meow"
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.5);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.58);
    } else if (a.includes('frog')) {
      // Playful "Ribbit" double burst
      [0, 0.16].forEach(offset => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now + offset);
        osc.frequency.exponentialRampToValueAtTime(260, now + offset + 0.1);

        gain.gain.setValueAtTime(0.18, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.14);
      });
    } else if (a.includes('bird')) {
      // Cheerful tweet tweet
      [0, 0.12, 0.24].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const startFreq = idx === 1 ? 1600 : 1400;
        osc.frequency.setValueAtTime(startFreq, now + offset);
        osc.frequency.exponentialRampToValueAtTime(startFreq + 500, now + offset + 0.08);

        gain.gain.setValueAtTime(0.15, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.1);
      });
    } else if (a.includes('elephant')) {
      // Elephant trumpet
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.linearRampToValueAtTime(460, now + 0.3);
      osc.frequency.linearRampToValueAtTime(440, now + 0.6);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.68);
    } else if (a.includes('dog')) {
      // Friendly puppy bark
      [0, 0.18].forEach(offset => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(380, now + offset);
        osc.frequency.exponentialRampToValueAtTime(220, now + offset + 0.1);

        gain.gain.setValueAtTime(0.22, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.14);
      });
    } else {
      // Owl "Hoo Hoo!" (Barnaby's call)
      [0, 0.28].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const freq = idx === 1 ? 415 : 370;
        osc.frequency.setValueAtTime(freq, now + offset);

        gain.gain.setValueAtTime(0.01, now + offset);
        gain.gain.linearRampToValueAtTime(0.2, now + offset + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.24);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.26);
      });
    }
  }

  // --- Voice Synthesis (Barnaby & Instructions) ---

  /** Spoken instructions with child-friendly pitch and pacing */
  public speak(text: string, onEnd?: () => void) {
    if (!this.voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel(); // cancel any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92; // slightly slower for young learners
      utterance.pitch = 1.25; // friendly, upbeat pitch

      // Pick a natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const friendlyVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Female')));
      if (friendlyVoice) {
        utterance.voice = friendlyVoice;
      }

      if (onEnd) {
        utterance.onend = onEnd;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Fallback gracefully without interrupting gameplay
    }
  }

  // --- Gentle Background Nursery Melody Loop ---

  public startBgMusic() {
    if (this.musicInterval !== null || this.isMuted) return;
    this.isMusicPlaying = true;

    // A pleasant, gentle 8-bar pentatonic marimba lullaby in C Major
    const pentatonicNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    const melodyPattern = [0, 2, 3, 2, 4, 3, 2, 0, 1, 3, 4, 5, 4, 3, 2, 1];
    let noteStep = 0;

    this.musicInterval = window.setInterval(() => {
      if (this.isMuted) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const freq = pentatonicNotes[melodyPattern[noteStep % melodyPattern.length]];
      noteStep++;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(freq, now);

      // Very soft, non-intrusive marimba tone
      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    }, 450);
  }

  public stopBgMusic() {
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.isMusicPlaying = false;
  }
}

export const sound = new SoundEngine();

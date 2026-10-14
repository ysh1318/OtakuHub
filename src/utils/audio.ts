let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

// State variables loaded initially from localStorage or defaults
let soundEnabled = true;
let soundVolume = 0.3;
let soundPreset: "cyberpunk" | "minimal" | "ambient" = "minimal";

try {
  const savedEnabled = localStorage.getItem("otakuhub_sound_enabled");
  if (savedEnabled !== null) {
    soundEnabled = savedEnabled === "true";
  }
  const savedVol = localStorage.getItem("otakuhub_sound_volume");
  if (savedVol !== null) {
    soundVolume = parseFloat(savedVol);
  }
  const savedPreset = localStorage.getItem("otakuhub_sound_preset");
  if (savedPreset === "cyberpunk" || savedPreset === "minimal" || savedPreset === "ambient") {
    soundPreset = savedPreset;
  }
} catch (e) {
  console.warn("Could not load sound configuration from localStorage:", e);
}

export function getSoundSettings() {
  return { soundEnabled, soundVolume, soundPreset };
}

export function updateSoundSettings(
  enabled: boolean,
  volume: number,
  preset: "cyberpunk" | "minimal" | "ambient"
) {
  soundEnabled = enabled;
  soundVolume = volume;
  soundPreset = preset;
  try {
    localStorage.setItem("otakuhub_sound_enabled", String(enabled));
    localStorage.setItem("otakuhub_sound_volume", String(volume));
    localStorage.setItem("otakuhub_sound_preset", preset);
  } catch (e) {
    console.warn("Could not save sound configuration to localStorage:", e);
  }
}

/**
 * Triggers a premium synthesized sound effect using Web Audio API
 */
export function playSound(type: "click" | "hover" | "navigation" | "success") {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    // Master volume scaling node to ensure extremely comfortable, subtle listening levels
    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(soundVolume * 0.16, now);
    mainGain.connect(ctx.destination);

    // ──────────────────────────────────────────────────────────────────────────
    // PRESET: MINIMAL (Sophisticated, high-frequency, sleek and non-intrusive)
    // ──────────────────────────────────────────────────────────────────────────
    if (soundPreset === "minimal") {
      if (type === "hover") {
        // Fine acoustic click at high-frequency
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(1900, now + 0.03);

        gainNode.gain.setValueAtTime(0.04, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

        osc.connect(gainNode);
        gainNode.connect(mainGain);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === "click") {
        // High frequency micro-transient digital click
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);

        gainNode.gain.setValueAtTime(0.7, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gainNode);
        gainNode.connect(mainGain);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "navigation") {
        // Harmonic upward fifth chord with glass chime feel
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); 

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(783.99, now); // G5
        osc2.frequency.exponentialRampToValueAtTime(987.77, now + 0.1); 

        gain1.gain.setValueAtTime(0.18, now);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        gain2.gain.setValueAtTime(0.18, now);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

        osc1.connect(gain1);
        osc2.connect(gain2);
        gain1.connect(mainGain);
        gain2.connect(mainGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.1);
        osc2.stop(now + 0.1);
      } else if (type === "success") {
        // Fast four-tone glistening chime sequence
        const freqs = [523.25, 659.25, 783.99, 1046.50]; 
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, now + i * 0.035);
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.2, now + i * 0.035 + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.0005, now + i * 0.035 + 0.2);

          osc.connect(gain);
          gain.connect(mainGain);
          osc.start(now + i * 0.035);
          osc.stop(now + i * 0.035 + 0.2);
        });
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // PRESET: CYBERPUNK (8-bit micro-chiptune, modern neon digital energy)
    // ──────────────────────────────────────────────────────────────────────────
    else if (soundPreset === "cyberpunk") {
      if (type === "hover") {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.linearRampToValueAtTime(1050, now + 0.04);

        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gainNode);
        gainNode.connect(mainGain);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === "click") {
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = "square";
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.06);

        osc2.type = "sawtooth";
        osc2.frequency.setValueAtTime(520, now);
        osc2.frequency.linearRampToValueAtTime(320, now + 0.03);

        gainNode.gain.setValueAtTime(0.25, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(mainGain);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + 0.06);
        osc2.stop(now + 0.06);
      } else if (type === "navigation") {
        const notes = [440.00, 554.37, 659.25, 880.00]; 
        notes.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(f, now + i * 0.025);
          gain.gain.setValueAtTime(0.22, now + i * 0.025);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.025 + 0.06);
          osc.connect(gain);
          gain.connect(mainGain);
          osc.start(now + i * 0.025);
          osc.stop(now + i * 0.025 + 0.06);
        });
      } else if (type === "success") {
        const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
        notes.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = i % 2 === 0 ? "square" : "triangle";
          osc.frequency.setValueAtTime(f, now + i * 0.03);
          gain.gain.setValueAtTime(0.18, now + i * 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.06);
          osc.connect(gain);
          gain.connect(mainGain);
          osc.start(now + i * 0.03);
          osc.stop(now + i * 0.03 + 0.06);
        });
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // PRESET: AMBIENT (Grounded, natural, warm low frequencies, movie trailer atmosphere)
    // ──────────────────────────────────────────────────────────────────────────
    else if (soundPreset === "ambient") {
      if (type === "hover") {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(315, now + 0.07);

        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

        osc.connect(gainNode);
        gainNode.connect(mainGain);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (type === "click") {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(150, now + 0.1);

        gainNode.gain.setValueAtTime(0.35, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gainNode);
        gainNode.connect(mainGain);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "navigation") {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(360, now + 0.22);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(320, now);

        gainNode.gain.setValueAtTime(0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(mainGain);

        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === "success") {
        const chord = [261.63, 311.13, 392.00, 466.16]; // Cm7 warm chord (C4, Eb4, G4, Bb4)
        chord.forEach((f) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = "sine";
          osc.frequency.setValueAtTime(f, now);

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(450, now);

          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.2, now + 0.06); 
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

          osc.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(mainGain);

          osc.start(now);
          osc.stop(now + 0.38);
        });
      }
    }
  } catch (err) {
    // Fail silently so that autoplay policy or older browsers don't disrupt app flows
  }
}

"use client";

import { useEffect, useRef } from "react";

const VOICE_TEXT = `???????! ?????? ?? Excel Service Hub ??? ? ???? ?? ???? ?? ?? ?? ???? ?? ????????? Here, we make data work smarter for you! Our team specializes in Data Entry, Data Validation, and Bulk Data Import into Google Sheets ? fast, secure, and accurate. From small businesses to large enterprises ? Excel Service Hub ensures your data stays clean, organized, and ready to use. Because here, Your Data is Our Responsibility! If you?re looking for reliable data management ? choose Excel Service Hub and experience professional excellence today.`;

export default function AudioController({ started }: { started: boolean }) {
  const hasStartedRef = useRef(false);
  const synthRef = useRef<any | null>(null);
  const chordLoopRef = useRef<any | null>(null);
  const toneRef = useRef<any | null>(null);

  useEffect(() => {
    if (!started || hasStartedRef.current) return;
    hasStartedRef.current = true;

    // Start Tone context on gesture
    (async () => {
      const Tone = await import("tone");
      toneRef.current = Tone;
      await Tone.start();

      const reverb = new Tone.Reverb(2.6).toDestination();
      const filter = new Tone.Filter(1200, "lowpass").connect(reverb);
      const chorus = new Tone.Chorus(1.6, 2.5, 0.3).connect(filter).start();

      const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: { attack: 1.2, decay: 1.2, sustain: 0.6, release: 2.4 }
      }).connect(chorus);
      synthRef.current = synth;

      const chords: string[][] = [
        ["C4", "E4", "G4", "B4"],
        ["A3", "C4", "E4", "G4"],
        ["F3", "A3", "C4", "E4"],
        ["G3", "B3", "D4", "F4"]
      ];

      let idx = 0;
      chordLoopRef.current = new Tone.Loop((time: number) => {
        const c = chords[idx % chords.length];
        c.forEach(n => synth.triggerAttackRelease(n, 3.6, time, 0.2));
        idx++;
      }, 4).start(0);

      Tone.Transport.bpm.value = 84;
      Tone.Transport.start();
    })();

    // Speak voice over
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(VOICE_TEXT);
      utter.lang = "hi-IN"; // allow Hindi+English mix
      utter.rate = 1.0;
      utter.pitch = 1.0;
      utter.volume = 1.0;
      window.speechSynthesis.speak(utter);
    }

    return () => {
      try {
        toneRef.current?.Transport.stop();
        chordLoopRef.current?.dispose();
        synthRef.current?.dispose();
      } catch {}
    };
  }, [started]);

  return null;
}

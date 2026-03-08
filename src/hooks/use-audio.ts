"use client";

import { useCallback, useRef } from "react";

/**
 * A hook that provides a `playBeep` function using the Web Audio API.
 *
 * Generates a short sine-wave tone programmatically — no audio files needed.
 * The beep plays a 440 Hz tone for 200ms with a quick fade-out to avoid clicks.
 */
export function useAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;

    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioContext();
      } catch {
        return null;
      }
    }

    return audioContextRef.current;
  }, []);

  const playBeep = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Resume context if it's suspended (browsers require user interaction)
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);

    // Start at moderate volume, then fade out to avoid a click
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }, [getAudioContext]);

  return { playBeep };
}

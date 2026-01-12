import { useRef, useEffect, useCallback } from 'react';

type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

interface AudioSynthOptions {
    volume?: number;
    oscillatorType?: OscillatorType;
    minFreq?: number;
    maxFreq?: number;
}

export function useAudioSynth({
    volume = 0.1,
    oscillatorType = 'triangle',
    minFreq = 120,
    maxFreq = 1200
}: AudioSynthOptions = {}) {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);

    // Initialize Audio Context on first interaction (browser policy)
    const initAudio = useCallback(() => {
        if (!audioCtxRef.current) {
            const Ctx = (window.AudioContext || (window as any).webkitAudioContext);
            if (Ctx) {
                audioCtxRef.current = new Ctx();
                masterGainRef.current = audioCtxRef.current.createGain();
                masterGainRef.current.gain.value = volume;
                masterGainRef.current.connect(audioCtxRef.current.destination);
            }
        }
        if (audioCtxRef.current?.state === 'suspended') {
            audioCtxRef.current.resume();
        }
    }, [volume]);

    const playTone = useCallback((value: number, maxVal: number) => {
        if (!audioCtxRef.current || !masterGainRef.current) return;

        // Map value to frequency
        // Linear mapping: normalized * range + min
        const normalized = value / maxVal;
        const frequency = normalized * (maxFreq - minFreq) + minFreq;

        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        osc.type = oscillatorType;
        osc.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);

        // ADSR Envelope to avoid clicking
        const now = audioCtxRef.current.currentTime;
        const duration = 0.1; // Short blip

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.01); // Attack
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration); // Decay

        osc.connect(gain);
        gain.connect(masterGainRef.current);

        osc.start(now);
        osc.stop(now + duration);

        // Automated cleanup
        setTimeout(() => {
            gain.disconnect();
            osc.disconnect();
        }, duration * 1000 + 100);

    }, [maxFreq, minFreq, oscillatorType, volume]);

    return { initAudio, playTone };
}

import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../utils/soundEffects';
import { Play, Pause, RotateCcw, Disc, Volume2, Sparkles } from 'lucide-react';

export const AudioStudioApp: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(120);
  const [currentStep, setCurrentStep] = useState<number>(0);

  // 4 Tracks x 16 steps
  const [grid, setGrid] = useState<boolean[][]>([
    // Kick
    [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    // Snare
    [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
    // Hi-Hat
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    // Synth Lead
    [true, false, true, false, false, true, false, false, true, false, false, true, false, false, true, false],
  ]);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playKick = (ctx: AudioContext, time: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.35);
    gain.gain.setValueAtTime(0.8, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.35);
  };

  const playSnare = (ctx: AudioContext, time: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, time);
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.2);
  };

  const playHiHat = (ctx: AudioContext, time: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(8000, time);
    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.05);
  };

  const playSynth = (ctx: AudioContext, time: number, stepIdx: number) => {
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    const freq = notes[stepIdx % notes.length];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.25);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = (60 / bpm / 4) * 1000;

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        const next = (prev + 1) % 16;
        const ctx = getAudioContext();
        if (ctx) {
          const t = ctx.currentTime;
          if (grid[0][next]) playKick(ctx, t);
          if (grid[1][next]) playSnare(ctx, t);
          if (grid[2][next]) playHiHat(ctx, t);
          if (grid[3][next]) playSynth(ctx, t, next);
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, bpm, grid]);

  const toggleStep = (trackIdx: number, stepIdx: number) => {
    sounds.playClick();
    setGrid(prev => {
      const copy = prev.map(r => [...r]);
      copy[trackIdx][stepIdx] = !copy[trackIdx][stepIdx];
      return copy;
    });
  };

  const trackNames = ['Kick (Bombo)', 'Snare (Caja)', 'Hi-Hat (Plato)', 'Synth Lead'];

  return (
    <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col overflow-hidden select-none">
      {/* Top Header */}
      <div className="p-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Disc className="w-5 h-5 text-pink-400" />
          <span className="text-xs font-bold text-white">llucAudio Beat Maker</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono">BPM: {bpm}</span>
            <input
              type="range"
              min={80}
              max={160}
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-20 accent-pink-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setIsPlaying(prev => !prev);
            }}
            className="px-4 py-1.5 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
          </button>
        </div>
      </div>

      {/* Sequencer Grid */}
      <div className="flex-1 p-4 overflow-x-auto space-y-4">
        {grid.map((track, trackIdx) => (
          <div key={trackIdx} className="space-y-1.5">
            <div className="text-xs font-bold text-slate-300 flex items-center justify-between px-1">
              <span>{trackNames[trackIdx]}</span>
            </div>

            <div className="grid grid-cols-16 gap-1.5">
              {track.map((active, stepIdx) => {
                const isCurrent = currentStep === stepIdx && isPlaying;
                return (
                  <button
                    key={stepIdx}
                    type="button"
                    onClick={() => toggleStep(trackIdx, stepIdx)}
                    className={`h-11 rounded-xl transition-all border ${
                      active
                        ? 'bg-pink-500 border-pink-400 shadow-md shadow-pink-500/20'
                        : 'bg-slate-800/80 border-slate-700 hover:bg-slate-700/80'
                    } ${isCurrent ? 'ring-2 ring-white scale-105' : ''}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

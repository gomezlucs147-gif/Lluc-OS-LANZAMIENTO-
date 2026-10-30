import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../utils/soundEffects';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Music, 
  Disc, 
  Sparkles,
  Radio
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  bpm: number;
  scale: number[];
  baseFreq: number;
}

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Midnight Drive in Cyber City',
    artist: 'lluc Synthwave Labs',
    duration: '3:45',
    bpm: 110,
    scale: [220, 261.63, 293.66, 329.63, 392, 440],
    baseFreq: 110,
  },
  {
    id: '2',
    title: 'Neon Rain on Glass',
    artist: 'Lo-Fi Chill System',
    duration: '4:12',
    bpm: 85,
    scale: [174.61, 220, 261.63, 329.63, 392],
    baseFreq: 87.3,
  },
  {
    id: '3',
    title: 'Starlight Orbit Cruise',
    artist: 'Cosmic Soundscapes',
    duration: '3:20',
    bpm: 120,
    scale: [293.66, 349.23, 440, 523.25, 587.33],
    baseFreq: 146.83,
  },
];

export const PlayerApp: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(75);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Audio nodes ref
  const audioRef = useRef<{
    ctx: AudioContext | null;
    timer: any;
    step: number;
    gainNode: GainNode | null;
  }>({
    ctx: null,
    timer: null,
    step: 0,
    gainNode: null,
  });

  const currentTrack = TRACKS[currentTrackIndex];

  const stopMusic = () => {
    if (audioRef.current.timer) {
      clearInterval(audioRef.current.timer);
      audioRef.current.timer = null;
    }
  };

  const startMusic = (track: Track) => {
    stopMusic();
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioRef.current.ctx) {
      audioRef.current.ctx = new AudioCtx();
    }
    const ctx = audioRef.current.ctx;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const intervalMs = (60 / track.bpm) * 500; // 8th notes

    audioRef.current.timer = setInterval(() => {
      if (!ctx || ctx.state === 'suspended') return;
      audioRef.current.step++;

      // Synth note
      const noteFreq = track.scale[Math.floor(Math.random() * track.scale.length)];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = audioRef.current.step % 4 === 0 ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);

      const vol = (volume / 100) * 0.08;
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);

      // Bass pulse every 2 steps
      if (audioRef.current.step % 2 === 0) {
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(track.baseFreq, ctx.currentTime);
        bassGain.gain.setValueAtTime(vol * 1.2, ctx.currentTime);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
        bassOsc.connect(bassGain);
        bassGain.connect(ctx.destination);
        bassOsc.start();
        bassOsc.stop(ctx.currentTime + 0.5);
      }
    }, intervalMs);
  };

  const togglePlay = () => {
    sounds.playClick();
    if (isPlaying) {
      stopMusic();
      setIsPlaying(false);
    } else {
      startMusic(currentTrack);
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    sounds.playClick();
    const nextIdx = (currentTrackIndex + 1) % TRACKS.length;
    setCurrentTrackIndex(nextIdx);
    if (isPlaying) {
      startMusic(TRACKS[nextIdx]);
    }
  };

  const prevTrack = () => {
    sounds.playClick();
    const prevIdx = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    setCurrentTrackIndex(prevIdx);
    if (isPlaying) {
      startMusic(TRACKS[prevIdx]);
    }
  };

  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, []);

  // Visualizer Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const bars = 24;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / bars - 2;

      for (let i = 0; i < bars; i++) {
        let height = 4;
        if (isPlaying) {
          height = Math.sin(Date.now() * 0.006 + i * 0.4) * 20 + 26;
        }

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#ec4899');

        ctx.fillStyle = isPlaying ? gradient : '#334155';
        ctx.fillRect(i * (barWidth + 2), canvas.height - height, barWidth, height);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col overflow-hidden select-none">
      {/* Vinyl record spinning animation & Art */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900">
        <div className={`relative w-44 h-44 rounded-full border-4 border-slate-700 bg-slate-950 flex items-center justify-center shadow-2xl transition-transform duration-1000 ${
          isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''
        }`}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-blue-500 flex items-center justify-center text-white shadow-inner">
            <Disc className="w-8 h-8" />
          </div>
          {/* Vinyl grooves */}
          <div className="absolute inset-4 rounded-full border border-slate-800/80 pointer-events-none" />
          <div className="absolute inset-8 rounded-full border border-slate-800/80 pointer-events-none" />
        </div>

        {/* Track info */}
        <div className="text-center mt-6 z-10">
          <h2 className="text-base font-bold text-white mb-0.5">{currentTrack.title}</h2>
          <p className="text-xs text-slate-400">{currentTrack.artist}</p>
        </div>

        {/* Visualizer bars */}
        <div className="w-full max-w-xs h-16 mt-4">
          <canvas ref={canvasRef} width={280} height={50} className="w-full h-full" />
        </div>
      </div>

      {/* Player Controls Bar */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prevTrack}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-600/30 transition-transform active:scale-95"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={nextTrack}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          {volume === 0 ? (
            <VolumeX className="w-4 h-4 text-slate-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-blue-400" />
          )}
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

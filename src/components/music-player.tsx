'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { RelaxMusicPlayer } from '@/lib/audio-engine';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.12);
  const playerRef = useRef<RelaxMusicPlayer | null>(null);
  const [bars, setBars] = useState<number[]>(Array.from({ length: 24 }, () => 0.08));
  const animRef = useRef<number>(0);

  useEffect(() => {
    playerRef.current = new RelaxMusicPlayer();
    return () => { playerRef.current?.stop(); };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setBars(prev => prev.map((_, i) => {
          const w1 = Math.sin(Date.now() / 800 + i * 0.4) * 0.2;
          const w2 = Math.sin(Date.now() / 1200 + i * 0.7) * 0.15;
          return Math.max(0.06, Math.min(1, 0.3 + w1 + w2 + Math.random() * 0.15));
        }));
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    } else {
      setBars(Array.from({ length: 24 }, () => 0.06));
    }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    if (isPlaying) { playerRef.current.stop(); setIsPlaying(false); }
    else { playerRef.current.start(); playerRef.current.setVolume(volume); setIsPlaying(true); }
  }, [isPlaying, volume]);

  const handleVolumeChange = useCallback((v: number) => {
    setVolume(v);
    playerRef.current?.setVolume(v);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="text-center">
        <h2 className="text-xl font-light tracking-wide" style={{ color: 'oklch(0.30 0.06 240)' }}>
          放松音乐
        </h2>
        <p className="text-xs mt-1" style={{ color: 'oklch(0.55 0.04 240)' }}>
          五声音阶随机旋律，每一刻都独一无二
        </p>
      </div>

      <div
        className="relative w-full max-w-sm p-6 rounded-3xl overflow-hidden"
        style={{
          background: isPlaying
            ? 'linear-gradient(145deg, oklch(0.95 0.025 240), oklch(0.93 0.03 230))'
            : 'linear-gradient(145deg, oklch(0.98 0.008 240), oklch(0.97 0.01 240))',
          boxShadow: isPlaying
            ? '0 8px 40px oklch(0.72 0.06 240 / 0.18), inset 0 1px 0 oklch(1 0 0 / 0.3)'
            : '0 2px 10px oklch(0.90 0 0 / 0.15)',
          border: '1px solid oklch(0.95 0.01 240 / 0.4)',
          transition: 'all 0.5s ease',
        }}
      >
        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(circle at 50% 30%, oklch(0.88 0.05 240 / 0.12), transparent 60%)',
          }} />
        )}

        {/* 可视化 */}
        <div className="relative flex items-end justify-center gap-[3px] h-24 mb-5">
          {bars.map((h, i) => (
            <div key={i} className="w-1.5 rounded-full" style={{
              height: `${h * 100}%`,
              background: isPlaying
                ? 'linear-gradient(to top, oklch(0.68 0.12 240), oklch(0.75 0.08 220))'
                : 'oklch(0.90 0.015 240)',
              transitionDuration: isPlaying ? '80ms' : '500ms',
              opacity: isPlaying ? 0.85 : 0.25,
            }} />
          ))}
        </div>

        {/* 播放按钮 */}
        <div className="relative flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: isPlaying
                ? 'linear-gradient(145deg, oklch(0.62 0.12 240), oklch(0.58 0.10 230))'
                : 'linear-gradient(145deg, oklch(0.72 0.12 240), oklch(0.68 0.10 230))',
              boxShadow: isPlaying
                ? '0 6px 25px oklch(0.62 0.12 240 / 0.35), inset 0 1px 0 oklch(0.80 0.06 240 / 0.3)'
                : '0 4px 15px oklch(0.68 0.10 240 / 0.25), inset 0 1px 0 oklch(0.85 0.06 240 / 0.3)',
            }}
          >
            {isPlaying ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="4" width="4" height="16" rx="1.5" />
                <rect x="14" y="4" width="4" height="16" rx="1.5" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* 音量 */}
        <div className="relative flex items-center gap-3 mt-5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.03 240)" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
          </svg>
          <input
            type="range" min="0" max="0.2" step="0.005" value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, oklch(0.68 0.10 240) ${(volume / 0.2) * 100}%, oklch(0.93 0.01 240) ${(volume / 0.2) * 100}%)` }}
          />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.03 240)" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        </div>
      </div>

      <p className="text-[11px] text-center max-w-xs" style={{ color: 'oklch(0.60 0.04 240)' }}>
        {isPlaying ? '放松身心，让旋律自然流淌...' : '点击播放，聆听由五声音阶生成的放松旋律'}
      </p>
    </div>
  );
}

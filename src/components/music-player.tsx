'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { RelaxMusicPlayer } from '@/lib/audio-engine';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.12);
  const playerRef = useRef<RelaxMusicPlayer | null>(null);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(
    Array.from({ length: 24 }, () => 0.1)
  );
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    playerRef.current = new RelaxMusicPlayer();
    return () => {
      playerRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setVisualizerBars(prev =>
          prev.map((_, i) => {
            const wave1 = Math.sin(Date.now() / 800 + i * 0.4) * 0.2;
            const wave2 = Math.sin(Date.now() / 1200 + i * 0.7) * 0.15;
            const random = Math.random() * 0.2;
            return Math.max(0.08, Math.min(1, 0.3 + wave1 + wave2 + random));
          })
        );
        animFrameRef.current = requestAnimationFrame(animate);
      };
      animFrameRef.current = requestAnimationFrame(animate);
    } else {
      setVisualizerBars(Array.from({ length: 24 }, () => 0.08));
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.stop();
      setIsPlaying(false);
    } else {
      playerRef.current.start();
      playerRef.current.setVolume(volume);
      setIsPlaying(true);
    }
  }, [isPlaying, volume]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    playerRef.current?.setVolume(newVolume);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="text-center">
        <h2 className="text-xl font-light tracking-wide" style={{ color: 'oklch(0.30 0.04 290)' }}>
          放松音乐
        </h2>
        <p className="text-xs mt-1" style={{ color: 'oklch(0.55 0.03 290)' }}>
          五声音阶随机旋律，每一刻都独一无二
        </p>
      </div>

      {/* 播放器主体 */}
      <div
        className="relative w-full max-w-sm p-6 rounded-3xl overflow-hidden"
        style={{
          background: isPlaying
            ? 'linear-gradient(145deg, oklch(0.94 0.03 290), oklch(0.92 0.04 310))'
            : 'linear-gradient(145deg, oklch(0.98 0.005 290), oklch(0.96 0.008 290))',
          boxShadow: isPlaying
            ? '0 8px 40px oklch(0.70 0.08 290 / 0.2), inset 0 1px 0 oklch(1 0 0 / 0.4)'
            : '0 2px 10px oklch(0.88 0 0 / 0.2)',
          border: '1px solid oklch(0.94 0.01 290 / 0.5)',
          transition: 'all 0.5s ease',
        }}
      >
        {/* 背景光晕 */}
        {isPlaying && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 30%, oklch(0.85 0.06 290 / 0.15), transparent 60%)',
            }}
          />
        )}

        {/* 音频可视化 */}
        <div className="relative flex items-end justify-center gap-[3px] h-24 mb-5">
          {visualizerBars.map((height, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full"
              style={{
                height: `${height * 100}%`,
                background: isPlaying
                  ? `linear-gradient(to top, oklch(0.68 0.12 290), oklch(0.75 0.10 320))`
                  : 'oklch(0.88 0.02 290)',
                transitionDuration: isPlaying ? '80ms' : '500ms',
                opacity: isPlaying ? 0.85 : 0.3,
              }}
            />
          ))}
        </div>

        {/* 播放控制 */}
        <div className="relative flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: isPlaying
                ? 'linear-gradient(145deg, oklch(0.62 0.12 290), oklch(0.58 0.10 320))'
                : 'linear-gradient(145deg, oklch(0.72 0.12 290), oklch(0.68 0.10 320))',
              boxShadow: isPlaying
                ? '0 6px 25px oklch(0.62 0.12 290 / 0.4), inset 0 1px 0 oklch(0.80 0.06 290 / 0.3)'
                : '0 4px 15px oklch(0.68 0.10 290 / 0.3), inset 0 1px 0 oklch(0.85 0.06 290 / 0.3)',
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.02 280)" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
          </svg>
          <input
            type="range"
            min="0"
            max="0.2"
            step="0.005"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, oklch(0.68 0.10 290) ${(volume / 0.2) * 100}%, oklch(0.92 0.01 290) ${(volume / 0.2) * 100}%)`,
            }}
          />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.02 280)" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        </div>
      </div>

      {/* 提示 */}
      <p className="text-[11px] text-center max-w-xs" style={{ color: 'oklch(0.60 0.03 290)' }}>
        {isPlaying
          ? '放松身心，让旋律自然流淌...'
          : '点击播放，聆听由五声音阶生成的放松旋律'}
      </p>
    </div>
  );
}

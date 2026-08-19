'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { RelaxMusicPlayer } from '@/lib/audio-engine';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.12);
  const playerRef = useRef<RelaxMusicPlayer | null>(null);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(
    Array.from({ length: 20 }, () => 0.3)
  );
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    playerRef.current = new RelaxMusicPlayer();
    return () => {
      playerRef.current?.stop();
    };
  }, []);

  // 可视化动画
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setVisualizerBars(prev =>
          prev.map((_, i) => {
            const base = 0.2 + Math.sin(Date.now() / 1000 + i * 0.5) * 0.15;
            const random = Math.random() * 0.3;
            return Math.min(1, base + random);
          })
        );
        animFrameRef.current = requestAnimationFrame(animate);
      };
      animFrameRef.current = requestAnimationFrame(animate);
    } else {
      setVisualizerBars(Array.from({ length: 20 }, () => 0.1));
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
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="text-center">
        <h2 className="text-2xl font-light tracking-wide text-[oklch(0.35_0.02_280)]">
          放松音乐
        </h2>
        <p className="text-sm text-[oklch(0.55_0.02_280)] mt-1">
          五声音阶随机旋律，每一刻都独一无二
        </p>
      </div>

      {/* 播放器主体 */}
      <div
        className="relative w-full max-w-sm p-6 rounded-3xl"
        style={{
          background: isPlaying
            ? 'linear-gradient(135deg, oklch(0.92_0.04_290), oklch(0.90_0.03_320))'
            : 'oklch(0.96_0.01_290)',
          boxShadow: isPlaying
            ? '0 8px 40px oklch(0.70_0.08_290 / 0.2)'
            : '0 2px 10px oklch(0.85_0_0 / 0.2)',
          transition: 'all 0.5s ease',
        }}
      >
        {/* 音频可视化 */}
        <div className="flex items-end justify-center gap-1 h-20 mb-4">
          {visualizerBars.map((height, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full transition-all"
              style={{
                height: `${height * 100}%`,
                background: isPlaying
                  ? `linear-gradient(to top, oklch(0.70_0.1_290), oklch(0.78_0.08_320))`
                  : 'oklch(0.85_0.02_290)',
                transitionDuration: isPlaying ? '100ms' : '500ms',
                opacity: isPlaying ? 0.8 : 0.3,
              }}
            />
          ))}
        </div>

        {/* 播放控制 */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: isPlaying
                ? 'linear-gradient(135deg, oklch(0.65_0.1_290), oklch(0.60_0.08_320))'
                : 'linear-gradient(135deg, oklch(0.75_0.1_290), oklch(0.70_0.08_320))',
              boxShadow: isPlaying
                ? '0 4px 20px oklch(0.65_0.1_290 / 0.4)'
                : '0 2px 10px oklch(0.70_0.08_290 / 0.3)',
            }}
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* 音量 */}
        <div className="flex items-center gap-3 mt-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55_0.02_280)" strokeWidth="2">
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
              background: `linear-gradient(to right, oklch(0.70_0.08_290) ${(volume / 0.2) * 100}%, oklch(0.90_0.01_290) ${(volume / 0.2) * 100}%)`,
            }}
          />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55_0.02_280)" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        </div>
      </div>

      {/* 提示 */}
      <p className="text-xs text-[oklch(0.60_0.02_280)] text-center max-w-xs">
        {isPlaying
          ? '放松身心，让旋律自然流淌...'
          : '点击播放，聆听由五声音阶生成的放松旋律'}
      </p>
    </div>
  );
}

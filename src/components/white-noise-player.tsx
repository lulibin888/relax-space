'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { NoiseGenerator, type NoiseType } from '@/lib/audio-engine';

const NOISE_TYPES: { type: NoiseType; label: string; emoji: string; color: string }[] = [
  { type: 'white', label: '白噪音', emoji: '🌫', color: 'oklch(0.72 0.03 280)' },
  { type: 'pink', label: '粉噪音', emoji: '🌸', color: 'oklch(0.72 0.08 340)' },
  { type: 'brown', label: '棕噪音', emoji: '🍂', color: 'oklch(0.62 0.08 60)' },
  { type: 'rain', label: '雨声', emoji: '🌧', color: 'oklch(0.62 0.10 240)' },
  { type: 'ocean', label: '海浪', emoji: '🌊', color: 'oklch(0.62 0.10 200)' },
  { type: 'wind', label: '风声', emoji: '🍃', color: 'oklch(0.68 0.08 160)' },
];

export function WhiteNoisePlayer() {
  const [activeType, setActiveType] = useState<NoiseType | null>(null);
  const [volume, setVolume] = useState(0.3);
  const generatorRef = useRef<NoiseGenerator | null>(null);

  useEffect(() => {
    generatorRef.current = new NoiseGenerator();
    return () => {
      generatorRef.current?.stop();
    };
  }, []);

  const toggleNoise = useCallback((type: NoiseType) => {
    if (!generatorRef.current) return;

    if (activeType === type) {
      generatorRef.current.stop();
      setActiveType(null);
    } else {
      generatorRef.current.start(type);
      generatorRef.current.setVolume(volume);
      setActiveType(type);
    }
  }, [activeType, volume]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    generatorRef.current?.setVolume(newVolume);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="text-center">
        <h2 className="text-xl font-light tracking-wide" style={{ color: 'oklch(0.30 0.04 290)' }}>
          环境音
        </h2>
        <p className="text-xs mt-1" style={{ color: 'oklch(0.55 0.03 290)' }}>
          选择一种声音，让思绪沉静下来
        </p>
      </div>

      {/* 声音选择网格 */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
        {NOISE_TYPES.map(({ type, label, emoji, color }) => {
          const isActive = activeType === type;
          return (
            <button
              key={type}
              onClick={() => toggleNoise(type)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 cursor-pointer"
              style={{
                background: isActive
                  ? `linear-gradient(145deg, ${color} / 0.15, ${color} / 0.08)`
                  : 'oklch(0.98 0.005 290)',
                boxShadow: isActive
                  ? `0 4px 16px ${color} / 0.2, inset 0 1px 0 oklch(1 0 0 / 0.4)`
                  : '0 1px 3px oklch(0.88 0 0 / 0.2)',
                transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                border: isActive
                  ? `1px solid ${color} / 0.3`
                  : '1px solid oklch(0.94 0.01 290 / 0.5)',
              }}
            >
              <span
                className="text-2xl transition-transform duration-300"
                style={{ transform: isActive ? 'scale(1.15)' : 'scale(1)' }}
              >
                {emoji}
              </span>
              <span
                className="text-[11px] font-medium"
                style={{ color: isActive ? 'oklch(0.35 0.03 290)' : 'oklch(0.55 0.02 280)' }}
              >
                {label}
              </span>
              {/* 播放状态指示 */}
              {isActive && (
                <div className="flex gap-0.5 items-end h-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-0.5 rounded-full"
                      style={{
                        background: color,
                        animation: `soundBar 0.6s ease-in-out ${i * 0.12}s infinite alternate`,
                        height: '4px',
                      }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 音量控制 */}
      <div className="w-full max-w-xs flex items-center gap-3 px-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.02 280)" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, oklch(0.68 0.10 290) ${volume * 100}%, oklch(0.92 0.01 290) ${volume * 100}%)`,
          }}
        />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.02 280)" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
        <span className="text-[11px] w-7 text-right" style={{ color: 'oklch(0.55 0.02 280)' }}>
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
}

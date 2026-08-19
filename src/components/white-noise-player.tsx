'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { NoiseGenerator, type NoiseType } from '@/lib/audio-engine';

const NOISE_TYPES: { type: NoiseType; label: string; icon: string; color: string }[] = [
  { type: 'white', label: '白噪音', icon: '◌', color: 'oklch(0.75_0.02_280)' },
  { type: 'pink', label: '粉噪音', icon: '◔', color: 'oklch(0.75_0.06_340)' },
  { type: 'brown', label: '棕噪音', icon: '◑', color: 'oklch(0.65_0.06_60)' },
  { type: 'rain', label: '雨声', icon: '⛆', color: 'oklch(0.65_0.08_240)' },
  { type: 'ocean', label: '海浪', icon: '〰', color: 'oklch(0.65_0.08_200)' },
  { type: 'wind', label: '风声', icon: '☴', color: 'oklch(0.70_0.06_160)' },
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
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="text-center">
        <h2 className="text-2xl font-light tracking-wide text-[oklch(0.35_0.02_280)]">
          环境音
        </h2>
        <p className="text-sm text-[oklch(0.55_0.02_280)] mt-1">
          选择一种声音，让思绪沉静下来
        </p>
      </div>

      {/* 声音选择网格 */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
        {NOISE_TYPES.map(({ type, label, icon, color }) => {
          const isActive = activeType === type;
          return (
            <button
              key={type}
              onClick={() => toggleNoise(type)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 cursor-pointer"
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${color} / 0.2, ${color} / 0.1)`
                  : 'oklch(0.97_0.01_290)',
                boxShadow: isActive
                  ? `0 4px 20px ${color} / 0.2, inset 0 1px 0 oklch(1_0_0 / 0.3)`
                  : '0 1px 3px oklch(0.85_0_0 / 0.3)',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <span
                className="text-2xl"
                style={{ color: isActive ? color : 'oklch(0.65_0.02_280)' }}
              >
                {icon}
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: isActive ? 'oklch(0.35_0.02_280)' : 'oklch(0.55_0.02_280)' }}
              >
                {label}
              </span>
              {/* 播放状态指示 */}
              {isActive && (
                <div className="flex gap-0.5">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-0.5 rounded-full"
                      style={{
                        background: color,
                        animation: `soundBar 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
                        height: '8px',
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
      <div className="w-full max-w-xs flex items-center gap-3">
        <span className="text-xs text-[oklch(0.55_0.02_280)]">音量</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, oklch(0.70_0.08_290) ${volume * 100}%, oklch(0.90_0.01_290) ${volume * 100}%)`,
          }}
        />
        <span className="text-xs text-[oklch(0.55_0.02_280)] w-8 text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
}

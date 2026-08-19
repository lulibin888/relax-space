'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { playSqueezeSound } from '@/lib/audio-engine';

export function StressBall() {
  const [isSqueezing, setIsSqueezing] = useState(false);
  const [squeezeCount, setSqueezeCount] = useState(0);
  const [colorPhase, setColorPhase] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 柔和渐变色彩
  const palettes = [
    { main: 'oklch(0.72 0.12 240)', light: 'oklch(0.90 0.06 240)', dark: 'oklch(0.52 0.12 240)', glow: 'oklch(0.72 0.12 240 / 0.35)' },
    { main: 'oklch(0.72 0.10 200)', light: 'oklch(0.90 0.05 200)', dark: 'oklch(0.52 0.10 200)', glow: 'oklch(0.72 0.10 200 / 0.35)' },
    { main: 'oklch(0.74 0.10 280)', light: 'oklch(0.90 0.05 280)', dark: 'oklch(0.54 0.10 280)', glow: 'oklch(0.74 0.10 280 / 0.35)' },
    { main: 'oklch(0.74 0.10 340)', light: 'oklch(0.90 0.05 340)', dark: 'oklch(0.54 0.10 340)', glow: 'oklch(0.74 0.10 340 / 0.35)' },
    { main: 'oklch(0.74 0.10 160)', light: 'oklch(0.90 0.05 160)', dark: 'oklch(0.54 0.10 160)', glow: 'oklch(0.74 0.10 160 / 0.35)' },
  ];

  const c = palettes[colorPhase % palettes.length];

  // Pre-compute random particle values to avoid impure function calls during render
  const particleData = useMemo(() =>
    Array.from({ length: 10 }, (_, i) => ({
      angle: (i / 10) * Math.PI * 2,
      dist: 65 + (i * 7 + 13) % 25,
      size: 4 + (i * 3 + 5) % 4,
    })),
  []);

  const handleSqueezeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsSqueezing(true);
    playSqueezeSound();
    setSqueezeCount(prev => prev + 1);
    setColorPhase(prev => prev + 1);
  }, []);

  const handleSqueezeEnd = useCallback(() => {
    setIsSqueezing(false);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="text-center">
        <h2 className="text-xl font-light tracking-wide" style={{ color: 'oklch(0.30 0.06 240)' }}>
          解压球
        </h2>
        <p className="text-xs mt-1" style={{ color: 'oklch(0.55 0.04 240)' }}>
          按住挤压，感受变形的乐趣
        </p>
      </div>

      {/* 解压球区域 */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center select-none cursor-pointer"
        style={{ width: '240px', height: '220px' }}
        onMouseDown={handleSqueezeStart}
        onMouseUp={handleSqueezeEnd}
        onMouseLeave={handleSqueezeEnd}
        onTouchStart={handleSqueezeStart}
        onTouchEnd={handleSqueezeEnd}
      >
        {/* 地面阴影 */}
        <div
          className="absolute rounded-full"
          style={{
            bottom: '10px',
            width: isSqueezing ? '180px' : '130px',
            height: isSqueezing ? '14px' : '18px',
            background: `${c.dark} / ${isSqueezing ? '0.15' : '0.2'}`,
            filter: 'blur(12px)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />

        {/* 主球体 - 捏变形效果 */}
        <div
          className="relative"
          style={{
            width: '160px',
            height: '160px',
            borderRadius: isSqueezing ? '45% 55% 52% 48% / 52% 48% 55% 45%' : '50%',
            transform: isSqueezing
              ? 'scaleX(1.25) scaleY(0.75) rotate(-2deg)'
              : 'scaleX(1) scaleY(1) rotate(0deg)',
            transition: isSqueezing
              ? 'all 0.15s cubic-bezier(0.4, 0, 0.8, 1)'
              : 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            background: `radial-gradient(circle at 38% 32%, ${c.light}, ${c.main} 45%, ${c.dark} 100%)`,
            boxShadow: isSqueezing
              ? `inset 0 10px 30px ${c.dark} / 0.45, 0 2px 8px ${c.glow}`
              : `0 14px 40px ${c.glow}, inset 0 -8px 20px ${c.dark} / 0.2, inset 0 4px 10px oklch(0.99 0 0 / 0.15)`,
          }}
        >
          {/* 主高光 */}
          <div
            className="absolute rounded-full"
            style={{
              top: '18px',
              left: '28px',
              width: '50px',
              height: '32px',
              background: 'radial-gradient(ellipse, oklch(0.98 0.005 240 / 0.65), transparent)',
              filter: 'blur(4px)',
              transform: isSqueezing ? 'scaleX(1.3) scaleY(0.6) translateY(8px)' : 'scale(1)',
              transition: 'all 0.3s',
            }}
          />
          {/* 小高光 */}
          <div
            className="absolute rounded-full"
            style={{
              top: '32px',
              left: '42px',
              width: '14px',
              height: '10px',
              background: 'oklch(0.99 0.003 240 / 0.7)',
              filter: 'blur(1px)',
              transform: isSqueezing ? 'translateY(6px) scale(0.7)' : 'scale(1)',
              transition: 'all 0.3s',
            }}
          />
          {/* 底部反光 */}
          <div
            className="absolute rounded-full"
            style={{
              bottom: '20px',
              right: '25px',
              width: '30px',
              height: '14px',
              background: `${c.light} / 0.3`,
              filter: 'blur(4px)',
            }}
          />

          {/* 挤压时的皱纹效果 */}
          {isSqueezing && (
            <>
              <div
                className="absolute rounded-full"
                style={{
                  top: '40%',
                  left: '10%',
                  width: '25%',
                  height: '2px',
                  background: `${c.dark} / 0.2`,
                  borderRadius: '50%',
                  transform: 'rotate(-15deg)',
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  top: '50%',
                  right: '12%',
                  width: '20%',
                  height: '2px',
                  background: `${c.dark} / 0.15`,
                  borderRadius: '50%',
                  transform: 'rotate(10deg)',
                }}
              />
            </>
          )}
        </div>

        {/* 挤压时的飞溅粒子 */}
        {isSqueezing && (
          <div className="absolute inset-0 pointer-events-none">
            {particleData.map((p, i) => (
              <div
                key={`${squeezeCount}-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  background: c.main,
                  left: '50%',
                  top: '50%',
                  marginLeft: '-3px',
                  marginTop: '-3px',
                  opacity: 0.7,
                  animation: `particleFly 0.5s ease-out forwards`,
                  '--px': `${Math.cos(p.angle) * p.dist}px`,
                  '--py': `${Math.sin(p.angle) * p.dist}px`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}
      </div>

      {/* 挤压计数 */}
      <div className="text-center">
        <p className="text-3xl font-light" style={{ color: c.main }}>
          {squeezeCount}
        </p>
        <p className="text-[11px] mt-1" style={{ color: 'oklch(0.55 0.04 240)' }}>
          次挤压
        </p>
      </div>

      {squeezeCount > 0 && (
        <button
          onClick={() => setSqueezeCount(0)}
          className="text-xs transition-colors cursor-pointer"
          style={{ color: 'oklch(0.60 0.06 240)' }}
        >
          重置计数
        </button>
      )}
    </div>
  );
}

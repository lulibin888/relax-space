'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { playSqueezeSound } from '@/lib/audio-engine';

export function StressBall() {
  const [isSqueezing, setIsSqueezing] = useState(false);
  const [squeezeCount, setSqueezeCount] = useState(0);
  const [ballColor, setBallColor] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = [
    { main: 'oklch(0.72 0.14 290)', light: 'oklch(0.88 0.08 290)', dark: 'oklch(0.50 0.12 290)' },
    { main: 'oklch(0.70 0.16 340)', light: 'oklch(0.88 0.08 340)', dark: 'oklch(0.50 0.14 340)' },
    { main: 'oklch(0.72 0.14 160)', light: 'oklch(0.88 0.06 160)', dark: 'oklch(0.50 0.12 160)' },
    { main: 'oklch(0.78 0.12 80)', light: 'oklch(0.90 0.06 80)', dark: 'oklch(0.55 0.10 80)' },
    { main: 'oklch(0.70 0.14 240)', light: 'oklch(0.88 0.06 240)', dark: 'oklch(0.50 0.12 240)' },
  ];

  const currentColor = colors[ballColor];

  const handleSqueezeStart = useCallback(() => {
    setIsSqueezing(true);
    playSqueezeSound();
    setSqueezeCount(c => c + 1);
    setBallColor(prev => (prev + 1) % colors.length);
  }, [colors.length]);

  const handleSqueezeEnd = useCallback(() => {
    setIsSqueezing(false);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="text-center">
        <h2 className="text-xl font-light tracking-wide" style={{ color: 'oklch(0.30 0.04 290)' }}>
          解压球
        </h2>
        <p className="text-xs mt-1" style={{ color: 'oklch(0.55 0.03 290)' }}>
          按住球体挤压，释放你的压力
        </p>
      </div>

      {/* 解压球区域 */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center w-56 h-56 cursor-pointer select-none"
        onMouseDown={handleSqueezeStart}
        onMouseUp={handleSqueezeEnd}
        onMouseLeave={handleSqueezeEnd}
        onTouchStart={handleSqueezeStart}
        onTouchEnd={handleSqueezeEnd}
      >
        {/* 球体阴影 */}
        <div
          className="absolute bottom-6 rounded-full transition-all duration-300"
          style={{
            width: isSqueezing ? '140px' : '120px',
            height: '16px',
            background: `${currentColor.dark} / 0.25`,
            filter: 'blur(10px)',
          }}
        />

        {/* 主球体 */}
        <div
          className="relative w-40 h-40 rounded-full select-none"
          style={{
            transform: isSqueezing ? 'scale(0.78) rotate(-3deg)' : 'scale(1) rotate(0deg)',
            transitionDuration: isSqueezing ? '120ms' : '500ms',
            transitionTimingFunction: isSqueezing
              ? 'cubic-bezier(0.4, 0, 1, 1)'
              : 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            background: `radial-gradient(circle at 35% 30%, ${currentColor.light}, ${currentColor.main} 50%, ${currentColor.dark})`,
            boxShadow: isSqueezing
              ? `inset 0 8px 25px ${currentColor.dark} / 0.5, 0 2px 10px ${currentColor.main} / 0.3`
              : `0 12px 35px ${currentColor.main} / 0.35, inset 0 -8px 20px ${currentColor.dark} / 0.2, inset 0 4px 10px oklch(0.98 0 0 / 0.2)`,
          }}
        >
          {/* 高光 */}
          <div
            className="absolute top-5 left-7 w-14 h-10 rounded-full"
            style={{
              background: 'radial-gradient(ellipse, oklch(0.98 0.01 290 / 0.6), transparent)',
              filter: 'blur(3px)',
              transform: isSqueezing ? 'scale(0.7) translateY(4px)' : 'scale(1)',
              transition: 'all 300ms',
            }}
          />
          {/* 次级高光 */}
          <div
            className="absolute top-10 left-12 w-4 h-3 rounded-full"
            style={{
              background: 'oklch(0.99 0.005 290 / 0.7)',
              filter: 'blur(1px)',
            }}
          />
          {/* 底部反光 */}
          <div
            className="absolute bottom-6 right-8 w-8 h-4 rounded-full"
            style={{
              background: `${currentColor.light} / 0.3`,
              filter: 'blur(3px)',
            }}
          />
        </div>

        {/* 挤压时的粒子效果 */}
        {isSqueezing && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={`${squeezeCount}-${i}`}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: currentColor.main,
                  left: '50%',
                  top: '50%',
                  opacity: 0.7,
                  animation: `particleFly 0.6s ease-out forwards`,
                  '--px': `${Math.cos((i / 8) * Math.PI * 2) * 70}px`,
                  '--py': `${Math.sin((i / 8) * Math.PI * 2) * 70}px`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}
      </div>

      {/* 挤压计数 */}
      <div className="text-center">
        <p className="text-3xl font-light" style={{ color: currentColor.main }}>
          {squeezeCount}
        </p>
        <p className="text-[11px] mt-1" style={{ color: 'oklch(0.55 0.03 290)' }}>
          次挤压
        </p>
      </div>

      {/* 重置 */}
      {squeezeCount > 0 && (
        <button
          onClick={() => setSqueezeCount(0)}
          className="text-xs transition-colors cursor-pointer"
          style={{ color: 'oklch(0.60 0.05 290)' }}
        >
          重置计数
        </button>
      )}
    </div>
  );
}

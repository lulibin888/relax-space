'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { playSqueezeSound } from '@/lib/audio-engine';

export function StressBall() {
  const [isSqueezing, setIsSqueezing] = useState(false);
  const [squeezeCount, setSqueezeCount] = useState(0);
  const [ballColor, setBallColor] = useState(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rippleId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = [
    'oklch(0.75_0.12_290)', // 紫
    'oklch(0.72_0.14_340)', // 粉
    'oklch(0.75_0.12_160)', // 绿
    'oklch(0.78_0.10_80)',  // 黄
    'oklch(0.72_0.12_240)', // 蓝
  ];

  const handleSqueezeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsSqueezing(true);
    playSqueezeSound();
    setSqueezeCount(c => c + 1);
    setBallColor(prev => (prev + 1) % colors.length);

    // 添加涟漪效果
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const id = rippleId.current++;
      setRipples(prev => [...prev, { id, x, y }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 1000);
    }
  }, [colors.length]);

  const handleSqueezeEnd = useCallback(() => {
    setIsSqueezing(false);
  }, []);

  // 粒子效果
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; angle: number }[]>([]);

  useEffect(() => {
    if (isSqueezing) {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: 0,
        y: 0,
        angle: (i / 8) * Math.PI * 2 + Math.random() * 0.5,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 600);
    }
  }, [isSqueezing, squeezeCount]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="text-center">
        <h2 className="text-2xl font-light tracking-wide text-[oklch(0.35_0.02_280)]">
          解压球
        </h2>
        <p className="text-sm text-[oklch(0.55_0.02_280)] mt-1">
          按住球体挤压，释放你的压力
        </p>
      </div>

      {/* 解压球区域 */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center w-64 h-64 cursor-pointer select-none"
        onMouseDown={handleSqueezeStart}
        onMouseUp={handleSqueezeEnd}
        onMouseLeave={handleSqueezeEnd}
        onTouchStart={handleSqueezeStart}
        onTouchEnd={handleSqueezeEnd}
      >
        {/* 涟漪效果 */}
        {ripples.map(ripple => (
          <div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x - 20,
              top: ripple.y - 20,
              width: 40,
              height: 40,
              border: `2px solid ${colors[ballColor]} / 0.5`,
              animation: 'ripple 1s ease-out forwards',
            }}
          />
        ))}

        {/* 粒子效果 */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{
              background: colors[ballColor],
              left: '50%',
              top: '50%',
              animation: `particle 0.6s ease-out forwards`,
              '--angle': `${p.angle}rad`,
              '--distance': `${60 + Math.random() * 40}px`,
            } as React.CSSProperties}
          />
        ))}

        {/* 球体阴影 */}
        <div
          className="absolute bottom-4 w-40 h-6 rounded-full transition-all duration-300"
          style={{
            background: 'oklch(0.80_0.02_280 / 0.3)',
            filter: 'blur(8px)',
            transform: isSqueezing ? 'scaleX(1.3)' : 'scaleX(1)',
          }}
        />

        {/* 主球体 */}
        <div
          className="relative w-44 h-44 rounded-full transition-all select-none"
          style={{
            transform: isSqueezing ? 'scale(0.8) rotate(-5deg)' : 'scale(1) rotate(0deg)',
            transitionDuration: isSqueezing ? '150ms' : '400ms',
            transitionTimingFunction: isSqueezing
              ? 'cubic-bezier(0.4, 0, 1, 1)'
              : 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            background: `radial-gradient(circle at 35% 30%, oklch(0.90_0.08_${290 + ballColor * 30}), ${colors[ballColor]}, oklch(0.55_0.1_${290 + ballColor * 30}))`,
            boxShadow: isSqueezing
              ? `inset 0 8px 20px oklch(0.40_0.08_${290 + ballColor * 30} / 0.5), 0 2px 10px oklch(0.50_0.08_${290 + ballColor * 30} / 0.3)`
              : `0 10px 30px ${colors[ballColor]} / 0.3, inset 0 -5px 15px oklch(0.50_0.08_${290 + ballColor * 30} / 0.3)`,
          }}
        >
          {/* 高光 */}
          <div
            className="absolute top-5 left-8 w-12 h-8 rounded-full"
            style={{
              background: 'oklch(0.95_0.02_290 / 0.5)',
              filter: 'blur(4px)',
              transform: isSqueezing ? 'scale(0.8)' : 'scale(1)',
              transition: 'transform 300ms',
            }}
          />
          {/* 纹理 */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 60% 70%, transparent 50%, oklch(0.50_0.06_290 / 0.1))',
            }}
          />
        </div>
      </div>

      {/* 挤压计数 */}
      <div className="text-center">
        <p className="text-3xl font-light text-[oklch(0.40_0.04_290)]">
          {squeezeCount}
        </p>
        <p className="text-xs text-[oklch(0.55_0.02_280)] mt-1">
          次挤压
        </p>
      </div>

      {/* 重置 */}
      {squeezeCount > 0 && (
        <button
          onClick={() => setSqueezeCount(0)}
          className="text-sm text-[oklch(0.60_0.05_290)] hover:text-[oklch(0.50_0.08_290)] transition-colors cursor-pointer"
        >
          重置计数
        </button>
      )}
    </div>
  );
}

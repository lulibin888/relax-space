'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { playSoftClick } from '@/lib/audio-engine';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  life: number;
}

const ZEN_COLORS = [
  'oklch(0.80_0.06_290 / 0.6)',
  'oklch(0.78_0.08_340 / 0.6)',
  'oklch(0.80_0.06_160 / 0.6)',
  'oklch(0.82_0.04_80 / 0.6)',
  'oklch(0.78_0.06_240 / 0.6)',
];

export function ZenCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [colorIndex, setColorIndex] = useState(0);
  const [brushSize, setBrushSize] = useState(4);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const particleId = useRef(0);
  const animFrame = useRef<number>(0);

  // 绘制粒子动画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制背景纹理 - 沙纹
      drawSandTexture(ctx, canvas.width, canvas.height);

      // 绘制粒子
      setParticles(prev => {
        const updated = prev
          .map(p => ({ ...p, life: p.life - 0.005 }))
          .filter(p => p.life > 0);

        updated.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life * 0.5;
          ctx.fill();
          ctx.globalAlpha = 1;
        });

        return updated;
      });

      animFrame.current = requestAnimationFrame(animate);
    };

    animFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame.current);
  }, []);

  const drawSandTexture = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // 禅意沙纹背景
    ctx.fillStyle = 'oklch(0.96_0.01_80)';
    ctx.fillRect(0, 0, w, h);

    // 同心圆纹理
    ctx.strokeStyle = 'oklch(0.92_0.01_80 / 0.3)';
    ctx.lineWidth = 0.5;
    const cx = w / 2;
    const cy = h / 2;
    for (let r = 20; r < Math.max(w, h); r += 15) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const pos = getPos(e);
    lastPos.current = pos;
    playSoftClick();
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);

    if (lastPos.current) {
      // 绘制笔触
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = ZEN_COLORS[colorIndex];
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // 添加粒子
      if (Math.random() < 0.3) {
        const id = particleId.current++;
        setParticles(prev => [...prev.slice(-50), {
          id,
          x: pos.x + (Math.random() - 0.5) * 20,
          y: pos.y + (Math.random() - 0.5) * 20,
          size: brushSize * (0.5 + Math.random()),
          color: ZEN_COLORS[colorIndex],
          life: 1,
        }]);
      }
    }

    lastPos.current = pos;
  }, [isDrawing, colorIndex, brushSize]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    lastPos.current = null;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setParticles([]);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="text-center">
        <h2 className="text-2xl font-light tracking-wide text-[oklch(0.35_0.02_280)]">
          禅意画板
        </h2>
        <p className="text-sm text-[oklch(0.55_0.02_280)] mt-1">
          在沙上随意涂画，感受笔触的流动
        </p>
      </div>

      {/* 画布 */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg" style={{ border: '3px solid oklch(0.90_0.02_80)' }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="cursor-crosshair touch-none"
          style={{ width: '100%', maxWidth: '400px', height: 'auto', aspectRatio: '4/3' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* 工具栏 */}
      <div className="flex items-center gap-4">
        {/* 颜色选择 */}
        <div className="flex gap-2">
          {ZEN_COLORS.map((color, i) => (
            <button
              key={i}
              onClick={() => { setColorIndex(i); playSoftClick(); }}
              className="w-7 h-7 rounded-full transition-all duration-200 cursor-pointer"
              style={{
                background: color.replace('/ 0.6', '/ 1'),
                transform: colorIndex === i ? 'scale(1.2)' : 'scale(1)',
                boxShadow: colorIndex === i ? `0 2px 8px ${color}` : 'none',
              }}
            />
          ))}
        </div>

        {/* 笔刷大小 */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[oklch(0.60_0.02_280)]" />
          <input
            type="range"
            min="2"
            max="12"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-20 h-1 rounded-full appearance-none cursor-pointer"
            style={{
              background: 'linear-gradient(to right, oklch(0.70_0.08_290), oklch(0.85_0.02_290))',
            }}
          />
          <div className="w-4 h-4 rounded-full bg-[oklch(0.60_0.02_280)]" />
        </div>

        {/* 清除 */}
        <button
          onClick={clearCanvas}
          className="px-3 py-1.5 rounded-full text-xs bg-[oklch(0.95_0.01_290)] text-[oklch(0.55_0.02_280)] hover:bg-[oklch(0.92_0.02_290)] transition-colors cursor-pointer"
        >
          清除
        </button>
      </div>
    </div>
  );
}

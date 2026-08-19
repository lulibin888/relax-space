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
  { color: 'oklch(0.65 0.12 240)', label: '蓝' },
  { color: 'oklch(0.62 0.10 200)', label: '青' },
  { color: 'oklch(0.65 0.10 280)', label: '紫' },
  { color: 'oklch(0.70 0.08 160)', label: '绿' },
  { color: 'oklch(0.68 0.10 340)', label: '粉' },
];

export function ZenCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [colorIndex, setColorIndex] = useState(0);
  const [brushSize, setBrushSize] = useState(5);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const particleId = useRef(0);
  const animFrame = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 沙纹背景
      ctx.fillStyle = 'oklch(0.97 0.01 240)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'oklch(0.94 0.008 240 / 0.2)';
      ctx.lineWidth = 0.5;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      for (let r = 15; r < Math.max(canvas.width, canvas.height); r += 12) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      setParticles(prev => {
        const updated = prev.map(p => ({ ...p, life: p.life - 0.008 })).filter(p => p.life > 0);
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

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    lastPos.current = getPos(e);
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
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = ZEN_COLORS[colorIndex].color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.7;
      ctx.stroke();
      ctx.globalAlpha = 1;

      if (Math.random() < 0.2) {
        const id = particleId.current++;
        setParticles(prev => [...prev.slice(-35), {
          id, x: pos.x + (Math.random() - 0.5) * 25, y: pos.y + (Math.random() - 0.5) * 25,
          size: brushSize * (0.4 + Math.random() * 0.5), color: ZEN_COLORS[colorIndex].color, life: 1,
        }]);
      }
    }
    lastPos.current = pos;
  }, [isDrawing, colorIndex, brushSize]);

  const stopDrawing = useCallback(() => { setIsDrawing(false); lastPos.current = null; }, []);

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
        <h2 className="text-xl font-light tracking-wide" style={{ color: 'oklch(0.30 0.06 240)' }}>
          禅意画板
        </h2>
        <p className="text-xs mt-1" style={{ color: 'oklch(0.55 0.04 240)' }}>
          在沙上随意涂画，感受笔触的流动
        </p>
      </div>

      <div className="relative rounded-2xl overflow-hidden" style={{
        boxShadow: '0 4px 20px oklch(0.88 0.02 240 / 0.25), inset 0 0 0 1px oklch(0.92 0.01 240 / 0.4)',
      }}>
        <canvas
          ref={canvasRef} width={420} height={300}
          className="cursor-crosshair touch-none"
          style={{ width: '100%', maxWidth: '420px', height: 'auto', aspectRatio: '7/5' }}
          onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
          onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
        />
      </div>

      <div className="flex items-center gap-4 flex-wrap justify-center">
        <div className="flex gap-2">
          {ZEN_COLORS.map((c, i) => (
            <button key={i} onClick={() => { setColorIndex(i); playSoftClick(); }}
              className="w-7 h-7 rounded-full transition-all duration-200 cursor-pointer"
              style={{
                background: c.color,
                transform: colorIndex === i ? 'scale(1.2)' : 'scale(1)',
                boxShadow: colorIndex === i ? `0 3px 10px ${c.color} / 0.35` : `0 1px 3px ${c.color} / 0.15`,
                border: colorIndex === i ? '2px solid oklch(0.98 0 0 / 0.5)' : '2px solid transparent',
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'oklch(0.60 0.04 240)' }} />
          <input type="range" min="2" max="14" value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-16 h-1 rounded-full appearance-none cursor-pointer"
            style={{ background: 'linear-gradient(to right, oklch(0.68 0.10 240), oklch(0.90 0.015 240))' }}
          />
          <div className="w-4 h-4 rounded-full" style={{ background: 'oklch(0.60 0.04 240)' }} />
        </div>

        <button onClick={clearCanvas} className="px-3 py-1.5 rounded-full text-[11px] transition-colors cursor-pointer"
          style={{ background: 'oklch(0.97 0.008 240)', color: 'oklch(0.50 0.04 240)', border: '1px solid oklch(0.93 0.01 240)' }}>
          清除
        </button>
      </div>
    </div>
  );
}

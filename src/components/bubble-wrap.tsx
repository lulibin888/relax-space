'use client';

import { useState, useCallback, useRef } from 'react';
import { playPopSound } from '@/lib/audio-engine';

interface Bubble {
  id: number;
  popped: boolean;
  scale: number;
}

export function BubbleWrap() {
  const [bubbles, setBubbles] = useState<Bubble[]>(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      popped: false,
      scale: 1,
    }))
  );
  const [popCount, setPopCount] = useState(0);
  const [isAllPopped, setIsAllPopped] = useState(false);
  const audioEnabled = useRef(true);

  const popBubble = useCallback((id: number) => {
    setBubbles(prev => {
      const bubble = prev.find(b => b.id === id);
      if (!bubble || bubble.popped) return prev;

      if (audioEnabled.current) {
        playPopSound();
      }

      const newBubbles = prev.map(b =>
        b.id === id ? { ...b, popped: true, scale: 0.6 } : b
      );

      const poppedCount = newBubbles.filter(b => b.popped).length;
      setPopCount(poppedCount);

      if (poppedCount === newBubbles.length) {
        setIsAllPopped(true);
      }

      return newBubbles;
    });
  }, []);

  const resetBubbles = useCallback(() => {
    setBubbles(Array.from({ length: 80 }, (_, i) => ({
      id: i,
      popped: false,
      scale: 1,
    })));
    setPopCount(0);
    setIsAllPopped(false);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="text-center">
        <h2 className="text-2xl font-light tracking-wide text-[oklch(0.35_0.02_280)]">
          气泡膜
        </h2>
        <p className="text-sm text-[oklch(0.55_0.02_280)] mt-1">
          点击气泡，享受破裂的满足感
        </p>
      </div>

      {/* 进度条 */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-xs text-[oklch(0.55_0.02_280)] mb-1">
          <span>已戳破 {popCount} / {bubbles.length}</span>
          <span>{Math.round(popCount / bubbles.length * 100)}%</span>
        </div>
        <div className="h-2 bg-[oklch(0.93_0.01_290)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${(popCount / bubbles.length) * 100}%`,
              background: 'linear-gradient(90deg, oklch(0.75_0.1_290), oklch(0.78_0.08_10))',
            }}
          />
        </div>
      </div>

      {/* 气泡网格 */}
      <div className="grid grid-cols-10 gap-1.5 p-4 bg-[oklch(0.97_0.01_290)] rounded-2xl shadow-sm">
        {bubbles.map(bubble => (
          <button
            key={bubble.id}
            onClick={() => popBubble(bubble.id)}
            disabled={bubble.popped}
            className="relative w-8 h-8 rounded-full transition-all duration-200 focus:outline-none"
            style={{
              transform: bubble.popped ? 'scale(0.6)' : 'scale(1)',
              opacity: bubble.popped ? 0.3 : 1,
            }}
          >
            {!bubble.popped ? (
              <>
                {/* 气泡凸起效果 */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, oklch(0.95_0.02_290), oklch(0.82_0.06_290))',
                    boxShadow: 'inset 0 -2px 4px oklch(0.75_0.08_290 / 0.3), 0 2px 4px oklch(0.75_0.08_290 / 0.2)',
                  }}
                />
                {/* 高光 */}
                <div
                  className="absolute top-1 left-1.5 w-2 h-1.5 rounded-full"
                  style={{
                    background: 'oklch(0.98_0.01_290 / 0.8)',
                  }}
                />
              </>
            ) : (
              <div
                className="absolute inset-1 rounded-full"
                style={{
                  background: 'oklch(0.92_0.01_290)',
                  boxShadow: 'inset 0 1px 3px oklch(0.80_0.02_290 / 0.3)',
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* 全部戳破后的提示 */}
      {isAllPopped && (
        <div className="text-center animate-in fade-in duration-500">
          <p className="text-[oklch(0.6_0.08_290)] font-light text-lg mb-3">
            全部戳破啦! 压力释放完毕
          </p>
          <button
            onClick={resetBubbles}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, oklch(0.70_0.1_290), oklch(0.68_0.08_320))',
            }}
          >
            再来一张新膜
          </button>
        </div>
      )}

      {/* 手动重置 */}
      {!isAllPopped && popCount > 0 && (
        <button
          onClick={resetBubbles}
          className="text-sm text-[oklch(0.60_0.05_290)] hover:text-[oklch(0.50_0.08_290)] transition-colors cursor-pointer"
        >
          重新开始
        </button>
      )}
    </div>
  );
}

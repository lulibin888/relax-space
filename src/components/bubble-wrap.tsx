'use client';

import { useState, useCallback, useRef } from 'react';
import { playPopSound } from '@/lib/audio-engine';

interface Bubble {
  id: number;
  popped: boolean;
}

export function BubbleWrap() {
  const [bubbles, setBubbles] = useState<Bubble[]>(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      popped: false,
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
        b.id === id ? { ...b, popped: true } : b
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
    setBubbles(Array.from({ length: 60 }, (_, i) => ({
      id: i,
      popped: false,
    })));
    setPopCount(0);
    setIsAllPopped(false);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="text-center">
        <h2 className="text-xl font-light tracking-wide" style={{ color: 'oklch(0.30 0.04 290)' }}>
          气泡膜
        </h2>
        <p className="text-xs mt-1" style={{ color: 'oklch(0.55 0.03 290)' }}>
          点击气泡，享受破裂的满足感
        </p>
      </div>

      {/* 进度条 */}
      <div className="w-full max-w-sm">
        <div className="flex justify-between text-xs mb-1.5" style={{ color: 'oklch(0.50 0.03 290)' }}>
          <span>已戳破 {popCount} / {bubbles.length}</span>
          <span>{Math.round(popCount / bubbles.length * 100)}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'oklch(0.92 0.01 290)' }}>
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${(popCount / bubbles.length) * 100}%`,
              background: 'linear-gradient(90deg, oklch(0.70 0.12 290), oklch(0.72 0.10 330))',
            }}
          />
        </div>
      </div>

      {/* 气泡网格 */}
      <div
        className="grid grid-cols-10 gap-2 p-5 rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, oklch(0.96 0.015 290), oklch(0.94 0.01 280))',
          boxShadow: 'inset 0 2px 6px oklch(0.88 0.01 290 / 0.5), 0 1px 3px oklch(0.90 0 0 / 0.3)',
        }}
      >
        {bubbles.map(bubble => (
          <button
            key={bubble.id}
            onClick={() => popBubble(bubble.id)}
            disabled={bubble.popped}
            className="relative rounded-full transition-all focus:outline-none cursor-pointer"
            style={{
              width: '38px',
              height: '38px',
              transform: bubble.popped ? 'scale(0.7)' : 'scale(1)',
              opacity: bubble.popped ? 0.2 : 1,
              transitionDuration: bubble.popped ? '150ms' : '200ms',
            }}
          >
            {!bubble.popped ? (
              <>
                {/* 气泡主体 - 更强的3D效果 */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 38% 32%,
                      oklch(0.97 0.03 290) 0%,
                      oklch(0.88 0.08 290) 40%,
                      oklch(0.78 0.10 290) 70%,
                      oklch(0.72 0.10 290) 100%)`,
                    boxShadow: `
                      inset 0 -3px 6px oklch(0.65 0.10 290 / 0.4),
                      inset 0 2px 4px oklch(0.98 0.01 290 / 0.6),
                      0 3px 8px oklch(0.70 0.08 290 / 0.35),
                      0 1px 2px oklch(0.60 0.06 290 / 0.2)
                    `,
                    border: '1px solid oklch(0.85 0.06 290 / 0.5)',
                  }}
                />
                {/* 高光 - 更大更明显 */}
                <div
                  className="absolute rounded-full"
                  style={{
                    top: '5px',
                    left: '8px',
                    width: '12px',
                    height: '8px',
                    background: 'radial-gradient(ellipse, oklch(0.99 0.005 290 / 0.9), transparent)',
                    filter: 'blur(1px)',
                  }}
                />
                {/* 底部反光 */}
                <div
                  className="absolute rounded-full"
                  style={{
                    bottom: '6px',
                    right: '8px',
                    width: '6px',
                    height: '4px',
                    background: 'oklch(0.95 0.02 290 / 0.4)',
                    filter: 'blur(1px)',
                  }}
                />
              </>
            ) : (
              /* 破裂后的凹陷效果 */
              <div
                className="absolute inset-1 rounded-full"
                style={{
                  background: 'radial-gradient(circle, oklch(0.90 0.01 290), oklch(0.88 0.01 290))',
                  boxShadow: 'inset 0 2px 4px oklch(0.80 0.02 290 / 0.5)',
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* 全部戳破后的提示 */}
      {isAllPopped && (
        <div className="text-center" style={{ animation: 'fadeIn 0.5s ease-out' }}>
          <p className="font-light text-base mb-3" style={{ color: 'oklch(0.55 0.08 290)' }}>
            全部戳破啦! 压力释放完毕
          </p>
          <button
            onClick={resetBubbles}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, oklch(0.65 0.12 290), oklch(0.62 0.10 320))',
              boxShadow: '0 4px 15px oklch(0.65 0.10 290 / 0.3)',
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
          className="text-xs transition-colors cursor-pointer"
          style={{ color: 'oklch(0.60 0.05 290)' }}
        >
          重新开始
        </button>
      )}
    </div>
  );
}

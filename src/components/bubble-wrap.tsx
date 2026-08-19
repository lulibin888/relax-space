'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import { playPopSound } from '@/lib/audio-engine';

const BUBBLE_EMOJIS = [
  '😊', '😌', '🥰', '😎', '🤗', '😇', '🫠', '😋',
  '🥳', '😜', '🤪', '😝', '🫣', '😏', '🤭', '😁',
  '😆', '🙃', '😄', '😃', '✨', '💫', '⭐', '🌟',
  '🎈', '🫧', '💖', '🦋', '🌸', '🍀', '🌈', '☁️',
  '🐱', '🐶', '🐰', '🐼', '🦊', '🐸', '🐧', '🦄',
  '🍭', '🍬', '🧁', '🍰', '🍩', '🎀', '💝', '🎵',
  '🌺', '🌻', '🌷', '🪻', '💐', '🌼', '🍃', '🌿',
];

interface Bubble {
  id: number;
  popped: boolean;
  emoji: string;
}

export function BubbleWrap() {
  const initBubbles = useCallback((): Bubble[] =>
    Array.from({ length: 48 }, (_, i) => ({
      id: i,
      popped: false,
      emoji: BUBBLE_EMOJIS[i % BUBBLE_EMOJIS.length],
    })), []);

  const [bubbles, setBubbles] = useState<Bubble[]>(initBubbles);
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
    setBubbles(initBubbles());
    setPopCount(0);
    setIsAllPopped(false);
  }, [initBubbles]);

  const progress = bubbles.length > 0 ? popCount / bubbles.length : 0;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="text-center">
        <h2 className="text-xl font-light tracking-wide" style={{ color: 'oklch(0.30 0.06 240)' }}>
          气泡膜
        </h2>
        <p className="text-xs mt-1" style={{ color: 'oklch(0.55 0.04 240)' }}>
          戳破气泡，释放每个小表情里的压力
        </p>
      </div>

      {/* 进度条 */}
      <div className="w-full max-w-sm">
        <div className="flex justify-between text-xs mb-1.5" style={{ color: 'oklch(0.50 0.04 240)' }}>
          <span>已戳破 {popCount} / {bubbles.length}</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'oklch(0.93 0.015 240)' }}>
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress * 100}%`,
              background: 'linear-gradient(90deg, oklch(0.72 0.12 240), oklch(0.75 0.10 200))',
            }}
          />
        </div>
      </div>

      {/* 气泡网格 */}
      <div
        className="grid grid-cols-8 gap-2.5 p-5 rounded-2xl w-full"
        style={{
          background: 'linear-gradient(145deg, oklch(0.97 0.012 240), oklch(0.95 0.015 220))',
          boxShadow: 'inset 0 2px 6px oklch(0.90 0.015 240 / 0.4), 0 1px 3px oklch(0.90 0 0 / 0.2)',
        }}
      >
        {bubbles.map(bubble => (
          <button
            key={bubble.id}
            onClick={() => popBubble(bubble.id)}
            disabled={bubble.popped}
            className="relative aspect-square rounded-full transition-all focus:outline-none cursor-pointer"
            style={{
              transform: bubble.popped ? 'scale(0.7)' : 'scale(1)',
              opacity: bubble.popped ? 0.15 : 1,
              transitionDuration: bubble.popped ? '150ms' : '200ms',
            }}
          >
            {!bubble.popped ? (
              <>
                {/* 气泡主体 */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 38% 32%,
                      oklch(0.98 0.01 240) 0%,
                      oklch(0.92 0.04 240) 35%,
                      oklch(0.84 0.08 240) 65%,
                      oklch(0.78 0.09 240) 100%)`,
                    boxShadow: `
                      inset 0 -3px 6px oklch(0.68 0.10 240 / 0.35),
                      inset 0 2px 4px oklch(0.99 0.005 240 / 0.7),
                      0 3px 8px oklch(0.72 0.08 240 / 0.3),
                      0 1px 2px oklch(0.65 0.06 240 / 0.15)
                    `,
                    border: '1.5px solid oklch(0.88 0.05 240 / 0.5)',
                  }}
                />
                {/* 表情 */}
                <div className="absolute inset-0 flex items-center justify-center text-base select-none pointer-events-none">
                  {bubble.emoji}
                </div>
                {/* 高光 */}
                <div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    top: '4px',
                    left: '6px',
                    width: '10px',
                    height: '6px',
                    background: 'radial-gradient(ellipse, oklch(0.99 0.003 240 / 0.85), transparent)',
                    filter: 'blur(0.5px)',
                  }}
                />
              </>
            ) : (
              <div
                className="absolute inset-1.5 rounded-full"
                style={{
                  background: 'radial-gradient(circle, oklch(0.92 0.01 240), oklch(0.90 0.01 240))',
                  boxShadow: 'inset 0 2px 4px oklch(0.82 0.02 240 / 0.4)',
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* 全部戳破 */}
      {isAllPopped && (
        <div className="text-center" style={{ animation: 'fadeIn 0.5s ease-out' }}>
          <p className="font-light text-base mb-3" style={{ color: 'oklch(0.55 0.08 240)' }}>
            全部戳破啦! 压力释放完毕
          </p>
          <button
            onClick={resetBubbles}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, oklch(0.65 0.12 240), oklch(0.62 0.10 210))',
              boxShadow: '0 4px 15px oklch(0.65 0.10 240 / 0.3)',
            }}
          >
            再来一张新膜
          </button>
        </div>
      )}

      {!isAllPopped && popCount > 0 && (
        <button
          onClick={resetBubbles}
          className="text-xs transition-colors cursor-pointer"
          style={{ color: 'oklch(0.60 0.06 240)' }}
        >
          重新开始
        </button>
      )}
    </div>
  );
}

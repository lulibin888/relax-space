'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { playChimeSound } from '@/lib/audio-engine';

type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'rest';

const PHASE_CONFIG: Record<Exclude<BreathPhase, 'idle'>, { label: string; duration: number; instruction: string }> = {
  inhale: { label: '吸气', duration: 4, instruction: '缓缓吸气，感受空气充满肺部' },
  hold: { label: '屏息', duration: 4, instruction: '轻轻屏住呼吸，保持平静' },
  exhale: { label: '呼气', duration: 6, instruction: '慢慢呼出，释放所有紧张' },
  rest: { label: '休息', duration: 2, instruction: '自然放松，准备下一次呼吸' },
};

const PHASES: Exclude<BreathPhase, 'idle'>[] = ['inhale', 'hold', 'exhale', 'rest'];

export function BreathingGuide() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('idle');
  const [phaseTime, setPhaseTime] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [pattern, setPattern] = useState<(Exclude<BreathPhase, 'idle'>)[]>(['inhale', 'hold', 'exhale', 'rest']);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseIndexRef = useRef(0);

  const stopBreathing = useCallback(() => {
    setIsRunning(false);
    setCurrentPhase('idle');
    setPhaseTime(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startBreathing = useCallback(() => {
    setIsRunning(true);
    setCurrentPhase('inhale');
    setPhaseTime(0);
    setCycleCount(0);
    phaseIndexRef.current = 0;
    playChimeSound();
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setPhaseTime(prev => {
        const phaseKey = PHASES[phaseIndexRef.current];
        const config = PHASE_CONFIG[phaseKey];

        if (prev + 1 >= config.duration) {
          const nextIndex = (phaseIndexRef.current + 1) % pattern.length;
          phaseIndexRef.current = nextIndex;
          const nextPhase = pattern[nextIndex];
          setCurrentPhase(nextPhase);
          playChimeSound();

          if (nextIndex === 0) {
            setCycleCount(c => c + 1);
          }

          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, pattern]);

  const phaseConfig = currentPhase !== 'idle' ? PHASE_CONFIG[currentPhase] : null;
  const progress = phaseConfig ? phaseTime / phaseConfig.duration : 0;

  const getCircleScale = () => {
    switch (currentPhase) {
      case 'inhale': return 0.55 + progress * 0.45;
      case 'hold': return 1;
      case 'exhale': return 1 - progress * 0.45;
      case 'rest': return 0.55;
      default: return 0.55;
    }
  };

  const getCircleColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'oklch(0.78 0.10 290)';
      case 'hold': return 'oklch(0.75 0.08 320)';
      case 'exhale': return 'oklch(0.78 0.08 200)';
      case 'rest': return 'oklch(0.80 0.06 160)';
      default: return 'oklch(0.82 0.04 290)';
    }
  };

  const patterns = [
    { name: '4-4-6-2 放松', value: ['inhale', 'hold', 'exhale', 'rest'] as const },
    { name: '4-7-8 助眠', value: ['inhale', 'hold', 'exhale', 'rest'] as const },
    { name: '简单呼吸', value: ['inhale', 'exhale'] as const },
  ];

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="text-center">
        <h2 className="text-xl font-light tracking-wide" style={{ color: 'oklch(0.30 0.04 290)' }}>
          呼吸引导
        </h2>
        <p className="text-xs mt-1" style={{ color: 'oklch(0.55 0.03 290)' }}>
          跟随节奏，深呼吸放松身心
        </p>
      </div>

      {/* 模式选择 */}
      <div className="flex gap-2">
        {patterns.map((p, i) => (
          <button
            key={i}
            onClick={() => { if (!isRunning) setPattern([...p.value]); }}
            className="px-3 py-1.5 rounded-full text-[11px] transition-all duration-300 cursor-pointer"
            style={{
              background: JSON.stringify(pattern) === JSON.stringify([...p.value])
                ? 'linear-gradient(135deg, oklch(0.85 0.06 290), oklch(0.82 0.05 310))'
                : 'oklch(0.96 0.01 290)',
              color: JSON.stringify(pattern) === JSON.stringify([...p.value])
                ? 'oklch(0.35 0.04 290)'
                : 'oklch(0.55 0.02 280)',
              boxShadow: JSON.stringify(pattern) === JSON.stringify([...p.value])
                ? '0 2px 8px oklch(0.75 0.08 290 / 0.2)'
                : 'none',
              border: '1px solid oklch(0.90 0.02 290 / 0.5)',
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* 呼吸引导圆 */}
      <div className="relative flex items-center justify-center w-56 h-56">
        {/* 外圈脉冲 */}
        {isRunning && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: `2px solid ${getCircleColor()} / 0.2`,
              animation: 'pulse 4s ease-in-out infinite',
            }}
          />
        )}
        {/* 主圆 */}
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            width: `${getCircleScale() * 100}%`,
            height: `${getCircleScale() * 100}%`,
            background: isRunning
              ? `radial-gradient(circle at 40% 35%, ${getCircleColor()} / 0.3, ${getCircleColor()} / 0.15)`
              : 'radial-gradient(circle, oklch(0.92 0.03 290 / 0.3), oklch(0.88 0.02 290 / 0.1))',
            transitionDuration: currentPhase === 'inhale' ? '4000ms' :
                               currentPhase === 'exhale' ? '6000ms' : '500ms',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isRunning
              ? `0 0 50px ${getCircleColor()} / 0.25, inset 0 0 25px oklch(0.90 0.04 290 / 0.3)`
              : '0 0 20px oklch(0.85 0.02 290 / 0.1)',
            border: isRunning ? `1px solid ${getCircleColor()} / 0.3` : '1px solid oklch(0.90 0.02 290 / 0.3)',
          }}
        >
          <div className="text-center">
            {isRunning && phaseConfig ? (
              <>
                <p className="text-2xl font-light" style={{ color: 'oklch(0.35 0.05 290)' }}>
                  {phaseConfig.label}
                </p>
                <p className="text-sm mt-1 font-light" style={{ color: 'oklch(0.55 0.04 290)' }}>
                  {phaseConfig.duration - phaseTime}
                </p>
              </>
            ) : (
              <p className="text-base font-light" style={{ color: 'oklch(0.55 0.03 290)' }}>
                准备好了吗
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 提示文字 */}
      {isRunning && phaseConfig && (
        <p className="text-xs text-center" style={{ color: 'oklch(0.55 0.04 290)', animation: 'fadeIn 0.5s ease-out' }}>
          {phaseConfig.instruction}
        </p>
      )}

      {/* 循环计数 */}
      {cycleCount > 0 && (
        <p className="text-[11px]" style={{ color: 'oklch(0.60 0.03 290)' }}>
          已完成 {cycleCount} 个循环
        </p>
      )}

      {/* 控制按钮 */}
      <button
        onClick={isRunning ? stopBreathing : startBreathing}
        className="px-8 py-3 rounded-full text-sm font-medium text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        style={{
          background: isRunning
            ? 'linear-gradient(135deg, oklch(0.62 0.10 10), oklch(0.58 0.08 10))'
            : 'linear-gradient(135deg, oklch(0.65 0.12 290), oklch(0.60 0.10 320))',
          boxShadow: isRunning
            ? '0 4px 15px oklch(0.62 0.10 10 / 0.3)'
            : '0 4px 15px oklch(0.65 0.10 290 / 0.3)',
        }}
      >
        {isRunning ? '结束' : '开始呼吸'}
      </button>
    </div>
  );
}

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
          // 进入下一阶段
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

  // 圆圈动画比例
  const getCircleScale = () => {
    switch (currentPhase) {
      case 'inhale': return 0.6 + progress * 0.4;
      case 'hold': return 1;
      case 'exhale': return 1 - progress * 0.4;
      case 'rest': return 0.6;
      default: return 0.6;
    }
  };

  const patterns = [
    { name: '4-4-6-2 放松', value: ['inhale', 'hold', 'exhale', 'rest'] as const },
    { name: '4-7-8 助眠', value: ['inhale', 'hold', 'exhale', 'rest'] as const },
    { name: '简单呼吸', value: ['inhale', 'exhale'] as const },
  ];

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="text-center">
        <h2 className="text-2xl font-light tracking-wide text-[oklch(0.35_0.02_280)]">
          呼吸引导
        </h2>
        <p className="text-sm text-[oklch(0.55_0.02_280)] mt-1">
          跟随节奏，深呼吸放松身心
        </p>
      </div>

      {/* 模式选择 */}
      <div className="flex gap-2">
        {patterns.map((p, i) => (
          <button
            key={i}
            onClick={() => { if (!isRunning) setPattern([...p.value]); }}
            className={`px-3 py-1.5 rounded-full text-xs transition-all duration-300 cursor-pointer ${
              JSON.stringify(pattern) === JSON.stringify([...p.value])
                ? 'bg-[oklch(0.85_0.06_290)] text-[oklch(0.35_0.04_290)]'
                : 'bg-[oklch(0.95_0.01_290)] text-[oklch(0.55_0.02_280)] hover:bg-[oklch(0.92_0.02_290)]'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* 呼吸引导圆 */}
      <div className="relative flex items-center justify-center w-64 h-64">
        {/* 外圈装饰 */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, oklch(0.90_0.04_290 / ${isRunning ? 0.3 : 0.1}), transparent)`,
          }}
        />
        {/* 主圆 */}
        <div
          className="rounded-full flex items-center justify-center transition-all"
          style={{
            width: `${getCircleScale() * 100}%`,
            height: `${getCircleScale() * 100}%`,
            background: isRunning
              ? `radial-gradient(circle, oklch(0.85_0.08_290 / 0.6), oklch(0.78_0.1_290 / 0.3))`
              : 'radial-gradient(circle, oklch(0.90_0.04_290 / 0.3), oklch(0.85_0.02_290 / 0.1))',
            transitionDuration: currentPhase === 'inhale' ? '4000ms' :
                               currentPhase === 'exhale' ? '6000ms' : '500ms',
            boxShadow: isRunning
              ? '0 0 60px oklch(0.75_0.1_290 / 0.3), inset 0 0 30px oklch(0.85_0.06_290 / 0.3)'
              : 'none',
          }}
        >
          <div className="text-center">
            {isRunning && phaseConfig ? (
              <>
                <p className="text-3xl font-light text-[oklch(0.40_0.04_290)]">
                  {phaseConfig.label}
                </p>
                <p className="text-sm text-[oklch(0.55_0.04_290)] mt-1">
                  {phaseConfig.duration - phaseTime}
                </p>
              </>
            ) : (
              <p className="text-lg font-light text-[oklch(0.55_0.02_280)]">
                准备好了吗
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 提示文字 */}
      {isRunning && phaseConfig && (
        <p className="text-sm text-[oklch(0.55_0.04_290)] text-center animate-in fade-in duration-500">
          {phaseConfig.instruction}
        </p>
      )}

      {/* 循环计数 */}
      {cycleCount > 0 && (
        <p className="text-xs text-[oklch(0.60_0.02_280)]">
          已完成 {cycleCount} 个循环
        </p>
      )}

      {/* 控制按钮 */}
      <button
        onClick={isRunning ? stopBreathing : startBreathing}
        className="px-8 py-3 rounded-full text-sm font-medium text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        style={{
          background: isRunning
            ? 'linear-gradient(135deg, oklch(0.65_0.08_10), oklch(0.60_0.06_10))'
            : 'linear-gradient(135deg, oklch(0.70_0.1_290), oklch(0.68_0.08_320))',
        }}
      >
        {isRunning ? '结束' : '开始呼吸'}
      </button>
    </div>
  );
}

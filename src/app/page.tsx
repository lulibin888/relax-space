'use client';

import { useState, useEffect } from 'react';
import { BubbleWrap } from '@/components/bubble-wrap';
import { BreathingGuide } from '@/components/breathing-guide';
import { WhiteNoisePlayer } from '@/components/white-noise-player';
import { StressBall } from '@/components/stress-ball';
import { MusicPlayer } from '@/components/music-player';
import { ZenCanvas } from '@/components/zen-canvas';

type Tool = 'bubble' | 'breathing' | 'noise' | 'ball' | 'music' | 'zen';

const TOOLS: { id: Tool; label: string; emoji: string }[] = [
  { id: 'bubble', label: '气泡膜', emoji: '🫧' },
  { id: 'breathing', label: '呼吸引导', emoji: '🌬️' },
  { id: 'noise', label: '环境音', emoji: '🎵' },
  { id: 'ball', label: '解压球', emoji: '🔮' },
  { id: 'music', label: '放松音乐', emoji: '🎹' },
  { id: 'zen', label: '禅意画板', emoji: '🎨' },
];

export default function Home() {
  const [activeTool, setActiveTool] = useState<Tool>('bubble');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderTool = () => {
    switch (activeTool) {
      case 'bubble': return <BubbleWrap />;
      case 'breathing': return <BreathingGuide />;
      case 'noise': return <WhiteNoisePlayer />;
      case 'ball': return <StressBall />;
      case 'music': return <MusicPlayer />;
      case 'zen': return <ZenCanvas />;
    }
  };

  if (!mounted) return null;

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(170deg, oklch(0.97 0.015 240) 0%, oklch(0.98 0.008 220) 30%, oklch(0.98 0.006 200) 60%, oklch(0.97 0.012 240) 100%)',
      }}
    >
      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* 顶部光晕 */}
        <div
          className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.92 0.04 240 / 0.3), transparent 70%)',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        {/* 左下光晕 */}
        <div
          className="absolute -bottom-32 -left-32 w-[450px] h-[450px] rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.92 0.03 200 / 0.25), transparent 70%)',
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        />
        {/* 中间微光 */}
        <div
          className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.94 0.025 260 / 0.15), transparent 70%)',
            animation: 'float 30s ease-in-out infinite',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen max-w-2xl mx-auto">
        {/* 顶部标题 */}
        <header className="flex items-center justify-center pt-8 pb-3 px-4">
          <div className="text-center">
            <h1
              className="text-4xl font-extralight tracking-[0.25em]"
              style={{
                color: 'oklch(0.38 0.08 240)',
                textShadow: '0 2px 12px oklch(0.75 0.06 240 / 0.12)',
              }}
            >
              解压空间
            </h1>
            <div
              className="mt-2 mx-auto w-20 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, oklch(0.78 0.06 240 / 0.4), transparent)' }}
            />
            <p className="text-[11px] mt-2 tracking-widest" style={{ color: 'oklch(0.58 0.04 240)' }}>
              放慢脚步，给自己片刻宁静
            </p>
          </div>
        </header>

        {/* 工具导航 */}
        <nav className="flex justify-center px-4 pb-5">
          <div
            className="grid grid-cols-6 gap-1.5 p-2 rounded-2xl w-full max-w-lg"
            style={{
              background: 'oklch(0.98 0.008 240 / 0.7)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 2px 12px oklch(0.88 0.02 240 / 0.15)',
              border: '1px solid oklch(0.95 0.01 240 / 0.5)',
            }}
          >
            {TOOLS.map(tool => {
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className="flex flex-col items-center gap-0.5 py-2.5 px-1 rounded-xl transition-all duration-300 cursor-pointer"
                  style={{
                    background: isActive
                      ? 'linear-gradient(145deg, oklch(0.90 0.05 240), oklch(0.87 0.06 230))'
                      : 'transparent',
                    boxShadow: isActive
                      ? '0 3px 12px oklch(0.72 0.08 240 / 0.2), inset 0 1px 0 oklch(0.98 0.01 240 / 0.4)'
                      : 'none',
                    transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
                  }}
                >
                  <span
                    className="text-lg transition-transform duration-300"
                    style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)' }}
                  >
                    {tool.emoji}
                  </span>
                  <span
                    className="text-[10px] font-medium transition-colors duration-300"
                    style={{
                      color: isActive ? 'oklch(0.35 0.06 240)' : 'oklch(0.55 0.03 240)',
                    }}
                  >
                    {tool.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* 主内容区 */}
        <main className="flex-1 flex items-start justify-center px-4 pb-8">
          <div
            className="w-full rounded-3xl p-6 sm:p-8"
            style={{
              background: 'oklch(0.99 0.005 240 / 0.8)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 40px oklch(0.88 0.02 240 / 0.12), 0 1px 3px oklch(0.90 0 0 / 0.08)',
              border: '1px solid oklch(0.96 0.008 240 / 0.5)',
            }}
          >
            {renderTool()}
          </div>
        </main>

        {/* 底部 */}
        <footer className="text-center py-5">
          <p className="text-[11px] tracking-widest" style={{ color: 'oklch(0.68 0.03 240)' }}>
            深呼吸，一切都会好起来的
          </p>
        </footer>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { BubbleWrap } from '@/components/bubble-wrap';
import { BreathingGuide } from '@/components/breathing-guide';
import { WhiteNoisePlayer } from '@/components/white-noise-player';
import { StressBall } from '@/components/stress-ball';
import { MusicPlayer } from '@/components/music-player';
import { ZenCanvas } from '@/components/zen-canvas';

type Tool = 'bubble' | 'breathing' | 'noise' | 'ball' | 'music' | 'zen';

const TOOLS: { id: Tool; label: string; emoji: string; desc: string }[] = [
  { id: 'bubble', label: '气泡膜', emoji: '🫧', desc: '点击解压' },
  { id: 'breathing', label: '呼吸引导', emoji: '🌬', desc: '深呼吸放松' },
  { id: 'noise', label: '环境音', emoji: '🎵', desc: '自然白噪音' },
  { id: 'ball', label: '解压球', emoji: '🔮', desc: '挤压释放' },
  { id: 'music', label: '放松音乐', emoji: '🎹', desc: '五声音阶' },
  { id: 'zen', label: '禅意画板', emoji: '🎨', desc: '自由涂画' },
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
    <div className="min-h-screen w-full relative overflow-hidden" style={{ background: 'linear-gradient(160deg, oklch(0.98 0.008 290), oklch(0.97 0.006 80), oklch(0.98 0.005 200))' }}>
      {/* 背景装饰光晕 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.88 0.06 290 / 0.25), transparent 70%)',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[450px] h-[450px] rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.88 0.05 160 / 0.2), transparent 70%)',
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.90 0.04 340 / 0.15), transparent 70%)',
            animation: 'float 30s ease-in-out infinite',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen max-w-2xl mx-auto">
        {/* 顶部标题栏 */}
        <header className="flex items-center justify-center pt-8 pb-4 px-4">
          <div className="text-center">
            <h1
              className="text-4xl font-extralight tracking-[0.2em]"
              style={{
                color: 'oklch(0.35 0.06 290)',
                textShadow: '0 2px 10px oklch(0.75 0.08 290 / 0.15)',
              }}
            >
              解压空间
            </h1>
            <div
              className="mt-2 mx-auto w-16 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, oklch(0.75 0.08 290 / 0.5), transparent)' }}
            />
            <p className="text-xs mt-2 tracking-wider" style={{ color: 'oklch(0.58 0.03 290)' }}>
              放慢脚步，给自己片刻宁静
            </p>
          </div>
        </header>

        {/* 工具导航 - 卡片式 */}
        <nav className="flex justify-center px-4 pb-5">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full max-w-lg">
            {TOOLS.map(tool => {
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className="flex flex-col items-center gap-1 py-3 px-2 rounded-2xl transition-all duration-300 cursor-pointer group"
                  style={{
                    background: isActive
                      ? 'linear-gradient(145deg, oklch(0.92 0.04 290), oklch(0.88 0.05 310))'
                      : 'oklch(0.98 0.005 290 / 0.6)',
                    boxShadow: isActive
                      ? '0 4px 16px oklch(0.75 0.08 290 / 0.2), inset 0 1px 0 oklch(0.98 0.01 290 / 0.5)'
                      : '0 1px 3px oklch(0.88 0 0 / 0.2)',
                    transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                    border: isActive
                      ? '1px solid oklch(0.82 0.06 290 / 0.4)'
                      : '1px solid oklch(0.94 0.01 290 / 0.5)',
                  }}
                >
                  <span
                    className="text-xl transition-transform duration-300"
                    style={{
                      transform: isActive ? 'scale(1.15)' : 'scale(1)',
                      filter: isActive ? 'none' : 'grayscale(0.3)',
                    }}
                  >
                    {tool.emoji}
                  </span>
                  <span
                    className="text-[11px] font-medium transition-colors duration-300"
                    style={{
                      color: isActive
                        ? 'oklch(0.35 0.05 290)'
                        : 'oklch(0.55 0.02 280)',
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
              background: 'oklch(0.99 0.003 80 / 0.85)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 40px oklch(0.85 0.01 290 / 0.15), 0 1px 3px oklch(0.88 0 0 / 0.1)',
              border: '1px solid oklch(0.95 0.01 290 / 0.6)',
            }}
          >
            {renderTool()}
          </div>
        </main>

        {/* 底部 */}
        <footer className="text-center py-5">
          <p className="text-[11px] tracking-wider" style={{ color: 'oklch(0.68 0.02 290)' }}>
            深呼吸，一切都会好起来的
          </p>
        </footer>
      </div>
    </div>
  );
}

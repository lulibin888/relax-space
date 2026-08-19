'use client';

import { useState, useEffect } from 'react';
import { BubbleWrap } from '@/components/bubble-wrap';
import { BreathingGuide } from '@/components/breathing-guide';
import { WhiteNoisePlayer } from '@/components/white-noise-player';
import { StressBall } from '@/components/stress-ball';
import { MusicPlayer } from '@/components/music-player';
import { ZenCanvas } from '@/components/zen-canvas';

type Tool = 'bubble' | 'breathing' | 'noise' | 'ball' | 'music' | 'zen';

const TOOLS: { id: Tool; label: string; icon: string; desc: string }[] = [
  { id: 'bubble', label: '气泡膜', icon: '◎', desc: '点击解压' },
  { id: 'breathing', label: '呼吸引导', icon: '◉', desc: '深呼吸放松' },
  { id: 'noise', label: '环境音', icon: '◈', desc: '自然白噪音' },
  { id: 'ball', label: '解压球', icon: '●', desc: '挤压释放' },
  { id: 'music', label: '放松音乐', icon: '♪', desc: '五声音阶' },
  { id: 'zen', label: '禅意画板', icon: '◐', desc: '自由涂画' },
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
    <div className="min-h-screen w-full" style={{ background: 'oklch(0.98_0.005_80)' }}>
      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, oklch(0.80_0.08_290), transparent)',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, oklch(0.80_0.06_160), transparent)',
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, oklch(0.85_0.04_340), transparent)',
            animation: 'float 30s ease-in-out infinite',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* 顶部标题栏 */}
        <header className="flex items-center justify-center py-6 px-4">
          <div className="text-center">
            <h1
              className="text-3xl font-light tracking-widest"
              style={{ color: 'oklch(0.35_0.04_290)' }}
            >
              解压空间
            </h1>
            <p className="text-sm mt-1" style={{ color: 'oklch(0.60_0.02_280)' }}>
              放慢脚步，给自己片刻宁静
            </p>
          </div>
        </header>

        {/* 工具导航 */}
        <nav className="flex justify-center px-4 pb-4">
          <div
            className="flex gap-1 p-1.5 rounded-2xl overflow-x-auto max-w-full"
            style={{
              background: 'oklch(0.95_0.01_290 / 0.8)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 2px 10px oklch(0.85_0_0 / 0.2)',
            }}
          >
            {TOOLS.map(tool => {
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer"
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, oklch(0.85_0.06_290), oklch(0.82_0.04_320))'
                      : 'transparent',
                    color: isActive
                      ? 'oklch(0.35_0.04_290)'
                      : 'oklch(0.55_0.02_280)',
                    boxShadow: isActive
                      ? '0 2px 8px oklch(0.75_0.08_290 / 0.2)'
                      : 'none',
                    transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  <span className="text-base">{tool.icon}</span>
                  <span className="text-sm font-medium">{tool.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* 主内容区 */}
        <main className="flex-1 flex items-start justify-center px-4 pb-8">
          <div
            className="w-full max-w-lg p-6 rounded-3xl"
            style={{
              background: 'oklch(0.99_0.003_80 / 0.9)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 30px oklch(0.85_0_0 / 0.15)',
            }}
          >
            {renderTool()}
          </div>
        </main>

        {/* 底部 */}
        <footer className="text-center py-4">
          <p className="text-xs" style={{ color: 'oklch(0.70_0.02_280)' }}>
            深呼吸，一切都会好起来的
          </p>
        </footer>
      </div>
    </div>
  );
}

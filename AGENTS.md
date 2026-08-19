# AGENTS.md

## 项目概览

「解压空间」- 一个在线解压工具 Web 应用，提供多种解压小工具和放松音效。

## 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI**: shadcn/ui + Tailwind CSS 4
- **Audio**: Web Audio API（纯代码生成音效，无需外部音频文件）

## 目录结构

```
src/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 主页面（工具导航 + 内容切换）
│   └── globals.css         # 全局样式 + 自定义动画
├── components/
│   ├── bubble-wrap.tsx     # 气泡膜组件
│   ├── breathing-guide.tsx # 呼吸引导组件
│   ├── white-noise-player.tsx # 环境音播放器
│   ├── stress-ball.tsx     # 解压球组件
│   ├── music-player.tsx    # 放松音乐播放器
│   └── zen-canvas.tsx      # 禅意画板
├── lib/
│   ├── audio-engine.ts     # Web Audio API 音频引擎
│   └── utils.ts            # 通用工具函数
└── hooks/                  # 自定义 Hooks
```

## 功能模块

1. **气泡膜** - 80个气泡，点击破裂并播放音效
2. **呼吸引导** - 4-4-6-2/4-7-8/简单呼吸三种模式，带圆圈动画
3. **环境音** - 6种环境音（白/粉/棕噪音、雨声、海浪、风声）
4. **解压球** - 按住挤压，变色 + 粒子效果 + 音效
5. **放松音乐** - 五声音阶随机旋律生成器
6. **禅意画板** - 自由涂画，沙纹背景 + 粒子效果

## 构建与运行

```bash
pnpm install        # 安装依赖
pnpm run dev        # 开发环境
pnpm run build      # 生产构建
pnpm run start      # 生产启动
```

## 设计规范

详见 `DESIGN.md`。核心风格：禅意、柔和薰衣草紫主色调、大量留白、弹性动画。

## 注意事项

- 所有音效通过 Web Audio API 实时生成，无需外部音频文件
- 音频需要用户交互后才能播放（浏览器自动播放策略）
- 使用 `'use client'` 标记所有交互组件
- 颜色使用 oklch 色彩空间，保持温润色调

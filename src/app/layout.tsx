import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '解压空间 - 放松你的身心',
    template: '%s | 解压空间',
  },
  description:
    '一个在线解压工具，提供气泡膜、呼吸引导、环境音、解压球、放松音乐和禅意画板等多种解压方式，帮助你放松身心。',
  keywords: [
    '解压',
    '放松',
    '白噪音',
    '呼吸引导',
    '气泡膜',
    '解压球',
    '冥想',
    '减压',
  ],
  authors: [{ name: '解压空间' }],
  generator: 'Coze Code',
  openGraph: {
    title: '解压空间 - 放松你的身心',
    description:
      '多种解压工具，帮你释放压力，找回内心的平静。',
    locale: 'zh_CN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="zh-CN">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}

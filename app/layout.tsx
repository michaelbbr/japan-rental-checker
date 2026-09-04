import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '日本租房一秒評分 (Japan Rental Evaluator)',
  description: '貼上 SUUMO 或其他日本租屋網站網址，自動一眼看懂優缺點與內見確認清單。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased min-h-screen flex flex-col justify-between">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Karada Log',
  description: '体重・食事・運動を記録するアプリ',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full bg-gray-950">
        {/* 背景グローエフェクト（固定位置で常に表示） */}
        <div className="fixed inset-0 -z-10 bg-gray-950">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        </div>
        {children}
      </body>
    </html>
  )
}

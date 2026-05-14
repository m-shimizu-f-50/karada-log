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
      <body className="min-h-full bg-gradient-to-br from-sky-50 via-white to-blue-50">
        {/* 背景に薄い水色のアクセント */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        </div>
        {children}
      </body>
    </html>
  )
}

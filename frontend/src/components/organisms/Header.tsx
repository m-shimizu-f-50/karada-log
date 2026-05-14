'use client'

import { signOut } from 'next-auth/react'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 h-14">
        {/* アプリタイトル */}
        <span className="text-lg font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
          Karada Log
        </span>

        {/* ログアウトボタン */}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          ログアウト
        </button>
      </div>
    </header>
  )
}

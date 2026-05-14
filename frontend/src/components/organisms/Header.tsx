'use client'

import { signOut } from 'next-auth/react'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="flex items-center justify-between px-4 h-14">
        {/* アプリタイトル（グラデーションテキスト） */}
        <span className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Karada Log
        </span>

        {/* ログアウトボタン */}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
        >
          ログアウト
        </button>
      </div>
    </header>
  )
}

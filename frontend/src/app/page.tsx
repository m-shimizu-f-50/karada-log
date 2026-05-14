import { signIn } from '@/lib/auth'

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-950 overflow-hidden">
      {/* 背景グローエフェクト */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-sm px-6">
        {/* タイトル */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Karada Log
          </h1>
          <p className="mt-3 text-sm text-gray-400">
            体重・食事・運動を記録して、健康な毎日を
          </p>
        </div>

        {/* ログインカード */}
        <div className="rounded-2xl p-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          <div className="rounded-2xl bg-gray-900 p-8">
            <p className="mb-6 text-center text-sm text-gray-400">
              アカウントでログイン
            </p>

            {/* Google ログインボタン */}
            <form
              action={async () => {
                'use server'
                await signIn('google', { redirectTo: '/dashboard' })
              }}
            >
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                           py-3 font-semibold text-white
                           hover:from-blue-600 hover:via-purple-600 hover:to-pink-600
                           active:scale-95 transition-all duration-200 shadow-lg shadow-purple-500/25"
              >
                Google でログイン
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

import { auth } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div className="px-4 py-6">
      <p className="text-gray-400 text-sm">
        {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <h1 className="mt-1 text-2xl font-bold text-gray-800">
        こんにちは、{session?.user?.name?.split(' ')[0]} さん
      </h1>
      <p className="mt-6 text-gray-400 text-sm text-center">ダッシュボード（セクション9で実装）</p>
    </div>
  )
}

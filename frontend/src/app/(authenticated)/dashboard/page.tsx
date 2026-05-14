import { auth } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <div className="text-center">
        <p className="text-white text-xl font-bold">ダッシュボード</p>
        <p className="mt-2 text-gray-400 text-sm">{session?.user?.email}</p>
      </div>
    </div>
  )
}

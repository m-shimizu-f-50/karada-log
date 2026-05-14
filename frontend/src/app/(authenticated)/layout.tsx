import Header from '@/components/organisms/Header'
import BottomNav from '@/components/organisms/BottomNav'

// 認証済みページ共通レイアウト
// Header（上部）と BottomNav（下部）に挟まれたコンテンツエリアを提供する
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* コンテンツエリア: ヘッダーとナビゲーションの高さ分だけ余白を取る */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      <BottomNav />
    </div>
  )
}

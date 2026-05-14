import { auth } from '@/lib/auth'

// 未ログイン状態で保護対象ページにアクセスした場合、トップページへリダイレクト
export default auth((req) => {
  if (!req.auth) {
    const url = new URL('/', req.url)
    return Response.redirect(url)
  }
})

// 認証が必要なルートを指定
export const config = {
  matcher: ['/dashboard/:path*', '/weight/:path*', '/meal/:path*', '/exercise/:path*'],
}

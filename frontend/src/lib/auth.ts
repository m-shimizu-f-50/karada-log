import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: 'jwt' },
  callbacks: {
    jwt({ token, user }) {
      // 初回ログイン時に Google から取得したユーザー情報をトークンに追加
      if (user) {
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      return token
    },
    session({ session, token }) {
      // session.user.id をセットしてフロントエンドから使えるようにする
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
})

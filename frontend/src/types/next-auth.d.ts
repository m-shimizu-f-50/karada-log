import { DefaultSession } from 'next-auth'

// NextAuth のデフォルト型に id フィールドを追加する型拡張
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

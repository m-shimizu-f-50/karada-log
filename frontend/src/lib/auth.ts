import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [Google], // どのログインプロバイダーを使用するか指定（今回はGoogleのみ）
	session: { strategy: 'jwt' }, // セッション管理の方法をJWTに設定（サーバーサイドでセッションを管理しない）
	callbacks: {
		// JWTが作成・更新される際に呼び出されるコールバック関数
		jwt({ token, user }) {
			// 初回ログイン時に Google から取得したユーザー情報をトークンに追加
			if (user) {
				token.email = user.email;
				token.name = user.name;
				token.picture = user.image;
			}
			return token;
		},
		// セッションが作成される際に呼び出されるコールバック関数
		session({ session, token }) {
			// session.user.id をセットしてフロントエンドから使えるようにする
			if (token.sub) {
				session.user.id = token.sub;
				// token.subはNextAuthが自動で設定するユーザーID
				// session.userはフロントエンドでアクセスできるユーザー情報のオブジェクトで、ここにIDを追加することでフロントエンドからユーザーIDを参照できるようになる
			}
			return session;
		},
	},
});

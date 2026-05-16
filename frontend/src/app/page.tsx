import { signIn } from '@/lib/auth';

export default function LoginPage() {
	return (
		<div className='relative flex min-h-screen items-center justify-center px-6'>
			<div className='w-full max-w-sm'>
				{/* タイトル */}
				<div className='mb-10 text-center'>
					<div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 shadow-lg shadow-sky-200 mb-4'>
						<span className='text-3xl'>💪</span>
					</div>
					<h1 className='text-3xl font-bold text-gray-800'>Karada Log</h1>
					<p className='mt-2 text-sm text-gray-500'>
						体重・食事・運動を記録して、健康な毎日を
					</p>
				</div>

				{/* ログインカード */}
				<div className='bg-white rounded-2xl shadow-xl shadow-sky-100 border border-sky-100 p-8'>
					<p className='mb-6 text-center text-sm text-gray-500'>
						アカウントでログイン
					</p>

					{/* Google ログインボタン */}
					<form
						action={async () => {
							'use server'; // この関数はサーバーサイドで実行される(Server Action)
							await signIn('google', { redirectTo: '/dashboard' });
						}}
					>
						<button
							type='submit'
							className='w-full rounded-xl bg-gradient-to-r from-sky-400 to-blue-500
                         py-3 font-semibold text-white shadow-md shadow-sky-200
                         hover:from-sky-500 hover:to-blue-600
                         active:scale-95 transition-all duration-200'
						>
							Google でログイン
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

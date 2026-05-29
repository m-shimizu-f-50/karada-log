type Props = {
  caloriesIn: number
  caloriesOut: number
}

export default function CalorieSummary({ caloriesIn, caloriesOut }: Props) {
  const balance = caloriesIn - caloriesOut
  const MAX_DISPLAY = 2500
  const ratio = Math.min(caloriesIn / MAX_DISPLAY, 1)

  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5 space-y-4">
      <p className="text-xs text-gray-500">今日のカロリー収支</p>

      <div className="flex justify-between text-center">
        <div>
          <p className="text-xs text-gray-400">摂取</p>
          <p className="text-xl font-bold text-gray-800">
            {caloriesIn}
            <span className="text-xs font-normal text-gray-500 ml-1">kcal</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">消費</p>
          <p className="text-xl font-bold text-emerald-500">
            {caloriesOut}
            <span className="text-xs font-normal text-gray-500 ml-1">kcal</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">収支</p>
          <p className={`text-xl font-bold ${balance <= 0 ? 'text-emerald-500' : 'text-rose-400'}`}>
            {balance > 0 ? '+' : ''}{balance}
            <span className="text-xs font-normal text-gray-500 ml-1">kcal</span>
          </p>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-500"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 text-right">目安: {MAX_DISPLAY} kcal</p>
    </div>
  )
}

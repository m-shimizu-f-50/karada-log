'use client'

import { useState, useTransition } from 'react'
import { addWeightAction } from '@/app/(authenticated)/weight/actions'

// 今日の日付を YYYY-MM-DD 形式で取得（ローカルタイムゾーン基準）
function getTodayString() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function WeightForm() {
  const [date, setDate] = useState(getTodayString())
  const [weight, setWeight] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const weightNum = parseFloat(weight)
    if (isNaN(weightNum) || weightNum < 20 || weightNum > 300) {
      setError('体重は20〜300kgで入力してください')
      return
    }

    startTransition(async () => {
      try {
        await addWeightAction(date, weightNum)
        setWeight('') // 保存後にフォームをリセット
      } catch (err) {
        setError(err instanceof Error ? err.message : '登録に失敗しました')
      }
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
      <h2 className="text-base font-semibold text-gray-700 mb-4">今日の体重を記録</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* 日付入力 */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">日付</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800
                       focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 outline-none transition-all"
          />
        </div>

        {/* 体重入力 */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">体重（kg）</label>
          <input
            type="number"
            step="0.1"
            min="20"
            max="300"
            placeholder="68.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800
                       placeholder-gray-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20
                       outline-none transition-all"
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-gradient-to-r from-sky-400 to-blue-500
                     py-3 font-semibold text-white shadow-md shadow-sky-100
                     hover:from-sky-500 hover:to-blue-600 active:scale-95
                     transition-all duration-200 disabled:opacity-50"
        >
          {isPending ? '保存中...' : '保存する'}
        </button>
      </form>
    </div>
  )
}

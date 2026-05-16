'use client'

import { useState, useTransition } from 'react'
import { updateGoalAction } from '@/app/(authenticated)/weight/actions'
import type { WeightGoal } from '@/types/weight'

type Props = {
  goal: WeightGoal
}

export default function WeightGoalForm({ goal }: Props) {
  const [targetWeight, setTargetWeight] = useState(
    goal.targetWeight != null ? String(goal.targetWeight) : ''
  )
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const num = parseFloat(targetWeight)
    if (isNaN(num) || num < 20 || num > 300) {
      setError('目標体重は20〜300kgで入力してください')
      return
    }

    startTransition(async () => {
      try {
        await updateGoalAction(num)
      } catch (err) {
        setError(err instanceof Error ? err.message : '更新に失敗しました')
      }
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
      <h2 className="text-base font-semibold text-gray-700 mb-4">目標体重を設定</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">目標体重（kg）</label>
          <input
            type="number"
            step="0.1"
            min="20"
            max="300"
            placeholder="65.0"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
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
          {isPending ? '保存中...' : '目標を保存'}
        </button>
      </form>
    </div>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { addMealAction } from '@/app/(authenticated)/meal/actions'
import type { MealType } from '@/types/meal'
import { MEAL_TYPE_LABELS } from '@/types/meal'

type Props = {
  activeTab: MealType
  today: string
}

export default function MealForm({ activeTab, today }: Props) {
  const [foodName, setFoodName] = useState('')
  const [calories, setCalories] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!foodName.trim()) {
      setError('食品名を入力してください')
      return
    }

    const caloriesNum = parseInt(calories, 10)
    if (isNaN(caloriesNum) || caloriesNum < 0 || caloriesNum > 5000) {
      setError('カロリーは0〜5000の範囲で入力してください')
      return
    }

    startTransition(async () => {
      try {
        await addMealAction(today, activeTab, foodName.trim(), caloriesNum)
        setFoodName('')
        setCalories('')
      } catch (err) {
        setError(err instanceof Error ? err.message : '登録に失敗しました')
      }
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
      <h2 className="text-base font-semibold text-gray-700 mb-4">
        {MEAL_TYPE_LABELS[activeTab]}を記録
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">食品名</label>
          <input
            type="text"
            placeholder="ごはん、サラダ..."
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800
                       placeholder-gray-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20
                       outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">カロリー（kcal）</label>
          <input
            type="number"
            min="0"
            max="5000"
            placeholder="300"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
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
          {isPending ? '保存中...' : '追加する'}
        </button>
      </form>
    </div>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { addExerciseAction } from '@/app/(authenticated)/exercise/actions'

type Props = {
  today: string
}

export default function ExerciseForm({ today }: Props) {
  const [exerciseName, setExerciseName] = useState('')
  const [durationMinutes, setDurationMinutes] = useState('')
  const [caloriesBurned, setCaloriesBurned] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!exerciseName.trim()) {
      setError('種目を入力してください')
      return
    }

    const durationNum = parseInt(durationMinutes, 10)
    if (isNaN(durationNum) || durationNum < 1 || durationNum > 600) {
      setError('時間は1〜600分の範囲で入力してください')
      return
    }

    const caloriesNum = parseInt(caloriesBurned, 10)
    if (isNaN(caloriesNum) || caloriesNum < 0 || caloriesNum > 5000) {
      setError('消費カロリーは0〜5000の範囲で入力してください')
      return
    }

    startTransition(async () => {
      try {
        await addExerciseAction(today, exerciseName.trim(), durationNum, caloriesNum)
        setExerciseName('')
        setDurationMinutes('')
        setCaloriesBurned('')
      } catch (err) {
        setError(err instanceof Error ? err.message : '登録に失敗しました')
      }
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
      <h2 className="text-base font-semibold text-gray-700 mb-4">運動を記録</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">種目</label>
          <input
            type="text"
            placeholder="ウォーキング、ランニング..."
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800
                       placeholder-gray-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20
                       outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">時間（分）</label>
            <input
              type="number"
              min="1"
              max="600"
              placeholder="30"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800
                         placeholder-gray-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20
                         outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">消費カロリー（kcal）</label>
            <input
              type="number"
              min="0"
              max="5000"
              placeholder="200"
              value={caloriesBurned}
              onChange={(e) => setCaloriesBurned(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800
                         placeholder-gray-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20
                         outline-none transition-all"
            />
          </div>
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

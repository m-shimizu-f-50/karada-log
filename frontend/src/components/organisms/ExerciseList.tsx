'use client'

import { useTransition } from 'react'
import { deleteExerciseAction } from '@/app/(authenticated)/exercise/actions'
import type { ExerciseRecord } from '@/types/exercise'

type Props = {
  records: ExerciseRecord[]
}

export default function ExerciseList({ records }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteExerciseAction(id)
    })
  }

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
        <p className="text-sm text-gray-400 text-center py-4">記録がありません</p>
      </div>
    )
  }

  const totalCalories = records.reduce((sum, r) => sum + r.caloriesBurned, 0)
  const totalMinutes = records.reduce((sum, r) => sum + r.durationMinutes, 0)

  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-700">記録一覧</h2>
        <span className="text-sm font-semibold text-sky-600">{totalCalories} kcal</span>
      </div>

      <ul className="space-y-2">
        {records.map((record) => (
          <li
            key={record.id}
            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <div>
              <p className="text-sm font-medium text-gray-800">{record.exerciseName}</p>
              <p className="text-xs text-sky-500 mt-0.5">
                {record.durationMinutes}分 · {record.caloriesBurned} kcal
              </p>
            </div>
            <button
              onClick={() => handleDelete(record.id)}
              disabled={isPending}
              className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50 px-2 py-1"
            >
              削除
            </button>
          </li>
        ))}
      </ul>

      <p className="text-xs text-gray-400 mt-3 text-right">合計 {totalMinutes} 分</p>
    </div>
  )
}

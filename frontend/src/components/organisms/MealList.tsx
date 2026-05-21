'use client'

import { useTransition } from 'react'
import { deleteMealAction } from '@/app/(authenticated)/meal/actions'
import type { MealRecord } from '@/types/meal'

type Props = {
  records: MealRecord[]
}

export default function MealList({ records }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteMealAction(id)
    })
  }

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
        <p className="text-sm text-gray-400 text-center py-4">記録がありません</p>
      </div>
    )
  }

  const total = records.reduce((sum, r) => sum + r.calories, 0)

  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-700">記録一覧</h2>
        <span className="text-sm font-semibold text-sky-600">{total} kcal</span>
      </div>

      <ul className="space-y-2">
        {records.map((record) => (
          <li
            key={record.id}
            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <div>
              <p className="text-sm font-medium text-gray-800">{record.foodName}</p>
              <p className="text-xs text-sky-500 mt-0.5">{record.calories} kcal</p>
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
    </div>
  )
}

'use client'

import { useTransition } from 'react'
import { deleteWeightAction } from '@/app/(authenticated)/weight/actions'
import type { WeightRecord } from '@/types/weight'

type Props = {
  records: WeightRecord[]
}

export default function WeightHistory({ records }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteWeightAction(id)
    })
  }

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
        <h2 className="text-base font-semibold text-gray-700 mb-4">記録一覧</h2>
        <p className="text-sm text-gray-400 text-center py-6">記録がありません</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
      <h2 className="text-base font-semibold text-gray-700 mb-4">記録一覧</h2>

      <ul className="space-y-2">
        {/* 新しい順に表示 */}
        {[...records].reverse().map((record) => (
          <li
            key={record.id}
            className="flex items-center justify-between rounded-xl bg-sky-50 px-4 py-3"
          >
            <div>
              <span className="text-xs text-gray-400">{record.date}</span>
              <p className="text-base font-semibold text-gray-800">
                {record.weight} <span className="text-xs font-normal text-gray-500">kg</span>
              </p>
            </div>

            <button
              onClick={() => handleDelete(record.id)}
              disabled={isPending}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-400
                         hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

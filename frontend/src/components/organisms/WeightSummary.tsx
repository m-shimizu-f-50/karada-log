import type { WeightRecord, WeightGoal } from '@/types/weight'

type Props = {
  records: WeightRecord[]
  goal: WeightGoal
}

export default function WeightSummary({ records, goal }: Props) {
  const latest = records[0] ?? null
  const diff =
    latest && goal.targetWeight != null ? latest.weight - goal.targetWeight : null

  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
      <p className="text-xs text-gray-500 mb-3">今日の体重</p>

      {latest ? (
        <div className="flex items-end gap-3">
          <p className="text-3xl font-bold text-gray-800">
            {latest.weight}
            <span className="text-base font-normal text-gray-500 ml-1">kg</span>
          </p>
          {diff !== null && (
            <p className={`text-sm font-semibold mb-1 ${diff <= 0 ? 'text-emerald-500' : 'text-rose-400'}`}>
              目標まで {diff <= 0 ? `${Math.abs(diff).toFixed(1)}kg 達成` : `${diff.toFixed(1)}kg`}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400">記録がありません</p>
      )}

      {goal.targetWeight != null && (
        <p className="text-xs text-gray-400 mt-2">目標: {goal.targetWeight} kg</p>
      )}
    </div>
  )
}

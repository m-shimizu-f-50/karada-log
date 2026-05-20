import { apiFetch } from '@/lib/api-client'
import type { WeightRecord, WeightGoal } from '@/types/weight'
import WeightForm from '@/components/organisms/WeightForm'
import WeightGoalForm from '@/components/organisms/WeightGoalForm'
import WeightChart from '@/components/organisms/WeightChart'
import WeightHistory from '@/components/organisms/WeightHistory'

// バックエンドから体重記録と目標体重をまとめて取得する
async function fetchWeightData(): Promise<{ records: WeightRecord[]; goal: WeightGoal }> {
  const [recordsRes, goalRes] = await Promise.all([
    apiFetch('/api/weight'),
    apiFetch('/api/weight/goal'),
  ])

  const records: WeightRecord[] = recordsRes.ok ? await recordsRes.json() : []
  const goal: WeightGoal = goalRes.ok ? await goalRes.json() : { targetWeight: null }

  return { records, goal }
}

export default async function WeightPage() {
  const { records, goal } = await fetchWeightData()

  return (
    <div className="px-4 py-6 space-y-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800">体重記録</h1>

      {/* グラフ */}
      <WeightChart records={records} goal={goal} />

      {/* 体重入力フォーム */}
      <WeightForm />

      {/* 目標体重フォーム */}
      <WeightGoalForm goal={goal} />

      {/* 記録一覧 */}
      <WeightHistory records={records} />
    </div>
  )
}

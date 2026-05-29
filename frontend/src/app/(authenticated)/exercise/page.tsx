import { apiFetch } from '@/lib/api-client'
import type { ExerciseRecord } from '@/types/exercise'
import ExerciseForm from '@/components/organisms/ExerciseForm'
import ExerciseList from '@/components/organisms/ExerciseList'

function getTodayString() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

async function fetchExerciseRecords(date: string): Promise<ExerciseRecord[]> {
  const res = await apiFetch(`/api/exercise?date=${date}`)
  return res.ok ? res.json() : []
}

export default async function ExercisePage() {
  const today = getTodayString()
  const records = await fetchExerciseRecords(today)

  const totalCalories = records.reduce((sum, r) => sum + r.caloriesBurned, 0)

  return (
    <div className="px-4 py-6 space-y-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800">運動記録</h1>

      {/* 合計消費カロリー */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl border border-sky-100 p-5">
        <p className="text-xs text-gray-500 mb-1">今日の合計消費カロリー</p>
        <p className="text-3xl font-bold text-sky-600">
          {totalCalories}
          <span className="text-base font-normal text-gray-500 ml-1">kcal</span>
        </p>
      </div>

      <ExerciseForm today={today} />
      <ExerciseList records={records} />
    </div>
  )
}

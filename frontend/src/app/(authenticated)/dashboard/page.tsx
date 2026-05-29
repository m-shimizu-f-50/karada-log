import Link from 'next/link'
import { auth } from '@/lib/auth'
import { apiFetch } from '@/lib/api-client'
import type { WeightRecord, WeightGoal } from '@/types/weight'
import type { MealRecord } from '@/types/meal'
import type { ExerciseRecord } from '@/types/exercise'
import WeightSummary from '@/components/organisms/WeightSummary'
import CalorieSummary from '@/components/organisms/CalorieSummary'

function getTodayString() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

async function fetchDashboardData(today: string) {
  const [weightRes, goalRes, mealRes, exerciseRes] = await Promise.all([
    apiFetch('/api/weight'),
    apiFetch('/api/weight/goal'),
    apiFetch(`/api/meal?date=${today}`),
    apiFetch(`/api/exercise?date=${today}`),
  ])

  const weightRecords: WeightRecord[] = weightRes.ok ? await weightRes.json() : []
  const goal: WeightGoal = goalRes.ok ? await goalRes.json() : { targetWeight: null }
  const mealRecords: MealRecord[] = mealRes.ok ? await mealRes.json() : []
  const exerciseRecords: ExerciseRecord[] = exerciseRes.ok ? await exerciseRes.json() : []

  return { weightRecords, goal, mealRecords, exerciseRecords }
}

export default async function DashboardPage() {
  const session = await auth()
  const today = getTodayString()
  const { weightRecords, goal, mealRecords, exerciseRecords } = await fetchDashboardData(today)

  const caloriesIn = mealRecords.reduce((sum, r) => sum + r.calories, 0)
  const caloriesOut = exerciseRecords.reduce((sum, r) => sum + r.caloriesBurned, 0)

  return (
    <div className="px-4 py-6 space-y-4 max-w-xl mx-auto">
      <div>
        <p className="text-gray-400 text-sm">
          {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="mt-1 text-xl font-bold text-gray-800">
          こんにちは、{session?.user?.name?.split(' ')[0]} さん
        </h1>
      </div>

      <WeightSummary records={weightRecords} goal={goal} />
      <CalorieSummary caloriesIn={caloriesIn} caloriesOut={caloriesOut} />

      {/* ナビゲーションボタン */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { href: '/weight', label: '体重記録' },
          { href: '/meal', label: '食事記録' },
          { href: '/exercise', label: '運動記録' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-center rounded-2xl border border-sky-100 bg-white
                       py-4 text-sm font-semibold text-sky-600 shadow-sm
                       hover:bg-sky-50 transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}

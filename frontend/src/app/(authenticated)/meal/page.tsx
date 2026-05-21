import { apiFetch } from '@/lib/api-client'
import type { MealRecord } from '@/types/meal'
import MealContainer from '@/components/organisms/MealContainer'

function getTodayString() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

async function fetchMealRecords(date: string): Promise<MealRecord[]> {
  const res = await apiFetch(`/api/meal?date=${date}`)
  return res.ok ? res.json() : []
}

export default async function MealPage() {
  const today = getTodayString()
  const records = await fetchMealRecords(today)

  return (
    <div className="px-4 py-6 space-y-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800">食事記録</h1>
      <MealContainer records={records} today={today} />
    </div>
  )
}

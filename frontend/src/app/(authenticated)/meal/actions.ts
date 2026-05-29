'use server'

import { apiFetch } from '@/lib/api-client'
import { revalidatePath } from 'next/cache'

export async function addMealAction(
  date: string,
  mealType: string,
  foodName: string,
  calories: number
) {
  const res = await apiFetch('/api/meal', {
    method: 'POST',
    body: JSON.stringify({ date, mealType, foodName, calories }),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error ?? '登録に失敗しました')
  }
  revalidatePath('/meal')
}

export async function deleteMealAction(id: string) {
  const res = await apiFetch(`/api/meal/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error ?? '削除に失敗しました')
  }
  revalidatePath('/meal')
}

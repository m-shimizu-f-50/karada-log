'use server'

import { apiFetch } from '@/lib/api-client'
import { revalidatePath } from 'next/cache'

export async function addExerciseAction(
  date: string,
  exerciseName: string,
  durationMinutes: number,
  caloriesBurned: number
) {
  const res = await apiFetch('/api/exercise', {
    method: 'POST',
    body: JSON.stringify({ date, exerciseName, durationMinutes, caloriesBurned }),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error ?? '登録に失敗しました')
  }
  revalidatePath('/exercise')
}

export async function deleteExerciseAction(id: string) {
  const res = await apiFetch(`/api/exercise/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error ?? '削除に失敗しました')
  }
  revalidatePath('/exercise')
}

'use server'

import { apiFetch } from '@/lib/api-client'
import { revalidatePath } from 'next/cache'

// 体重を登録する（同じ日付があれば上書き）
export async function addWeightAction(date: string, weight: number) {
  const res = await apiFetch('/api/weight', {
    method: 'POST',
    body: JSON.stringify({ date, weight }),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error ?? '登録に失敗しました')
  }
  revalidatePath('/weight') // ページのデータを再取得する
}

// 体重記録を削除する
export async function deleteWeightAction(id: string) {
  const res = await apiFetch(`/api/weight/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error ?? '削除に失敗しました')
  }
  revalidatePath('/weight')
}

// 目標体重を登録・更新する
export async function updateGoalAction(targetWeight: number) {
  const res = await apiFetch('/api/weight/goal', {
    method: 'PUT',
    body: JSON.stringify({ targetWeight }),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error ?? '更新に失敗しました')
  }
  revalidatePath('/weight')
}

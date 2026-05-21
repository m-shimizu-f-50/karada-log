'use client'

import { useState } from 'react'
import type { MealType, MealRecord } from '@/types/meal'
import { MEAL_TYPES } from '@/types/meal'
import MealTabBar from './MealTabBar'
import MealForm from './MealForm'
import MealList from './MealList'

type Props = {
  records: MealRecord[]
  today: string
}

export default function MealContainer({ records, today }: Props) {
  const [activeTab, setActiveTab] = useState<MealType>('breakfast')

  const caloriesByType = MEAL_TYPES.reduce(
    (acc, type) => {
      acc[type] = records
        .filter((r) => r.mealType === type)
        .reduce((sum, r) => sum + r.calories, 0)
      return acc
    },
    {} as Record<MealType, number>
  )

  const totalCalories = MEAL_TYPES.reduce((sum, type) => sum + caloriesByType[type], 0)
  const filteredRecords = records.filter((r) => r.mealType === activeTab)

  return (
    <div className="space-y-4">
      {/* 合計摂取カロリー */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl border border-sky-100 p-5">
        <p className="text-xs text-gray-500 mb-1">今日の合計摂取カロリー</p>
        <p className="text-3xl font-bold text-sky-600">
          {totalCalories}
          <span className="text-base font-normal text-gray-500 ml-1">kcal</span>
        </p>
      </div>

      {/* 食事区分タブ */}
      <MealTabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        caloriesByType={caloriesByType}
      />

      {/* 入力フォーム */}
      <MealForm activeTab={activeTab} today={today} />

      {/* 記録一覧 */}
      <MealList records={filteredRecords} />
    </div>
  )
}

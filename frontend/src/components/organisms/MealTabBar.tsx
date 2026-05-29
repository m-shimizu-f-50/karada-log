'use client'

import type { MealType } from '@/types/meal'
import { MEAL_TYPES, MEAL_TYPE_LABELS } from '@/types/meal'

type Props = {
  activeTab: MealType
  onTabChange: (tab: MealType) => void
  caloriesByType: Record<MealType, number>
}

export default function MealTabBar({ activeTab, onTabChange, caloriesByType }: Props) {
  return (
    <div className="grid grid-cols-4 gap-1 bg-gray-100 rounded-xl p-1">
      {MEAL_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onTabChange(type)}
          className={`rounded-lg py-2 text-xs font-medium transition-all ${
            activeTab === type
              ? 'bg-white text-sky-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div>{MEAL_TYPE_LABELS[type]}</div>
          <div className="mt-0.5 text-gray-400">{caloriesByType[type]} kcal</div>
        </button>
      ))}
    </div>
  )
}

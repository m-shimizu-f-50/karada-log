export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: '朝食',
  lunch: '昼食',
  dinner: '夕食',
  snack: '間食',
}

export const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

export type MealRecord = {
  id: string
  date: string
  mealType: MealType
  foodName: string
  calories: number
  createdAt: string
}

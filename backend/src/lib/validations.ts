import { z } from 'zod'

export const weightSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日付は YYYY-MM-DD 形式で入力してください'),
  weight: z.number().min(20, '体重は20kg以上で入力してください').max(300, '体重は300kg以下で入力してください'),
})

export const weightGoalSchema = z.object({
  targetWeight: z.number().min(20, '目標体重は20kg以上で入力してください').max(300, '目標体重は300kg以下で入力してください'),
})

export const mealSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  foodName: z.string().min(1).max(50),
  calories: z.number().int().min(0).max(5000),
})

export const exerciseSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  exerciseName: z.string().min(1).max(50),
  durationMinutes: z.number().int().min(1).max(600),
  caloriesBurned: z.number().int().min(0).max(5000),
})

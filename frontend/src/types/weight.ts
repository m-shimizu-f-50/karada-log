export type WeightRecord = {
  id: string
  date: string       // YYYY-MM-DD 形式
  weight: number     // kg
  createdAt: string
}

export type WeightGoal = {
  id?: string
  targetWeight: number | null
  updatedAt?: string
}

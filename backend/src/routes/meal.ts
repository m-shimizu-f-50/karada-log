import { Hono } from 'hono'
import { prisma } from '../lib/db.js'
import { authMiddleware, type AuthVariables } from '../middleware/auth.js'
import { mealSchema } from '../lib/validations.js'

const meal = new Hono<{ Variables: AuthVariables }>()

meal.use('*', authMiddleware)

// GET /api/meal?date=YYYY-MM-DD — 指定日の食事記録を取得
meal.get('/', async (c) => {
  const userId = c.get('userId')
  const dateParam = c.req.query('date')

  if (!dateParam || !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    return c.json({ error: '日付は YYYY-MM-DD 形式で指定してください' }, 400)
  }

  const date = new Date(dateParam)

  const records = await prisma.mealRecord.findMany({
    where: { userId, date },
    orderBy: { createdAt: 'asc' },
  })

  return c.json(
    records.map((r) => ({
      id: r.id,
      date: r.date.toISOString().split('T')[0],
      mealType: r.mealType,
      foodName: r.foodName,
      calories: r.calories,
      createdAt: r.createdAt,
    }))
  )
})

// POST /api/meal — 食事記録を登録
meal.post('/', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const result = mealSchema.safeParse(body)

  if (!result.success) {
    return c.json({ error: result.error.issues[0].message }, 400)
  }

  const { date, mealType, foodName, calories } = result.data
  const dateObj = new Date(date)

  const record = await prisma.mealRecord.create({
    data: { userId, date: dateObj, mealType, foodName, calories },
  })

  return c.json({
    id: record.id,
    date,
    mealType: record.mealType,
    foodName: record.foodName,
    calories: record.calories,
    createdAt: record.createdAt,
  })
})

// DELETE /api/meal/:id — 食事記録を削除
meal.delete('/:id', async (c) => {
  const userId = c.get('userId')
  const id = c.req.param('id')

  const record = await prisma.mealRecord.findUnique({ where: { id } })
  if (!record) return c.json({ error: '記録が見つかりません' }, 404)
  if (record.userId !== userId) return c.json({ error: 'アクセスが拒否されました' }, 403)

  await prisma.mealRecord.delete({ where: { id } })
  return c.json({ message: '削除しました' })
})

export default meal

import { Hono } from 'hono'
import { prisma } from '../lib/db.js'
import { authMiddleware, type AuthVariables } from '../middleware/auth.js'
import { exerciseSchema } from '../lib/validations.js'

const exercise = new Hono<{ Variables: AuthVariables }>()

exercise.use('*', authMiddleware)

// GET /api/exercise?date=YYYY-MM-DD — 指定日の運動記録を取得
exercise.get('/', async (c) => {
  const userId = c.get('userId')
  const dateParam = c.req.query('date')

  if (!dateParam || !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    return c.json({ error: '日付は YYYY-MM-DD 形式で指定してください' }, 400)
  }

  const date = new Date(dateParam)

  const records = await prisma.exerciseRecord.findMany({
    where: { userId, date },
    orderBy: { createdAt: 'asc' },
  })

  return c.json(
    records.map((r) => ({
      id: r.id,
      date: r.date.toISOString().split('T')[0],
      exerciseName: r.exerciseName,
      durationMinutes: r.durationMinutes,
      caloriesBurned: r.caloriesBurned,
      createdAt: r.createdAt,
    }))
  )
})

// POST /api/exercise — 運動記録を登録
exercise.post('/', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const result = exerciseSchema.safeParse(body)

  if (!result.success) {
    return c.json({ error: result.error.issues[0].message }, 400)
  }

  const { date, exerciseName, durationMinutes, caloriesBurned } = result.data
  const dateObj = new Date(date)

  const record = await prisma.exerciseRecord.create({
    data: { userId, date: dateObj, exerciseName, durationMinutes, caloriesBurned },
  })

  return c.json({
    id: record.id,
    date,
    exerciseName: record.exerciseName,
    durationMinutes: record.durationMinutes,
    caloriesBurned: record.caloriesBurned,
    createdAt: record.createdAt,
  })
})

// DELETE /api/exercise/:id — 運動記録を削除
exercise.delete('/:id', async (c) => {
  const userId = c.get('userId')
  const id = c.req.param('id')

  const record = await prisma.exerciseRecord.findUnique({ where: { id } })
  if (!record) return c.json({ error: '記録が見つかりません' }, 404)
  if (record.userId !== userId) return c.json({ error: 'アクセスが拒否されました' }, 403)

  await prisma.exerciseRecord.delete({ where: { id } })
  return c.json({ message: '削除しました' })
})

export default exercise

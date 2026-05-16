import { Hono } from 'hono'
import { prisma } from '../lib/db.js'
import { authMiddleware, type AuthVariables } from '../middleware/auth.js'
import { weightSchema, weightGoalSchema } from '../lib/validations.js'

const weight = new Hono<{ Variables: AuthVariables }>()

// すべてのルートに認証ミドルウェアを適用
weight.use('*', authMiddleware)

// GET /api/weight — 直近30件を日付昇順で取得（グラフ用）
weight.get('/', async (c) => {
  const userId = c.get('userId')

  const records = await prisma.weightRecord.findMany({
    where: { userId },
    orderBy: { date: 'asc' },
    take: 30,
  })

  return c.json(
    records.map((r) => ({
      id: r.id,
      date: r.date.toISOString().split('T')[0],
      weight: Number(r.weight),
      createdAt: r.createdAt,
    }))
  )
})

// GET /api/weight/goal — 目標体重を取得
// NOTE: /:id より先に定義しないと /goal が ID として解釈されてしまう
weight.get('/goal', async (c) => {
  const userId = c.get('userId')

  const goal = await prisma.weightGoal.findUnique({ where: { userId } })
  if (!goal) return c.json({ targetWeight: null })

  return c.json({
    id: goal.id,
    targetWeight: Number(goal.targetWeight),
    updatedAt: goal.updatedAt,
  })
})

// POST /api/weight — 体重を登録（同日は上書き）
weight.post('/', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const result = weightSchema.safeParse(body)

  if (!result.success) {
    return c.json({ error: result.error.issues[0].message }, 400)
  }

  const { date, weight: weightValue } = result.data
  const dateObj = new Date(date)

  // 同じ日の記録があれば上書き、なければ新規作成
  const record = await prisma.weightRecord.upsert({
    where: { userId_date: { userId, date: dateObj } },
    create: { userId, date: dateObj, weight: weightValue },
    update: { weight: weightValue },
  })

  return c.json({
    id: record.id,
    date,
    weight: Number(record.weight),
    createdAt: record.createdAt,
  })
})

// DELETE /api/weight/:id — 体重記録を削除
weight.delete('/:id', async (c) => {
  const userId = c.get('userId')
  const id = c.req.param('id')

  const record = await prisma.weightRecord.findUnique({ where: { id } })
  if (!record) return c.json({ error: '記録が見つかりません' }, 404)
  if (record.userId !== userId) return c.json({ error: 'アクセスが拒否されました' }, 403)

  await prisma.weightRecord.delete({ where: { id } })
  return c.json({ message: '削除しました' })
})

// PUT /api/weight/goal — 目標体重を登録・更新
weight.put('/goal', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const result = weightGoalSchema.safeParse(body)

  if (!result.success) {
    return c.json({ error: result.error.issues[0].message }, 400)
  }

  const { targetWeight } = result.data

  const goal = await prisma.weightGoal.upsert({
    where: { userId },
    create: { userId, targetWeight },
    update: { targetWeight },
  })

  return c.json({
    id: goal.id,
    targetWeight: Number(goal.targetWeight),
    updatedAt: goal.updatedAt,
  })
})

export default weight

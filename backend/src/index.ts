import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { AuthVariables } from './middleware/auth.js'

const app = new Hono<{ Variables: AuthVariables }>()

app.use(
  '*',
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  })
)

app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

const port = Number(process.env.PORT) || 8080

serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on http://localhost:${port}`)
})

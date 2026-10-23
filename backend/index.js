import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import session from '@fastify/session'

import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import registerGetRoutes from './routes/get/index.js'
import registerPostRoutes from './routes/post.js'
import registerPutRoutes from './routes/put.js'
import registerDeleteRoutes from './routes/delete.js'

const fastify = Fastify({ logger: true })

await fastify.register(cookie)

// i dont understand cookieName, and httpOnly, and NODE_ENV , and sameSite
await fastify.register(session, {
  secret: process.env.SESSION_SECRET,
  cookieName: 'recipiz.sid',
  cookie: {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 // 24 h, en secondes
  },
  saveUninitialized: false
})

fastify.register(cors, {
    origin: process.env.RECIPIZ_FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
})

fastify.register(rateLimit, {
    global: true,
    max: 200,
    timeWindow: '1 minute'
})

// Enregistrer les routes
registerGetRoutes(fastify)
registerPostRoutes(fastify)
registerPutRoutes(fastify)
registerDeleteRoutes(fastify)

fastify.listen({ port: Number(process.env.RECIPIZ_BACKEND_PORT) }, err => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})



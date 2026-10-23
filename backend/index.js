import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import registerGetRoutes from './routes/get/index.js'
import registerPostRoutes from './routes/post.js'
import registerPutRoutes from './routes/put.js'
import registerDeleteRoutes from './routes/delete.js'

const fastify = Fastify({ logger: true })


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



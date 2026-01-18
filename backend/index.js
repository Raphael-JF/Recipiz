import Fastify from 'fastify'
import cors from '@fastify/cors'
import pool from './db.js'
import registerGetRoutes from './routes/get.js'
import registerPostRoutes from './routes/post.js'
import registerPutRoutes from './routes/put.js'
import registerDeleteRoutes from './routes/delete.js'

const fastify = Fastify({ logger: true })

fastify.register(cors, {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
})

// Enregistrer les routes
registerGetRoutes(fastify)
registerPostRoutes(fastify)
registerPutRoutes(fastify)
registerDeleteRoutes(fastify)

fastify.listen({ port: 3000 }, err => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})


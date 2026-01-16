import Fastify from 'fastify'
import cors from '@fastify/cors'

const fastify = Fastify({ logger: true })

// 🔓 Autoriser le frontend
fastify.register(cors, {
  origin: 'http://localhost:5173'
})

fastify.get('/recipes', async () => {
  return [
    { id: 1, title: 'Pâtes carbo' },
    { id: 2, title: 'Riz curry' },
    { id: 3, title: 'Lasagnes au thon' },
  ]
})

fastify.listen({ port: 3000 }, err => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})

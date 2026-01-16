import Fastify from 'fastify'
import cors from '@fastify/cors'
import pool from './db.js'

const fastify = Fastify({ logger: true })

fastify.register(cors, {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
})


fastify.get('/recipes', async () => {
    const result = await pool.query('SELECT * FROM recipes ORDER BY id')
    return result.rows
})

fastify.listen({ port: 3000 }, err => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})

fastify.post('/recipes', async (request, reply) => {
    const { title, description } = request.body
    
    if (!title) {
        reply.code(400)
        return { error: 'title is required' }
    }
    
    const result = await pool.query(
        'INSERT INTO recipes (title, description) VALUES ($1, $2) RETURNING *',
        [title, description]
    )
    
    reply.code(201)
    return result.rows[0]
})


fastify.get('/recipes/:id', async (request, reply) => {
    const { id } = request.params
    
    const result = await pool.query(
        'SELECT * FROM recipes WHERE id = $1',
        [id]
    )
    
    if (result.rows.length === 0) {
        reply.code(404)
        return { error: 'Recipe not found' }
    }
    
    return result.rows[0]
})

fastify.delete('/recipes/:id', async (request, reply) => {
    const { id } = request.params
    
    const result = await pool.query(
        'DELETE FROM recipes WHERE id = $1 RETURNING *',
        [id]
    )
    
    if (result.rowCount === 0) {
        reply.code(404)
        return { error: 'Recipe not found' }
    }
    
    return { success: true }
})

fastify.put('/recipes/:id', async (request, reply) => {
  const { id } = request.params
  const { title, description } = request.body

  if (!title) {
    reply.code(400)
    return { error: 'title is required' }
  }

  const result = await pool.query(
    'UPDATE recipes SET title = $1, description = $2 WHERE id = $3 RETURNING *',
    [title, description, id]
  )

  if (result.rowCount === 0) {
    reply.code(404)
    return { error: 'Recipe not found' }
  }

  return result.rows[0]
})

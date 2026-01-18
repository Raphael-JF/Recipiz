import pool from '../db.js'

export default function registerPutRoutes(fastify) {
    fastify.put('/recipes/:id', async (request, reply) => {
        const { id } = request.params
        const { title, instructions, ingredients } = request.body

        const updates = []
        const values = []
        let paramIndex = 1

        if (title) {
            updates.push(`title = $${paramIndex}`)
            values.push(title)
            paramIndex++
        }

        if (instructions) {
            updates.push(`instructions = $${paramIndex}`)
            values.push(instructions)
            paramIndex++
        }

        if (ingredients) {
            updates.push(`ingredients = $${paramIndex}`)
            values.push(ingredients)
            paramIndex++
        }

        if (updates.length === 0) {
            reply.code(400)
            return { error: 'At least one field is required' }
        }

        values.push(id)
        const query = `UPDATE recipes SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`

        const result = await pool.query(query, values)

        if (result.rowCount === 0) {
            reply.code(404)
            return { error: 'Recipe not found' }
        }

        return result.rows[0]
    })
}
import pool from '../db.js'

export default function registerDeleteRoutes(fastify) {
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
}
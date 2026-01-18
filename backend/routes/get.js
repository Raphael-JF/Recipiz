import pool from '../db.js'

export default function registerGetRoutes(fastify) {
    fastify.get('/recipes', async () => {
        const result = await pool.query('SELECT * FROM recipes ORDER BY id')
        return result.rows
    })

    fastify.get('/recipes/:id', async (request, reply) => {
        const { id } = request.params

        const result = await pool.query(
            `SELECT
            r.id,
            r.title,
            r.instructions,
            json_agg(
                json_build_object(
                'name', i.name,
                'quantity', ri.quantity,
                'unit', ri.unit
                )
            ) AS ingredients
            FROM recipes r
            JOIN recipe_ingredients ri ON ri.recipe_id = r.id
            JOIN ingredients i ON i.id = ri.ingredient_id
            WHERE r.id = $1
            GROUP BY r.id;`,
            [id]
        )

        if (result.rows.length === 0) {
            reply.code(404)
            return { error: 'Recipe not found' }
        }

        return result.rows[0]
    })
}
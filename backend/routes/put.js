import * as db from '../db.js'
import * as utils from '../utils.js'


export default function registerPutRoutes(fastify) {
  fastify.put('/recipes/:id', async (request, reply) => {
    const { id } = request.params
    const { title, instructions, ingredients } = request.body

    const client = await db.pool.connect()

    try {
      if (!title && !instructions && !ingredients) {
        return reply.code(400).send({ error: 'Aucune donnée à mettre à jour' })
      }

      await client.query('BEGIN')

      const fields = []
      const values = []
      let index = 1

      if (title) {
        fields.push(`title = $${index++}`)
        values.push(title)
      }

      if (instructions) {
        fields.push(`instructions = $${index++}`)
        values.push(instructions)
      }

      if (fields.length > 0) {
        values.push(id)
        const result = await client.query(
          `UPDATE recipes SET ${fields.join(', ')} WHERE id = $${index} RETURNING id`,
          values
        )

        if (result.rowCount === 0) {
          throw new Error('Recette introuvable')
        }
      }

      if (ingredients) {
        await client.query(
          'DELETE FROM recipe_ingredients WHERE recipe_id = $1',
          [id]
        )

        for (const ingredient of ingredients) {
          const ingredientName = utils.normalizeIngredientName(ingredient.name)
          if (!ingredientName) {
            continue
          }

          const ingredientRes = await client.query(
            `INSERT INTO ingredients (name)
             VALUES ($1)
             ON CONFLICT (name)
             DO UPDATE SET name = EXCLUDED.name
             RETURNING id`,
            [ingredientName]
          )

          const ingredientId = ingredientRes.rows[0].id

          await client.query(
            `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
             VALUES ($1, $2, $3, $4)`,
            [id, ingredientId, ingredient.quantity, ingredient.unit]
          )
        }
      }

      await client.query('COMMIT')
      return { success: true }
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  })
}

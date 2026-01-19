import pool from '../db.js'

export default function registerPutRoutes(fastify) {
    fastify.put('/recipes/:id', async (request, reply) => {
  const { id } = request.params
  const { title, instructions, ingredients } = request.body

  const client = await pool.connect()

  try {
    if (!title && !instructions && !ingredients) {
        return reply.code(400).send({ error: 'Aucune donnée à mettre à jour' })
    }

    await client.query('BEGIN')
    
    // 1️⃣ update recette
    fields = []
    values = []
    let i = 1

    if (title) {
      fields.push(`title = $${i++}`)
      values.push(title)
    }

    if (instructions) {
      fields.push(`instructions = $${i++}`)
      values.push(instructions)
    }


        
    if (fields.length > 0) {
        values.push(id)
        const result = await client.query(
            `UPDATE recipes SET ${fields.join(', ')} WHERE id = $${i} RETURNING id`,
            values
        )
        if (result.rowCount === 0) {
            throw new Error('Recette introuvable')
        }
    }
    
    // 2️⃣ mettre à jour les ingrédients
        if (ingredients) {
        // supprimer anciens liens
        await client.query(
            'DELETE FROM recipe_ingredients WHERE recipe_id = $1',
            [id]
        )

        for (const ing of ingredients) {
            // trouver ou créer l’ingrédient
            let res = await client.query(
                'SELECT id FROM ingredients WHERE name = $1',
                [ing.name]
            )
            let ingredientId
            if (res.rows.length > 0) {
                ingredientId = res.rows[0].id
            } else {
                res = await client.query(
                    'INSERT INTO ingredients (name) VALUES ($1) RETURNING id',
                    [ing.name]
                )
                ingredientId = res.rows[0].id
            }


            // lier à la recette
            await client.query(
                `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES ($1, $2, $3, $4)`,
                [id, ingredientId, ing.quantity, ing.unit]
            )
        }
    }

    await client.query('COMMIT')
    return { success: true }

    } catch (err) {
        await client.query('ROLLBACK')
        throw err
    } finally {
        client.release()
    }
    })

}
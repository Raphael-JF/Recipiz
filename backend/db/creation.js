// returns the id of the ingredient, whether it was newly inserted or already existed
export async function upsertIngredient(client, ingredientName) {
  const ingredientRes = await client.query(
    `INSERT INTO ingredients (name)
     VALUES ($1)
     ON CONFLICT (name)
     DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [ingredientName]
  )

  return ingredientRes.rows[0].id
}

export async function bindRecipeIngredients(client, recipeId, ingredients) {

  for (const { name, quantity, unit } of ingredients) {
    const ingredientId = await upsertIngredient(client, name)
    await client.query(
      `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
       VALUES ($1, $2, $3, $4)`,
      [recipeId, ingredientId, quantity, unit]
    )
  }
}

export async function insertRecipeWithIngredients(client, title, instructions, ingredients) {
  const recipeId = (await client.query(
    `INSERT INTO recipes (title, instructions)
     VALUES ($1, $2)
     RETURNING id`,
    [title, instructions]
  )).rows[0].id

  await bindRecipeIngredients(client, recipeId, ingredients) 
}

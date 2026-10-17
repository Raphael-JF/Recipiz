// returns the id of the ingredient, whether it was newly inserted or already existed
export async function upsertIngredient(client, ingredientName) {
  const ingredientRes = await client.query(
    `INSERT INTO ingredients (name)
     VALUES ($1)
     ON CONFLICT (name)
     DO UPDATE SET name = EXCLUDED.name
     RETURNING ingredient_id`,
    [ingredientName]
  )

  return ingredientRes.rows[0].ingredient_id
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

export async function bindRecipeInstructions(client, recipeId, instructions) {
  for (let step = 0; step < instructions.length; step++) {
    await client.query(
      `INSERT INTO recipe_instructions (recipe_id, step, text)
       VALUES ($1, $2, $3)`,
      [recipeId, step, instructions[step]]
    )
  }

}

export async function insertCompleteRecipe(client, title, ingredients, instructions) {
  const recipeId = (await client.query(
    `INSERT INTO recipes (title)
     VALUES ($1)
     RETURNING recipe_id`,
    [title]
  )).rows[0].recipe_id

  let promise1 = bindRecipeIngredients(client, recipeId, ingredients) 
  let promise2 = bindRecipeInstructions(client, recipeId, instructions)
  await Promise.all([promise1, promise2])
}

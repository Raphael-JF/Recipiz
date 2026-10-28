import { resetRecipe } from './destruction.js'

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

export async function upsertTag(client, tagName) {
  const tagRes = await client.query(
    `INSERT INTO tags (name)
     VALUES ($1)
     ON CONFLICT (name)
     DO UPDATE SET name = EXCLUDED.name
     RETURNING tag_id`,
    [tagName]
  )

  return tagRes.rows[0].tag_id
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
      [recipeId, step, instructions[step].text ? instructions[step].text : instructions[step]]
    )
  }
}


export async function bindRecipeTags(client, recipeId, tags) {
  for (const tag of tags) {
    const name = tag.name ? tag.name : tag
    const tagId = await upsertTag(client, name)
    await client.query(
      `INSERT INTO recipe_tags (recipe_id, tag_id)
       VALUES ($1, $2)`,
      [recipeId, tagId]
    )
  }
}

export async function insertCompleteRecipe(client, recipe) {
  const { title, description, ingredients, instructions, tags } = recipe

  const recipeId = (await client.query(
    `INSERT INTO recipes (title, description)
      VALUES ($1, $2)
     RETURNING recipe_id`,
    [title, description]
  )).rows[0].recipe_id


  let promise1 = bindRecipeIngredients(client, recipeId, ingredients) 
  let promise2 = bindRecipeInstructions(client, recipeId, instructions)
  let promise3 = bindRecipeTags(client, recipeId, tags)
  await Promise.all([promise1, promise2])
}

export async function completeRecipeById(client, recipeId, recipe) {
  const { title, description, ingredients, instructions, tags } = recipe
  
  await resetRecipe(recipeId)

  let r1 =  client.query(
    `UPDATE recipes
     SET title = $1, description = $2
     WHERE recipe_id = $3`,
    [title, description, recipeId]
  )
  let r2 = bindRecipeIngredients(client, recipeId, ingredients)
  let r3 = bindRecipeInstructions(client, recipeId, instructions)
  let r4 = bindRecipeTags(client, recipeId, tags)
  await Promise.all([r1, r2, r3, r4])
}

export async function registerUser(client, username, passwordHash) {
  await client.query(
    `INSERT INTO users (username, password_hash)
     VALUES ($1, $2)`,
    [username, passwordHash]
  )
}


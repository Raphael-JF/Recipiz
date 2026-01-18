import { createEmptyIngredient } from './emptyIngredient'

export function createEmptyRecipe() {
  return {
    title: '',
    ingredients: [
        createEmptyIngredient()
    ],
    instructions: ''
  }
}
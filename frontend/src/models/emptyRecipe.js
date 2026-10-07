import { createEmptyIngredient } from './emptyIngredient'
import { createEmptyInstruction } from './emptyInstruction'

export function createEmptyRecipe() {
  return {
    title: '',
    ingredients: [
      createEmptyIngredient()
    ],
    instructions: [
      createEmptyInstruction()
    ]
  }
}

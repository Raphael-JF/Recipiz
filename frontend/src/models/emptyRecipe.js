import { createEmptyIngredient } from './emptyIngredient'
import { createEmptyInstruction } from './emptyInstruction'
import { createEmptyTag } from './emptyTag'

export function createEmptyRecipe() {
  return {
    title: '',
    description: '',
    ingredients: [
      createEmptyIngredient()
    ],
    instructions: [
      createEmptyInstruction(0)
    ],
    tags: [
      createEmptyTag()
    ]
  }
}

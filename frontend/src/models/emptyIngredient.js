let ingredientCounter = 0

export function createEmptyIngredient() {
  return {
    key: ingredientCounter++,
    name: '',
    quantity: 0,
    unit: ''
  }
}

<template>
  <div class="ingredient-row">
    <input
      class="ingredient-row__name"
      :value="ingredient.name"
      :list="datalistId"
      placeholder="Ingrédient"
      @input="updateIngredient('name', $event.target.value)"
      required
    >
    <input
      class="ingredient-row__quantity"
      :value="ingredient.quantity"
      type="number"
      min="0"
      step="0.01"
      placeholder="Qté"
      @input="updateIngredient('quantity', $event.target.valueAsNumber)"
    >
    <input
      class="ingredient-row__unit"
      :value="ingredient.unit"
      placeholder="g, ml, pièces"
      @input="updateIngredient('unit', $event.target.value)"
    >
    <button type="button" class="danger" @click="$emit('remove')">❌</button>
  </div>
</template>

<script>
export default {
  name: 'IngredientEditorRow',
  props: {
    ingredient: {
      type: Object,
      required: true
    },
    datalistId: {
      type: String,
      default: ''
    }
  },
  emits: ['update', 'remove'],
  methods: {
    updateIngredient(field, value) {
      const safeValue = Number.isNaN(value) ? 0 : value
      this.$emit('update', {
        ...this.ingredient,
        [field]: safeValue
      })
    }
  }
}
</script>

<style scoped>
.ingredient-row {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(80px, 0.7fr) minmax(0, 1fr) auto;
  gap: 0.5rem;
  align-items: center;
}

.ingredient-row input {
  width: 100%;
}

@media (max-width: 680px) {
  .ingredient-row {
    grid-template-columns: 1fr 1fr;
  }

  .ingredient-row__name {
    grid-column: 1 / -1;
  }
}
</style>

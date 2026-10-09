<template>
  <div class="ingredient-row">
    <SearchBar 
      class="ingredient-row__name"
      apiURL = "/matchingIngredients"
      placeholder="Ingrédient"
      className="ingredient-search-bar"
      @change="item.name = $event; this.$emit('update',item)"
    />   

    <input
      class="ingredient-row__quantity"
      :value="item.quantity"
      type="number"
      min="0"
      step="0.01"
      placeholder="Qté"
      @change="this.$emit('update',item)"
    >
    <input
      class="ingredient-row__unit"
      :value="item.unit"
      placeholder="g, ml, pièces"
      @change="this.$emit('update',item)"
    >
    <button type="button" class="danger" @click="$emit('remove')">Supprimer</button>
  </div>
</template>

<script>
import SearchBar from './SearchBar.vue'

export default {
  name: 'IngredientEditorRow',
  components: {
    SearchBar
  },
  props: {
    item: {
      type: Object,
      required: true
    },
  },
  emits: ['update', 'remove'],
  methods: {
    updateIngredient(field, value) {
      this.item[field] = value;
      this.$emit('update', this.item);
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

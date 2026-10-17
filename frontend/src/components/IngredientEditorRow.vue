<template>
  <SearchBar 
    id="name"
    apiURL = "/matchingIngredients"
    placeholder="Ingrédient"
    className="ingredient-search-bar"
    v-model="item.name"
    @update:modelValue="$emit('update', item)"
  />   
  <input
    id="quantity"
    :value="item.quantity"
    type="number"
    min="0"
    step="0.01"
    placeholder="Qté"
    @input="this.$emit('update',item)"
  >
  <input
    id="unit"
    :value="item.unit"
    placeholder="g, ml, pièces"
    @input="this.$emit('update',item)"
  >
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
}
</script>

<style scoped>


#name {
  flex: 3;
}

#quantity {
  flex: 1;
}

#unit {
  flex: 1;
}

</style>

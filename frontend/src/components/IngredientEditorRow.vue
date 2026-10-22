<template>
  <SearchBar
    id="name"
    apiURL="/matchingIngredients"
    placeholder="Ingrédient"
    :model-value="modelValue.name"
    @update:model-value="updateIngredientName"
  />

  <input
    id="quantity"
    :value="modelValue.quantity"
    type="number"
    min="0"
    step="0.01"
    placeholder="Qté"
    @input="updateQuantity($event.target.value)"
  >

  <input
    id="unit"
    :value="modelValue.unit"
    placeholder="g, ml, pièces"
    @input="updateUnit($event.target.value)"
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
    modelValue: {
      type: Object,
      required: true
    }
  },

  emits: ['update:modelValue', 'remove'],

  methods: {
    updateIngredientName(name) {
      this.$emit('update:modelValue', {
        ...this.modelValue,
        name
      })
    },

    updateQuantity(quantity) {
      this.$emit('update:modelValue', {
        ...this.modelValue,
        quantity: quantity === '' ? '' : Number(quantity)
      })
    },

    updateUnit(unit) {
      this.$emit('update:modelValue', {
        ...this.modelValue,
        unit
      })
    }
  }
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

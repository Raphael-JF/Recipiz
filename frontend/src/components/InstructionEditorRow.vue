
<template>
  <div class="instruction-row">
    <input
      :value="item.unit"
      placeholder="Instruction"
      @change="this.$emit('update',item)"
    >
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
      type:Object,
      required: true
    },
  },
  emits: ['update', 'remove'],
}
</script>

<style scoped>
.instruction-row {
}



</style>

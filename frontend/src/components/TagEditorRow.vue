<template>
  <SearchBar
    id="name"
    apiURL="/matchingTags"
    placeholder="Tag de recette"
    :model-value="modelValue.name"
    @update:modelValue="UpdateTagName"
  />
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
    UpdateTagName(name) {
      this.$emit('update:modelValue', {name : name})
    }
  },
}
</script>

<style scoped>
#name {
  flex: 1;
}
</style>

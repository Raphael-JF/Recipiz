<template>
    <input
      class="search-bar__input"
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'Recherche'
    },
    placeholder: {
      type: String,
      default: 'Rechercher...'
    }
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>
.search-bar {
  display: grid;
  gap: 0.4rem;
}

.search-bar__label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #475569;
}

.search-bar__input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.7rem 0.85rem;
  border-radius: 0.7rem;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
}

.search-bar__input:focus {
  outline: 2px solid #93c5fd;
  border-color: #60a5fa;
}
</style>

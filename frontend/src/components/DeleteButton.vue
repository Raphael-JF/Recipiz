<template>
  <button
    type="button"
    class="danger delete-button"
    @click="$emit('click')"
    title="Supprimer"
    aria-label="Supprimer"
  >
    <Trash :size="20" />
    <span v-if="doText">Supprimer</span>
  </button>
</template>

<script>
import { Trash } from 'lucide-vue-next'

export default {
  name: 'DeleteButton',
  components: { Trash },
  props: {
    doText: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click']
}
</script>

<style scoped>
.delete-button {
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}
</style>

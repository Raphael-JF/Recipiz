<template>
  <button
    type="button"
    class="danger delete-button"
    :data-compact="compact"
    @click="$emit('click')"
    title="Supprimer"
    aria-label="Supprimer"
    ref="button"
  >
    <Trash :size="18" />
    <span>Supprimer</span>
  </button>
</template>

<script>
import { Trash } from 'lucide-vue-next'

export default {
  name: 'DeleteButton', 
  components: { Trash },

  emits: ['click'],

  data() {
    return {
      compact: false,
      observer: null
    }
  },

  mounted() {
    this.observer = new ResizeObserver(([entry]) => {
      this.compact = entry.contentRect.width < 110
    })

    this.observer.observe(this.$refs.button)
  },

  beforeUnmount() {
    this.observer.disconnect()
  }
}
</script>

<style scoped>
.delete-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  white-space: nowrap;
  min-width: 0;
}

.delete-button[data-compact="true"] span {
  display: none;
}
</style>

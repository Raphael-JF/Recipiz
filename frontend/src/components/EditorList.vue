<template>
  <draggable
    v-model="items"
    item-key="key"
    handle=".drag-handle"
    class="editor-list"
  >
    <template #item="{ element: item, index }">
      <div class="editor-row">
        <span class="drag-handle" title="Déplacer" aria-hidden="true">⠿</span>
        <component
          :is="component"
          class="editor-row-content"
          :item="item"
          @update="updateItem(index, $event)"
          @remove="removeItem(index)"
        />
      </div>
    </template>
  </draggable>
  <button type="button" class="secondary" @click="addItem">
    ➕ ajouter
  </button>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },

  props: {
    modelValue: {
      type: Array,
      required: true
    },
    component: {
      type: [Object, String],
      required: true
    },
    createItem: {
      type: Function,
      required: true
    }
  },

  computed: {
    items: {
      get() {
        return this.modelValue
      },
      set(value) {
        console.log(this.items[0].id);
        this.$emit('update:modelValue', value)
      }
    }
  },

  emits: ['update:modelValue'],

  methods: {
    addItem() {
      this.$emit('update:modelValue', [
        ...this.modelValue,
        this.createItem()
      ])
    },

    updateItem(index, item) {
      const items = [...this.modelValue]
      items[index] = item

      this.$emit('update:modelValue', items )
    },

    removeItem(index) {
      const items = [...this.modelValue]
      items.splice(index, 1)

      this.$emit('update:modelValue', items )
    }
  }

}
</script>

<style scoped>
.editor-list {
  display: grid;
  gap: 0.6rem;
}

.editor-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.drag-handle {
  cursor: grab;
  user-select: none;
}

.drag-handle:active {
  cursor: grabbing;
}
</style>

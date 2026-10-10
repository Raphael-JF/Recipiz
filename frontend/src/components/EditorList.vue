<template>
  <div class="editor-list-container">
    <draggable
      v-if="!disableDraggable"
      v-model="items"
      item-key="key"
      handle=".drag-handle"
      class="editor-list"
    >
      <template #item="{ element: item, index }">
        <li class="editor-row">
          <span class="drag-handle" title="Déplacer" aria-hidden="true">⠿</span>
          <component
            :is="component"
            class="editor-row-content"
            :item="item"
            @update="updateItem(index, $event)"
            @remove="removeItem(index)"
          />
        </li>
      </template>
    </draggable>

    <ul v-else class="editor-list">
      <li
        v-for="(item, index) in items"
        :key="item.key"
        class="editor-row"
      >
        <component
          :is="component"
          class="editor-row-content"
          :item="item"
          @update="updateItem(index, $event)"
          @remove="removeItem(index)"
        />
      </li>
    </ul>

    <button type="button" class="secondary" @click="addItem">
      ➕ ajouter
    </button>
  </div>
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
    },
    disableDraggable: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    items: {
      get() {
        return this.modelValue
      },
      set(value) {
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

      this.$emit('update:modelValue', items)
    },

    removeItem(index) {
      const items = [...this.modelValue]
      items.splice(index, 1)

      this.$emit('update:modelValue', items)
    }
  }
}
</script>

<style scoped>
.editor-list {
  display: grid;
  gap: 0.6rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.editor-row {
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

.editor-list-container {
  width : 100%;
  display: flex;
  flex-direction: column;
  gap : 0.6rem;
}

</style>

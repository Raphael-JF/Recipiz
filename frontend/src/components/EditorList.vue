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
            :model-value="item"
            @update:model-value="updateItem(index, $event)"
          />
          <DeleteButton @click="removeItem(index)"/>
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
          :model-value="item"
          @update:model-value="updateItem(index, $event)"
        />
        <DeleteButton @click="removeItem(index)"/>
      </li>
    </ul>

    <button type="button" class="secondary" @click="addItem">
      ➕ ajouter
    </button>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import DeleteButton from './DeleteButton.vue'
export default {
  components: {
    draggable,
    DeleteButton
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

  emits: ['update:modelValue', 'new-item'],

  methods: {
    addItem() {
      this.$emit('new-item')
    },

    // in case a specific item changes i.e. the user edits it
    updateItem(index, updatedItem) {
      const newItems = [...this.modelValue] // shallow copy
      newItems[index] = updatedItem

      this.$emit('update:modelValue', newItems) // emit the updated array
    },

    removeItem(index) {
      this.items.splice(index, 1)
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
  width: 100%;
  box-sizing: border-box;
}

.editor-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  box-sizing: border-box;
}

.drag-handle {
  cursor: grab;
  user-select: none;
  display:flex;
  align-items:center;
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

<template>
  <div class="search-bar">

    <input
      ref="input"
      v-model="search"
      type="text"
      :placeholder="placeholder"
      @keydown="handleKeydown"
    >

    <!-- Suggestions -->
    <div
      v-if="search && suggestions.length"
      class="suggestions"
    >
      <button
        v-for="(item, index) in suggestions"
        :key="item.id"
        :class="{ selected: index === selectedIndex }"
        @mousedown.prevent="selectSuggestion(index)"
      >
        {{ getLabel(item) }}
      </button>
    </div>

  </div>
</template>



<script>
import Fuse from 'fuse.js'

export default {
  name: 'SearchBar',

  props: {
    items: {
      type: Array,
      default: () => []
    },

    keys: {
      type: Array,
      default: () => []
    },

    placeholder: {
      type: String,
      default: 'Rechercher...'
    }
  },

  data() {
    return {
      search: '',
      suggestionSearch: '',
      selectedIndex: -1
    }
  },

  computed: {
    fuse() {
      return new Fuse(this.items, {
        keys: this.keys,
        threshold: 0.4
      })
    },

    suggestions() {
      if (!this.search.trim()) {
        return []
      }

      return this.fuse
        .search(this.suggestionSearch)
        .map(result => result.item)
        .slice(0, 5)
    }
  },

  watch: {
    search() {
      this.selectedIndex = -1
    }
  },

  methods: {
    getLabel(item) {
      return item.title ?? item.name ?? item.id
    },

    handleKeydown(event) {
      if (event.key === 'ArrowDown') {
        event.preventDefault()

        if (!this.suggestions.length) {
          return
        }

        this.selectedIndex =
          (this.selectedIndex + 1) % this.suggestions.length

        this.search = this.getLabel(
          this.suggestions[this.selectedIndex]
        )
      }

      else if (event.key === 'ArrowUp') {
        event.preventDefault()

        if (!this.suggestions.length) {
          return
        }

        this.selectedIndex =
          this.selectedIndex <= 0
            ? this.suggestions.length - 1
            : this.selectedIndex - 1

        this.search = this.getLabel(
          this.suggestions[this.selectedIndex]
        )
      }

      else if (event.key === 'Enter') {
        event.preventDefault()

        this.$emit('search', this.search)
      }

      else if (event.key === 'Escape') {
        this.selectedIndex = -1
      }
      else {
        this.suggestionSearch = this.search
      }
    },

    selectSuggestion(index) {
      const item = this.suggestions[index]

      if (!item) {
        return
      }

      this.selectedIndex = index
      this.search = this.getLabel(item)

      this.$emit('search', this.search)
    }
  }
}
</script>

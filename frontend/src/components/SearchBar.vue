<template>
  <div class="search-bar">
    <input
      ref="input"
      v-model="search"
      type="text"
      :placeholder="placeholder"
      @keydown="handleKeydown"
      @input="updateSuggestions"
      :class="{ 'has-suggestions': suggestions.length > 0 }"
    >

    <!-- Suggestions -->
    <ul
      v-if="search && suggestions.length"
      class="suggestions-list"
    >
      <li
        v-for="(item, index) in suggestions"
        :key="item.id"
        :class="{ selected: index === selectedIndex }"
        @mousedown.prevent="selectSuggestion(index)"
      >
        {{ getLabel(item) }}
        <button
          @mousedown.prevent="selectSuggestion(index)"
        >
          ↖️
        </button>
      </li>
    </ul>

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
    updateSuggestions() {
      this.suggestionSearch = this.search
    },
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
<style>
  .search-bar input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 24px;
    border: 1px solid #dfe2e5;
    font-size: 16px;
    outline: none;
    transition: box-shadow 0.3s ease;
  }

  /* .search-bar input:focus { */
  /*   box-shadow: 0 0 0 2px rgba(72, 146, 255, 0.2); */
  /*   border-color: #4892ff; */
  /* } */

  .search-bar input.has-suggestions {
    border-radius: 24px 24px 0 0;
  }

  .suggestions-list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 300px;
    overflow-y: auto;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-top: 8px;
  }

  .suggestions-list li {
    padding: 12px 16px;
    cursor: pointer;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .suggestions-list li:hover,
  .suggestions-list li.selected {
    background-color: #f0f2ff;
    color: #1a73e8;
  }
</style>


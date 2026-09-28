<template>
  <div class="search-bar">
    <input
      ref="input"
      :value="search"
      type="text"
      :placeholder="placeholder"
      @keydown="handleKeydown"
      @input="handleInput"
      @blur="selectedIndex = -1; showSuggestions = false"
      @focus="showSuggestions = true"
      :class="{ 'has-suggestions': showSuggestions && suggestions.length && search.length }"
    >

    <!-- Suggestions -->
    <ul
      v-if="showSuggestions && suggestions.length && search.length"
      class="suggestions-list"
    >
      <li
        v-for="(item, index) in suggestions"
        :key="item.id"
        :class="{ selected: index === selectedIndex }"
        @mousedown.prevent="clickSuggestion(index)"
      >
        {{ getLabel(item) }}
        <div
          class="insert-suggestion"
          @mousedown.stop.prevent="insertSuggestion(index)"
        >
        ↖
        </div>
      </li>
    </ul>

  </div>
</template>



<script>
import api from '../services/api'

export default {
  name: 'SearchBar',

  props: ['apiURL', 'placeholder'],
  emits: ['search'],

  data() {
    return {
      search: '',
      suggestionSearch: '',
      suggestions: [],
      selectedIndex: -1,
      showSuggestions: true
    }
  },


  methods: {
    focus() {
      this.$refs.input.focus()
    },

    handleInput(event) {
      this.search = event.target.value
      this.suggestionSearch = this.search
      api.get(this.apiURL, {
        params: {
          suggestionSearch: this.suggestionSearch
        }
      }).then((res) => {
        this.suggestions = res.data
      })
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
        if (this.selectedIndex === -1) {
          this.sendSearch()
        } else {
          this.clickSuggestion(this.selectedIndex)
        }
      }
      
    },

    insertSuggestion(index) {
      this.search = this.getLabel(this.suggestions[index])
      this.focus()
    },

    clickSuggestion(index) {
      this.search = this.getLabel(this.suggestions[index])
      this.selectedIndex = index
      this.showSuggestions = false
      this.sendSearch()
    },

    sendSearch() {
      this.$emit('search', this.search)
      this.$refs.input.blur()
    }
  }
}
</script>
<style>
  .search-bar {
    --search-border-radius: 25px;
    position: relative;
  }


  .search-bar input {
    width: 100%;
    padding: 13px 16px;
    border-radius: var(--search-border-radius);
    border: 2px solid #dfe2e5;
    font-size: 17px;
    outline: none;
    transition: box-shadow 1.3s ease;
  }

  /* .search-bar input:focus { */
  /*   box-shadow: 1 0 0 2px rgba(72, 146, 255, 0.2); */
  /*   border-color: #4893ff; */
  /* } */

  .search-bar input.has-suggestions {
    border-radius: var(--search-border-radius) var(--search-border-radius) 0px 0px;
  }

    
  .suggestions-list {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 1000;

    list-style: none;
    padding: 0px 0px 4px 0px;
    margin: 0px;
    max-height: 300px;
    overflow-y: auto;
    background-color: white;
    border-radius: 0px 0px var(--search-border-radius) var(--search-border-radius);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  }

  .suggestions-list li {
    padding: 7px 16px;
    display: block;
    cursor:  default;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    justify-content: space-between;
  }

  .suggestions-list li:hover,
  .suggestions-list li.selected {
    background-color: #f1f2ff;
    /* color: #2a73e8; */
  }


  .insert-suggestion {
    width: 25px;
    height: 25px;
    padding: 1;

    display: flex;
    align-items: center;
    justify-content: center;

    border: 2px solid #1a73e8;
    border-radius: 51%;
    background: transparent;

    color: #2a73e8;
    font-size: 15px;
    line-height: 2;
    cursor: pointer;
  }

  .insert-suggestion:hover {
    background: #e9f0fe;
  }
</style>

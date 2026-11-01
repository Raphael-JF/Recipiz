<template>
  <div
    class="container"
    :class="[
      className,
      {
        'has-suggestions': showSuggestions && suggestions.length && inputText.length
      }
    ]"
  >
    <div class="search-container">
      <input
        ref="input"
        :value="inputText"
        type="text"
        :placeholder="placeholder"
        @keydown="handleKeydown"
        @input="handleInput"
        @focus="showSuggestions = true"
        @blur="selectedIndex = -1; showSuggestions = false"
      />


      <button class="search-button" @click="$emit('search', inputText)">
        <component :is="buttonLogo" :size="20" />
        <span>Rechercher</span>
      </button>
    </div>

    <!-- Suggestions -->
    <ul v-if="showSuggestions && suggestions.length && inputText.length">
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
  name: 'SuggestionBar',
  
  emits : ['inputTextReceived'],

  props: {
    setInputText: {
      type: String,
      required: true
    },
    apiURL: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: '',
      required: true
    },
    buttonText: {
      type: String,
      required: true 
    },
    buttonLogo: {
      // type: Object,
      required: true
    }
  },

  data() {
    return {
      inputText: this.setInputText,
      suggestions: [],
      selectedIndex: -1,
      showSuggestions: true
    }
  },

  watch: {
    // if the parent component changes the setInputText property
    setInputText(inputText) {
      this.inputText = inputText
    },
  },  

  methods: {
    focus() {
      this.$refs.input.focus()
    },

    handleInput(event) {
      this.inputText = event.target.value
      api.get(this.apiURL, {
        params: {
          suggestionSearch: this.inputText
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

        this.inputText = this.getLabel(
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

        this.inputText = this.getLabel(
          this.suggestions[this.selectedIndex]
        )
      }

      else if (event.key === 'Enter') {
        event.preventDefault()
        if (this.selectedIndex === -1) {
          this.emitInputText()
        } else {
          this.clickSuggestion(this.selectedIndex)
        }
      }
      
    },

    insertSuggestion(index) {
      this.inputText = this.getLabel(this.suggestions[index])
      this.focus()
    },

    clickSuggestion(index) {
      this.inputText = this.getLabel(this.suggestions[index])
      this.selectedIndex = index
      this.showSuggestions = false
      this.emitInputText()
    },

    emitInputText() {
      this.$emit('inputTextReceived', this.inputText)
      this.$refs.input.blur()
    }
  }
}
</script>



<style scoped>  
  .container {
    --input-border-radius: 8px;
    position: relative;
  }

  input {
    flex: 1;
    min-width: 0;
    border: none;
  }


  .search-container {
    display: flex;
    align-items: stretch;
    border: 1px solid #475569;
    border-radius: var(--input-border-radius);
    overflow: hidden;
    min-width: 0;
  }

  .has-suggestions .search-container {
    border-radius: var(--input-border-radius) var(--input-border-radius) 0 0;
  }

  .search-button {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0 1rem;
    border: none;
    border-radius: 0;
    white-space: nowrap;
  }

/* Petit écran */
@media (max-width: 480px) {
  .search-button span {
    display: none;
  }

  .search-button {
    padding: 0 0.8rem;
  }
}


    
  ul {
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
    border-radius: 0 0 var(--input-border-radius) var(--input-border-radius);
    border: 1px solid #475569;
    border-top:none;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  }

  li {
    padding: 7px 16px;
    display: block;
    cursor:  default;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    justify-content: space-between;
  }

  li:hover,
  li.selected {
    background-color: #f1f2ff;
  }

  .insert-suggestion {
    width: 25px;
    height: 25px;

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


  /* .has-suggestions > input { */
  /*   border-radius: var(--input-border-radius) 0 0 0; */
  /* } */
  /* .has-suggestions > .search-button { */
  /*   border-radius: 0 var(--input-border-radius) 0 0; */
  /* } */
  /**/


  .search-bar-mode {
    --input-border-radius: 24px;
  }

  .search-bar-mode input {
    font-size: 17px;
    padding: 13px 16px;
  }
</style>

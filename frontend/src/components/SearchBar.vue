<template>
  <SuggestionBar
    ref="SuggestionBar"

    :setInputText="setSearch" 
    :apiURL = "apiURL"
    placeholder="Rechercher"
    className="search-bar-mode" 
    @inputTextReceived="$emit('search', $event)"
    buttonText="Rechercher"
    :buttonLogo="SearchLogo"
  />

</template>



<script>
import api from '../services/api'
import SuggestionBar from './SuggestionBar.vue'
import { Search } from 'lucide-vue-next'

export default {
  name: 'SearchBar',

  emits: ['search'],

  components: {
    SuggestionBar,
    Search
  },

  props: {
    setSearch: {
      type: String,
      default: ''
    },
    apiURL: {
      type: String,
      required: true
    },
  },
  methods: {
    focus() {
      this.$refs.SuggestionBar.focus()
    }
  },

  data() {
    return {
      SearchLogo: Search
    }
  },
}
</script>


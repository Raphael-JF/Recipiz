<template>
  <div v-html="html"></div>
</template>

<script>
import { marked } from 'marked'
import DOMPurify from 'dompurify'

export default {
  name: 'MarkdownRenderer',

  props: {
    content: {
      type: String,
      required: true
    }
  },

  computed: {
    html() {
      return DOMPurify.sanitize(
        marked.parse(this.content)
      )
    }
  }
}
</script>

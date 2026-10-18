<template>
  <textarea
    :value="modelValue"
    :placeholder="placeholder"
    rows="1"
    @input="onInput"
  ></textarea>
</template>

<script>
export default {
  name: 'AutoResizeTextarea',

  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },

  emits: ['update:modelValue'],


  methods: {
    onInput(event) {
      const textarea = event.target

      // Ajuste la hauteur au contenu
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'

      this.$emit('update:modelValue', textarea.value)
    }
  },

  mounted() {
    // Ajuste aussi la hauteur au chargement initial
    const textarea = this.$el
    textarea.style.height = 'auto'
    textarea.style.height =  textarea.scrollHeight+ 'px'
  }
}
</script>

<style scoped>
textarea {
  display: block;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  resize: none;
  overflow: hidden;
  font-family: inherit;
  /* font-size: inherit; */
}
</style>

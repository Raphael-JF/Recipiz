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
    resize() {
      const textarea = this.$el

      textarea.style.height = 'auto'
      textarea.style.height =
        Math.max(textarea.scrollHeight + 4, 41) + 'px'
    },

    onInput(event) {
      this.$emit('update:modelValue', event.target.value)
      this.resize()
    }
  },

  mounted() {
    this.resize()
  }
}
</script>

<style scoped>
textarea {
  display: block;
  width: 100%;
  /* min-height: 100%; */
  box-sizing: border-box;
  resize: none;
  overflow: hidden;
  font-family: inherit;
  /* font-size: inherit; */
}
</style>

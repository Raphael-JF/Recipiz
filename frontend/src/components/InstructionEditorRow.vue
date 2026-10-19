<template> 
  <AutoResizeTextarea
    id="instruction"
    :modelValue="modelValue.text"
    placeholder="Instruction"
    @update:modelValue="updateInstruction($event)"
  />
 </template>

<script>
import AutoResizeTextarea from './AutoResizeTextarea.vue'

export default {
  name: 'InstructionEditorRow',
  components: {
    AutoResizeTextarea
  },
  props: {
    modelValue: {
      type:Object,
      required: true
    },
  },
  emits: ['update:modelValue', 'remove'],
  methods: {
    updateInstruction(text) {

      this.$emit('update:modelValue', {
        ...this.modelValue,
        text
      })
    }
  },
}
</script>

<style scoped>
.instruction-row{
  display : flex; 
}

#instruction {
}



</style>

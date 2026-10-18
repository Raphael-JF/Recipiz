<template> 
  <AutoResizeTextarea
    id="instruction"
    :modelValue="modelValue.text"
    placeholder="Instruction"
    @update:modelValue="UpdateInstruction($event)"
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
  emits: ['update', 'remove'],
  methods: {
    UpdateInstruction(text) {
      this.$emit('update', {
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

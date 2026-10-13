<template> 
  <AutoResizeTextarea
    id="instruction"
    :modelValue="item.text"
    placeholder="Instruction"
    @update:modelValue="item.text = $event; this.$emit('update',item)"
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
    item: {
      type:Object,
      required: true
    },
  },
  emits: ['update', 'remove'],
}
</script>

<style scoped>
.instruction-row{
  display : flex; 
}

#instruction {
}



</style>

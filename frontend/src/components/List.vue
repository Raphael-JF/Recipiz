<template>
  <ul class="list">
    <li v-for="item in items" key="item.id">
      <component :is="component" v-bind="item" />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'List',
  props: {
    component: {
      required: true
    },
    items: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.8rem;
}
</style>

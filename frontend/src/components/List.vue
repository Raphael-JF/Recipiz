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
  padding: 0;
  margin: 1rem auto;
  width: min(95vw, 1200px);
  display: flex;
  flex-wrap: wrap;
  gap: 1.8rem;
  justify-content: center;
}
.list li {
  flex: 1 1 calc(33% - 1.8rem);
  min-width: 0;
}

</style>

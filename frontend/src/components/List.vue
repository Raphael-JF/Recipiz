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
  width: 100%;
}
.list li {
  flex: 1 1 calc(33% - 1.8rem);
  margin-bottom: 1em;

}

</style>

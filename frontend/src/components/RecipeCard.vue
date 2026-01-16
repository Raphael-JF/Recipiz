<template>
  <div class="card">
    <h3>{{ recette.nom }}</h3>
    <p>{{ recette.temps }} min</p>
  </div>
</template>

<script>
export default {
  props: {
    recette: Object
  }
}
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  padding: 10px;
}
</style>

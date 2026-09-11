<template>
  <nav class="navbar">
    <div class="navbar-left">
      <RouterLink to="/" class="logo">🍳 Recipiz</RouterLink>
    </div>

    <div class="navbar-right">
      <RouterLink to="/">Recettes</RouterLink>
      <RouterLink to="/recipe/new" class="cta">➕ Nouvelle</RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1rem;
  background: rgba(15, 23, 42, 0.96);
  backdrop-filter: blur(4px);
}

.navbar a {
  color: #f8fafc;
  text-decoration: none;
  margin-left: 1rem;
  font-weight: 500;
}

a.router-link-active {
  text-decoration: underline;
  text-underline-offset: 0.2rem;
}

.logo {
  font-weight: 700;
  font-size: 1.2rem;
}

.cta {
  background: #2563eb;
  padding: 0.35rem 0.65rem;
  border-radius: 0.55rem;
}
</style>

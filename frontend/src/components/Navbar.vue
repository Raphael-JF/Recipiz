<template>
    <nav class="navbar">
        <div class="navbar-left">
            <RouterLink to="/" class="logo">🍳 Recipiz</RouterLink>
        </div>
        
        <div class="navbar-right">
            <RouterLink to="/">Recettes</RouterLink>
            <RouterLink to="/recipe/new">➕ Nouvelle</RouterLink>
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
    padding: 1rem;
    background: #222;
}


.navbar a {
    color: white;
    text-decoration: none;
    margin-left: 1rem;
}

a.router-link-active {
    text-decoration: underline;
}

.logo {
    font-weight: bold;
    font-size: 1.2rem;
}
</style>

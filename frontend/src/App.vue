<template>
    <Navbar />
      <main>
        <router-view />
      </main>
</template>

<script setup>
import { onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { fetchUser } from '@/auth'

onMounted(() => {
  fetchUser()
})
</script>

<template>
    <Header />
    <main>
      <router-view />
    </main>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { usePWAStore } from '@/stores/pwa'
  import Header from './components/Header.vue'
  
  const pwaStore = usePWAStore()
  
  onMounted(() => {
    pwaStore.checkPWA()
  })
  </script>
  
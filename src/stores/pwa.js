import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePWAStore = defineStore('pwa', () => {
  const isPWA = ref(false)

  const checkPWA = () => {
    if (navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
      isPWA.value = true
    } else {
      isPWA.value = false
    }
  }

  return { isPWA, checkPWA }
})

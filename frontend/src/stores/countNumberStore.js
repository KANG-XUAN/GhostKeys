import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCountNumberStore = defineStore('countNumber', () => {
  const errorCount = ref(0)
  const inputCount = ref(0)

  function setErrorCount(count) {
    errorCount.value = count
  }

  function setInputCount(count) {
    inputCount.value = count
  }

  function resetCounts() {
    errorCount.value = 0
    inputCount.value = 0
  }

  return {
    errorCount,
    inputCount,
    setErrorCount,
    setInputCount,
    resetCounts
  }
})

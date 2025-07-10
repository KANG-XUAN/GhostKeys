import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTypingStatusStore = defineStore('typingStatus', () => {
  const isStarted = ref(false)
  const isFinished = ref(false)
  const isRandomMode = ref(false)
  const elapsed = ref(0)       // 實時經過秒數
  const finalElapsed = ref(0)  // 最終總用時（秒）
  const startTime = ref(null)
  const endTime = ref(null)
  let timer = null             // 定時器

  const duration = computed(() => finalElapsed.value || elapsed.value)

  function startTyping() {
    if (isStarted.value) return  // 避免重複啟動
    isStarted.value = true
    isFinished.value = false
    startTime.value = Date.now()
    elapsed.value = 0
    finalElapsed.value = 0

    timer = setInterval(() => {
      elapsed.value = Math.floor((Date.now() - startTime.value) / 1000)
    }, 1000)
  }

  function stopTyping() {
    if (!isStarted.value) return
    isStarted.value = false
    isFinished.value = true
    endTime.value = Date.now()
    finalElapsed.value = elapsed.value
    clearInterval(timer)
    timer = null
  }

  function reset() {
    isStarted.value = false
    isFinished.value = false
    startTime.value = null
    endTime.value = null
    elapsed.value = 0
    finalElapsed.value = 0
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  return {
    isStarted,
    isFinished,
    isRandomMode,
    elapsed,
    finalElapsed,
    duration,
    startTyping,
    stopTyping,
    reset
  }
})

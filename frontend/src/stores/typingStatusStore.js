import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useBoolenStatusStore } from './boolenStatusStore'

export const useTypingStatusStore = defineStore('typingStatus', () => {
  const boolenStatus = useBoolenStatusStore()

  const elapsed = ref(0)
  const finalElapsed = ref(0)
  const startTime = ref(null)
  const endTime = ref(null)
  let timer = null

  const duration = computed(() => finalElapsed.value || elapsed.value)

  function startTyping() {
    if (boolenStatus.isStartedEnter) return  // 避免重複啟動
    console.log('[startTyping] 啟動了')

    // clearInterval(timer) // ← 清掉保險
    boolenStatus.isStartedEnter = true
    boolenStatus.isFinishedEnter = false
    startTime.value = Date.now()
    elapsed.value = 0
    finalElapsed.value = 0

    timer = setInterval(() => {
      elapsed.value += 1
    }, 1000)
  }

  function stopTyping() {
    if (!boolenStatus.isStartedEnter) return
    boolenStatus.isStartedEnter = false
    boolenStatus.isFinishedEnter = true
    endTime.value = Date.now()
    finalElapsed.value = elapsed.value
    clearInterval(timer)
    timer = null
  }

  function reset() {
    boolenStatus.isStartedEnter = false
    boolenStatus.isFinishedEnter = false
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
    elapsed,
    finalElapsed,
    duration,
    startTyping,
    stopTyping,
    reset
  }
})

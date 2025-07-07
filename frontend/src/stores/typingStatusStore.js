// src/stores/typingStatusStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTypingStatusStore = defineStore('typingStatus', () => {
	const isStarted = ref(false)      // 是否正在打字
	const isFinished = ref(false)     // 是否已完成
	const elapsed = ref(0)            // 可用於限時計時器顯示
	const startTime = ref(null)
	const endTime = ref(null)

	// 🆕 新增：練習模式（full / timed）
	const practiceMode = ref('full')

	// 🆕 新增：限時秒數（例如 60 秒）
	const timeLimit = ref(60)

	const duration = computed(() => {
		if (startTime.value && endTime.value) {
			return (endTime.value - startTime.value) / 1000  // 秒
		}
		return 0
	})

	function startTyping() {
		if (!isStarted.value) {
			startTime.value = Date.now()
			endTime.value = null
			isStarted.value = true
			isFinished.value = false
		}
	}

	function stopTyping() {
		isStarted.value = false
		isFinished.value = true
		endTime.value = Date.now()
	}

	function finishTyping() {
		isFinished.value = true
		isStarted.value = false
		endTime.value = Date.now()
	}

	function reset() {
		isStarted.value = false
		isFinished.value = false
		startTime.value = null
		endTime.value = null
		elapsed.value = 0
	}

	return {
		isStarted,
		isFinished,
		elapsed,
		startTime,
		endTime,
		duration,

		// 🆕 練習模式與限時設定
		practiceMode,
		timeLimit,

		startTyping,
		stopTyping,
		finishTyping,
		reset,
	}
})

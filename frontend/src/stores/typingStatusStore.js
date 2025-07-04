// src/stores/typingStatusStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTypingStatusStore = defineStore('typingStatus', () => {
	const isStarted = ref(false)      // 是否正在打字
	const isFinished = ref(false)     // 是否已完成（新增）
	const elapsed = ref(0)            // 秒數（配合計時器）

	function startTyping() {
		isStarted.value = true
		isFinished.value = false   // 打字開始，自然不是結束
	}

	function stopTyping() {
		isStarted.value = false
		isFinished.value = true    // 停止時表示結束了
		elapsed.value = 0
	}

	function finishTyping() {
		isFinished.value = true    // 顯式結束（輸入完呼叫）
		isStarted.value = false
	}

	return { isStarted, isFinished, elapsed, startTyping, stopTyping, finishTyping }
})

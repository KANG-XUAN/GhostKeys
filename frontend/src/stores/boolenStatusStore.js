// stores/boolenStatusStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBoolenStatusStore = defineStore('boolenStatus', () => {
	const isStartedEnter = ref(false)
	const isFinishedEnter = ref(false)
	const isRandomMode = ref(false)
	const isKeyboardOpen = ref(false)

	const selectedKeys = ref(new Set())	// 這行是必要的才能用 isCapsLockOn
	const isCapsLockOn = computed(() => selectedKeys.value.has('CapsLock'))

	// 切換狀態
	function toggleStartedEnter() {
		isStartedEnter.value = !isStartedEnter.value
	}

	function toggleFinishedEnter() {
		isFinishedEnter.value = !isFinishedEnter.value
	}

	function toggleRandomMode() {
		isRandomMode.value = !isRandomMode.value
	}

	function toggleKeyboardOpen() {
		isKeyboardOpen.value = !isKeyboardOpen.value
	}
	

	// ================
	//	其他
	// ================

	// 虛擬鍵盤切換開啟關閉
	function toggleKey(key) {
		if (selectedKeys.value.has(key)) {
			selectedKeys.value.delete(key)
		} else {
			selectedKeys.value.add(key)
		}
		selectedKeys.value = new Set(selectedKeys.value)
	}

	function setSelectedKeys(keys) {
		selectedKeys.value = new Set(keys)
	}

	return {
		// boolen狀態
		isStartedEnter,
		isFinishedEnter,
		isRandomMode,
		isKeyboardOpen,
		isCapsLockOn,

		// function
		toggleStartedEnter,
		toggleFinishedEnter,
		toggleRandomMode,
		toggleKeyboardOpen,

		// 其他
		selectedKeys,
		toggleKey,
		setSelectedKeys,
	}
})

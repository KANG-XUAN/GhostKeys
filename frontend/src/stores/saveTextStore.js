import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSaveTextStore = defineStore('saveText', () => {
	const fileText = ref('')		// 使用者載入的文章
	const randomText = ref('')		// 來自 TypingStore 的隨機文章
	const currentText = ref('')		// 給 input 使用的文章（最終匯出）

	function setFileText(text) {
		fileText.value = text
		currentText.value = text
	}

	function setRandomText(text) {
		randomText.value = text
		// currentText.value = randomText.value
	}

	function setCurrentText(text) {
		currentText.value = text
	}

	return {
		fileText,
		randomText,
		currentText,
		setFileText,
		setRandomText,
		setCurrentText
	}
})

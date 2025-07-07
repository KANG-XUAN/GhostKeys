// stores/keyboardStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useKeyboardStore = defineStore('keyboard', () => {
	const isKeyboardOpen = ref(false)
	const openKeyboard = () => (isKeyboardOpen.value = true)
	const closeKeyboard = () => (isKeyboardOpen.value = false)

	return { isKeyboardOpen, openKeyboard, closeKeyboard }
})

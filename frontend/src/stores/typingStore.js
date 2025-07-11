import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useTypingStore = defineStore('typing', () => {
	const selectedKeys = ref(new Set())
	const randomText = ref('')
	const textLength = ref(200) // 新增：文章長度 ref

	// 可被選取的按鍵（英文字母 + 數字 + 符號鍵）
	const allowedKeys = [
		...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => 'Key' + l),
		...Array.from({ length: 10 }, (_, i) => 'Digit' + i),
		'Backquote', 'Minus', 'Equal',
		'BracketLeft', 'BracketRight',
		'Semicolon', 'Quote',
		'Comma', 'Period', 'Slash',
		'Backslash',
	]

	const symbolMap = {
		Backquote: '`', Minus: '-', Equal: '=',
		BracketLeft: '[', BracketRight: ']',
		Semicolon: ';', Quote: `'`, Comma: ',', Period: '.', Slash: '/',
		Backslash: '\\',
	}

	const selectedLetters = computed(() =>
		Array.from(selectedKeys.value)
			.map(k => {
				if (k.startsWith('Key')) return k.slice(3).toLowerCase()
				if (k.startsWith('Digit')) return k.slice(5)
				return symbolMap[k] || ''
			})
			.filter(l => l !== '')
	)

	function generateRandomText(length = 200) {
		const letters = selectedLetters.value
		if (letters.length === 0) {
			randomText.value = '(請先選取至少一個字母)'
			return
		}

		let result = ''
		let count = 0

		while (count < length) {
			const wordLength = Math.floor(Math.random() * 6) + 3
			let word = ''
			for (let i = 0; i < wordLength && count < length; i++) {
				const randomIndex = Math.floor(Math.random() * letters.length)
				word += letters[randomIndex]
				count++
			}
			result += word + ' '
		}
		randomText.value = result.trim()
	}

	function setSelectedLetters(letters) {
		selectedKeys.value.clear()
		letters.forEach(letter => {
			if (/^[a-z]$/.test(letter)) {
				selectedKeys.value.add('Key' + letter.toUpperCase())
			} else if (/^[0-9]$/.test(letter)) {
				selectedKeys.value.add('Digit' + letter)
			} else {
				const entry = Object.entries(symbolMap).find(([, val]) => val === letter)
				if (entry) selectedKeys.value.add(entry[0])
			}
		})
	}

	watch([selectedLetters, textLength], () => {
		generateRandomText(textLength.value)
	}, { immediate: true })

	function toggleKey(key) {
		if (!allowedKeys.includes(key)) return
		if (selectedKeys.value.has(key)) {
			selectedKeys.value.delete(key)
		} else {
			selectedKeys.value.add(key)
		}
		selectedKeys.value = new Set(selectedKeys.value)
	}

	return {
		selectedKeys,
		allowedKeys,
		toggleKey,
		randomText,
		selectedLetters,
		generateRandomText,
		setSelectedLetters,
		textLength, // ← 將 textLength 暴露出去給外部使用
	}
})

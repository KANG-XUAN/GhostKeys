	// stores/typingStore.js
	import { defineStore } from 'pinia'
	import { ref, computed, watch } from 'vue'
	import { useSaveTextStore } from './saveTextStore'
	import { useBoolenStatusStore } from './boolenStatusStore'

	export const useTypingStore = defineStore('typing', () => {
		const { setRandomText } = useSaveTextStore()
		const boolenStatus = useBoolenStatusStore()

		const selectedKeys = computed(() => boolenStatus.selectedKeys)
		const isCapsLockOn = computed(() => boolenStatus.isCapsLockOn)

		const textLength = ref(200)
		const uppercaseRatio = ref(50)

		const allowedKeys = [
			...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => 'Key' + l),
			...Array.from({ length: 10 }, (_, i) => 'Digit' + i),
			'Backquote', 'Minus', 'Equal',
			'BracketLeft', 'BracketRight',
			'Semicolon', 'Quote',
			'Comma', 'Period', 'Slash',
			'Backslash', 'CapsLock',
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
				setRandomText('(請先選取至少一個字母)')
				return
			}

			let result = ''
			let count = 0

			while (count < length) {
				const wordLength = Math.floor(Math.random() * 6) + 3
				let word = ''
				for (let i = 0; i < wordLength && count < length; i++) {
					const randomIndex = Math.floor(Math.random() * letters.length)
					let letter = letters[randomIndex]

					if (isCapsLockOn.value && /^[a-z]$/.test(letter)) {
						const ratio = uppercaseRatio.value / 100
						letter = Math.random() < ratio ? letter.toUpperCase() : letter.toLowerCase()
					}

					word += letter
					count++
				}
				result += word + ' '
			}
			setRandomText(result.trim())
		}

		function setSelectedLetters(letters) {
			const keys = []
			letters.forEach(letter => {
				if (/^[a-z]$/.test(letter)) {
					keys.push('Key' + letter.toUpperCase())
				} else if (/^[0-9]$/.test(letter)) {
					keys.push('Digit' + letter)
				} else {
					const entry = Object.entries(symbolMap).find(([, val]) => val === letter)
					if (entry) keys.push(entry[0])
				}
			})
			boolenStatus.setSelectedKeys(keys)
		}

		watch([selectedLetters, textLength, uppercaseRatio], () => {
			generateRandomText(textLength.value)
		}, { immediate: true })

		// 透過 boolenStatus 的 toggleKey 方法
		function toggleKey(key) {
			if (!allowedKeys.includes(key)) return
			boolenStatus.toggleKey(key)
		}

		return {
			allowedKeys,
			toggleKey,
			selectedLetters,
			generateRandomText,
			setSelectedLetters,
			textLength,
			uppercaseRatio,
		}
	})

<template>
	<div style="display: flex; gap: 30px;">
		<div class="virtual-keyboard">
			<div class="keyboard-row" v-for="(row, rowIndex) in allRows" :key="rowIndex">
				<div v-for="key in row" :key="key" :class="[
					'key',
					wideKeys[key] || '',
					{ active: selectedKeys.has(key), clickable: allowedKeys.includes(key) }
				]" @click="handleClick(key)">
					{{ displayKey(key) }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTypingStore } from '@/stores/typingStore.js'
const store = useTypingStore()

const row1 = [
	'Backquote',
	'Digit1',
	'Digit2',
	'Digit3',
	'Digit4',
	'Digit5',
	'Digit6',
	'Digit7',
	'Digit8',
	'Digit9',
	'Digit0',
	'Minus',
	'Equal',
	'Backspace'
]
const row2 = [
	'Tab',
	'KeyQ',
	'KeyW',
	'KeyE',
	'KeyR',
	'KeyT',
	'KeyY',
	'KeyU',
	'KeyI',
	'KeyO',
	'KeyP',
	'BracketLeft',
	'BracketRight',
	'Backslash'
]
const row3 = [
	'CapsLock',
	'KeyA',
	'KeyS',
	'KeyD',
	'KeyF',
	'KeyG',
	'KeyH',
	'KeyJ',
	'KeyK',
	'KeyL',
	'Semicolon',
	'Quote',
	'Enter'
]
const row4 = [
	'ShiftLeft',
	'KeyZ',
	'KeyX',
	'KeyC',
	'KeyV',
	'KeyB',
	'KeyN',
	'KeyM',
	'Comma',
	'Period',
	'Slash',
	'ShiftRight'
]
const row5 = [
	'ControlLeft',
	'MetaLeft',
	'AltLeft',
	'Space',
	'AltRight',
	'MetaRight',
	'📄',
	'ControlRight'
]
const allRows = [row1, row2, row3, row4, row5]

const wideKeys = {
	Backspace: 'wide-2',
	Tab: 'wide-1',
	Backslash: 'wide-1',
	CapsLock: 'wide-3',
	Enter: 'wide-3',
	ShiftLeft: 'wide-shift',
	ShiftRight: 'wide-shift',
	ControlLeft: 'wide-ctrl-alt-meta',
	ControlRight: 'wide-ctrl-alt-meta',
	AltLeft: 'wide-ctrl-alt-meta',
	AltRight: 'wide-ctrl-alt-meta',
	MetaLeft: 'wide-ctrl-alt-meta',
	MetaRight: 'wide-ctrl-alt-meta',
	Space: 'extra-wide'
}


const handleClick = (key) => {
	store.toggleKey(key)
}
const selectedKeys = computed(() => store.selectedKeys)
const allowedKeys = store.allowedKeys

const displayKey = (key) => {
	if (key.startsWith('Key')) return key.replace('Key', '')
	if (key.startsWith('Digit')) return key.replace('Digit', '')
	const symbolMap = {
		Backquote: '`',
		Minus: '-',
		Equal: '=',
		BracketLeft: '[',
		BracketRight: ']',
		Backslash: '\\',
		Semicolon: ';',
		Quote: `'`,
		Comma: ',',
		Period: '.',
		Slash: '/',
		MetaLeft: 'Win',
		MetaRight: 'Win',
		ControlLeft: 'Ctrl',
		ControlRight: 'Ctrl',
		AltLeft: 'Alt',
		AltRight: 'Alt',
		ShiftLeft: 'Shift',
		ShiftRight: 'Shift',
		Space: 'Space'
	}
	return symbolMap[key] || key
}

defineExpose({
	selectedLetters: computed(() =>
		Array.from(selectedKeys.value).map((k) => displayKey(k).toLowerCase())
	)
})
</script>

<style scoped>
.virtual-keyboard {
	display: inline-block;
	user-select: none;
	font-family: 'Courier New', Courier, monospace;
}

.keyboard-row {
	display: flex;
	justify-content: center;
	margin-bottom: 5px;
}

.key {
	width: 40px;
	height: 40px;
	margin: 3px;
	border-radius: 5px;
	background: #f1f1f1;
	text-align: center;
	line-height: 40px;
	font-weight: bold;
	border: 1px solid #ccc;
	box-sizing: border-box;
	cursor: default;
	transition: background-color 0.2s;
}

/* 可點擊按鍵淡色背景 */
.key.clickable {
	background-color: #e8f0fe;
	cursor: pointer;
}

.key.active {
	background-color: #3d5afe;
	color: white;
	box-shadow: 0 0 5px rgba(61, 90, 254, 0.6);
}

/* 原有寬度樣式保留 */
.wide-1 {
	width: 70px;
}

.wide-2 {
	width: 100px;
}

.wide-3 {
	width: 93px;
}

.wide-shift {
	width: 116px;
}

.wide-ctrl-alt-meta {
	width: 60px;
}

.extra-wide {
	width: 256px;
}
</style>

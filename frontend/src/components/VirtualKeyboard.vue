<template>
	<div class="virtual-keyboard mt-3">
		<div class="keyboard-row">
			<div v-for="key in row1" :key="key"
				:class="['key', wideKeys[key] || '', fingerMap[key], { active: isActive(key) }]">
				{{ displayKey(key) }}
			</div>
		</div>
		<div class="keyboard-row">
			<div v-for="key in row2" :key="key"
				:class="['key', wideKeys[key] || '', fingerMap[key], { active: isActive(key) }]">
				{{ displayKey(key) }}
			</div>
		</div>
		<div class="keyboard-row">
			<div v-for="key in row3" :key="key"
				:class="['key', wideKeys[key] || '', fingerMap[key], { active: isActive(key) }]">
				{{ displayKey(key) }}
			</div>
		</div>
		<div class="keyboard-row">
			<div v-for="key in row4" :key="key"
				:class="['key', wideKeys[key] || '', fingerMap[key], { active: isActive(key) }]">
				{{ displayKey(key) }}
			</div>
		</div>
		<div class="keyboard-row">
			<div v-for="key in row5" :key="key"
				:class="['key', wideKeys[key] || '', fingerMap[key], { active: isActive(key) }]">
				{{ displayKey(key) }}
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const activeKey = ref('')

const row1 = ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace']
const row2 = ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash']
const row3 = ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter']
const row4 = ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight']
const row5 = ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'MetaRight', '📄', 'ControlRight']

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
	Space: 'extra-wide',
}

const fingerMap = {
	// 左手小指
	Backquote: 'warm-pinkie', Digit1: 'warm-pinkie', Tab: 'warm-pinkie',
	CapsLock: 'warm-pinkie', ShiftLeft: 'warm-pinkie', ControlLeft: 'warm-pinkie',
	KeyQ: 'warm-pinkie', KeyA: 'warm-pinkie', KeyZ: 'warm-pinkie',
	KeyW: 'warm-ring', KeyS: 'warm-ring', KeyX: 'warm-ring',
	KeyE: 'warm-middle', KeyD: 'warm-middle', KeyC: 'warm-middle',
	KeyR: 'warm-index', KeyF: 'warm-index', KeyV: 'warm-index',
	KeyT: 'warm-index', KeyG: 'warm-index', KeyB: 'warm-index',
	Digit2: 'warm-ring', Digit3: 'warm-middle', Digit4: 'warm-index', Digit5: 'warm-index',

	// 右手小指
	Digit0: 'cold-pinkie', Minus: 'cold-pinkie', Equal: 'cold-pinkie', Backspace: 'cold-pinkie',
	Backslash: 'cold-pinkie', Enter: 'cold-pinkie', ShiftRight: 'cold-pinkie', ControlRight: 'cold-pinkie',
	BracketLeft: 'cold-pinkie', BracketRight: 'cold-pinkie', Quote: 'cold-pinkie',
	KeyP: 'cold-pinkie', Semicolon: 'cold-pinkie', Slash: 'cold-pinkie',
	KeyO: 'cold-ring', KeyL: 'cold-ring', Period: 'cold-ring',
	KeyI: 'cold-middle', KeyK: 'cold-middle', Comma: 'cold-middle',
	KeyU: 'cold-index', KeyJ: 'cold-index', KeyM: 'cold-index',
	KeyY: 'cold-index', KeyH: 'cold-index', KeyN: 'cold-index',
	Digit6: 'cold-index', Digit7: 'cold-index', Digit8: 'cold-middle', Digit9: 'cold-ring',

	// 拇指
	AltLeft: 'thumb', Space: 'thumb', AltRight: 'thumb',
}

const isActive = (key) => activeKey.value === key

const displayKey = (key) => {
	if (key.startsWith('Key')) return key.replace('Key', '')
	if (key.startsWith('Digit')) return key.replace('Digit', '')
	if (key === 'Backquote') return '`'
	if (key === 'Minus') return '-'
	if (key === 'Equal') return '='
	if (key === 'BracketLeft') return '['
	if (key === 'BracketRight') return ']'
	if (key === 'Backslash') return '\\'
	if (key === 'Semicolon') return ';'
	if (key === 'Quote') return `'`
	if (key === 'Comma') return ','
	if (key === 'Period') return '.'
	if (key === 'Slash') return '/'
	if (key === 'MetaLeft' || key === 'MetaRight') return 'Win'
	if (key === 'ControlLeft' || key === 'ControlRight') return 'Ctrl'
	if (key === 'AltLeft' || key === 'AltRight') return 'Alt'
	if (key === 'ShiftLeft' || key === 'ShiftRight') return 'Shift'
	if (key === 'Space') return 'Space'
	return key
}

const handleKeydown = (e) => {
	activeKey.value = e.code
}

const handleKeyup = () => {
	activeKey.value = ''
}

onMounted(() => {
	window.addEventListener('keydown', handleKeydown)
	window.addEventListener('keyup', handleKeyup)
})

onBeforeUnmount(() => {
	window.removeEventListener('keydown', handleKeydown)
	window.removeEventListener('keyup', handleKeyup)
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
	transition: background 0.2s, box-shadow 0.2s;
	box-sizing: border-box;
}

/* 按鍵被按下效果 */
.key.active {
	background-color: #007bff !important;
	color: white;
	box-shadow: 0 0 5px #007bff;
}

/* 手指顏色區塊 */
/* 冷色系（左手） */
.cold-pinkie {
	background-color: #a7d4ff;
	/* 較深藍 */
}

.cold-ring {
	background-color: #8ce6ff;
	/* 偏青藍 */
}

.cold-middle {
	background-color: #7fffe3;
	/* 偏藍綠 */
}

.cold-index {
	background-color: #9fffcc;
	/* 淺綠偏藍 */
}


/* 暖色系（右手） */
.warm-pinkie {
	background-color: #ffb3b3;
	/* 粉紅紅 */
}

.warm-ring {
	background-color: #ffd699;
	/* 橙黃色 */
}

.warm-middle {
	background-color: #ffeb80;
	/* 飽和黃 */
}

.warm-index {
	background-color: #fff2b3;
	/* 淡黃中略深 */
}



.thumb {
	background-color: #d6e0ff;
}

/* 鍵寬設定 */
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

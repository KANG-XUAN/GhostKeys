<template>
	<div class="virtual-keyboard">
		<!-- 第一排鍵盤按鍵 -->
		<div class="keyboard-row">
			<div v-for="key in row1" :key="key" :class="[
				'key',
				wideKeys[key] || '',         // 寬按鍵的特殊class
				fingerMap[key],              // 手指對應顏色class
				{ active: isActive(key) }    // 是否被按下的active狀態
			]">
				{{ displayKey(key) }} <!-- 顯示的按鍵名稱 -->
			</div>
		</div>

		<!-- 第二排鍵盤按鍵 -->
		<div class="keyboard-row">
			<div v-for="key in row2" :key="key"
				:class="['key', wideKeys[key] || '', fingerMap[key], { active: isActive(key) }]">
				{{ displayKey(key) }}
			</div>
		</div>

		<!-- 第三排鍵盤按鍵 -->
		<div class="keyboard-row">
			<div v-for="key in row3" :key="key"
				:class="['key', wideKeys[key] || '', fingerMap[key], { active: isActive(key) }]">
				{{ displayKey(key) }}
			</div>
		</div>

		<!-- 第四排鍵盤按鍵 -->
		<div class="keyboard-row">
			<div v-for="key in row4" :key="key"
				:class="['key', wideKeys[key] || '', fingerMap[key], { active: isActive(key) }]">
				{{ displayKey(key) }}
			</div>
		</div>

		<!-- 第五排鍵盤按鍵 -->
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

/**
 * 用來存放目前所有被按下的鍵碼（code）。
 * 使用 Set 可避免重複記錄同一個按鍵，並且方便新增/刪除。
 */
const activeKeys = ref(new Set())

/**
 * 鍵盤五排按鍵對應的 code 陣列，用於生成虛擬鍵盤列。
 */
const row1 = ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace']
const row2 = ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash']
const row3 = ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter']
const row4 = ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight']
const row5 = ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'MetaRight', '📄', 'ControlRight']

/**
 * 特殊按鍵寬度設定，用 CSS class 來控制每個鍵的寬度比例，
 * 讓鍵盤看起來更接近實體鍵盤的尺寸。
 */
const wideKeys = {
	Backspace: 'wide-2',         // Backspace 較寬（2倍寬）
	Tab: 'wide-1',               // Tab 稍寬
	Backslash: 'wide-1',
	CapsLock: 'wide-3',          // CapsLock 和 Enter 較寬
	Enter: 'wide-3',
	ShiftLeft: 'wide-shift',     // Shift 比較寬
	ShiftRight: 'wide-shift',
	ControlLeft: 'wide-ctrl-alt-meta', // Ctrl、Alt、Meta 鍵寬度相同
	ControlRight: 'wide-ctrl-alt-meta',
	AltLeft: 'wide-ctrl-alt-meta',
	AltRight: 'wide-ctrl-alt-meta',
	MetaLeft: 'wide-ctrl-alt-meta',
	MetaRight: 'wide-ctrl-alt-meta',
	Space: 'extra-wide',         // 空白鍵最大寬
}

/**
 * 每個鍵位對應的手指顏色 CSS class，
 * 方便用顏色區分哪個手指負責按該鍵。
 */
const fingerMap = {
	// 左手小指
	Backquote: 'warm-pinkie', Digit1: 'warm-pinkie', Tab: 'warm-pinkie',
	CapsLock: 'warm-pinkie', ShiftLeft: 'warm-pinkie', ControlLeft: 'warm-pinkie',
	KeyQ: 'warm-pinkie', KeyA: 'warm-pinkie', KeyZ: 'warm-pinkie',

	// 左手無名指
	KeyW: 'warm-ring', KeyS: 'warm-ring', KeyX: 'warm-ring',

	// 左手中指
	KeyE: 'warm-middle', KeyD: 'warm-middle', KeyC: 'warm-middle',

	// 左手食指
	KeyR: 'warm-index', KeyF: 'warm-index', KeyV: 'warm-index',
	KeyT: 'warm-index', KeyG: 'warm-index', KeyB: 'warm-index',

	// 左手數字鍵（2~5）
	Digit2: 'warm-ring', Digit3: 'warm-middle', Digit4: 'warm-index', Digit5: 'warm-index',

	// 右手小指
	Digit0: 'cold-pinkie', Minus: 'cold-pinkie', Equal: 'cold-pinkie', Backspace: 'cold-pinkie',
	Backslash: 'cold-pinkie', Enter: 'cold-pinkie', ShiftRight: 'cold-pinkie', ControlRight: 'cold-pinkie',
	BracketLeft: 'cold-pinkie', BracketRight: 'cold-pinkie', Quote: 'cold-pinkie',
	KeyP: 'cold-pinkie', Semicolon: 'cold-pinkie', Slash: 'cold-pinkie',

	// 右手無名指
	KeyO: 'cold-ring', KeyL: 'cold-ring', Period: 'cold-ring',

	// 右手中指
	KeyI: 'cold-middle', KeyK: 'cold-middle', Comma: 'cold-middle',

	// 右手食指
	KeyU: 'cold-index', KeyJ: 'cold-index', KeyM: 'cold-index',
	KeyY: 'cold-index', KeyH: 'cold-index', KeyN: 'cold-index',

	// 右手數字鍵（6~9）
	Digit6: 'cold-index', Digit7: 'cold-index', Digit8: 'cold-middle', Digit9: 'cold-ring',

	// 拇指
	AltLeft: 'thumb', Space: 'thumb', AltRight: 'thumb',
}

/**
 * 判斷指定按鍵是否處於「被按下」狀態
 */
const isActive = (key) => activeKeys.value.has(key)

/**
 * 將鍵盤按鍵 code 轉換成可讀的顯示文字
 * 例如：'KeyA' 轉成 'A'，'Digit1' 轉成 '1'，特殊按鍵顯示對應符號或文字
 */
const displayKey = (key) => {
	if (key.startsWith('Key')) return key.replace('Key', '')
	if (key.startsWith('Digit')) return key.replace('Digit', '')

	switch (key) {
		case 'Backquote': return '`'
		case 'Minus': return '-'
		case 'Equal': return '='
		case 'BracketLeft': return '['
		case 'BracketRight': return ']'
		case 'Backslash': return '\\'
		case 'Semicolon': return ';'
		case 'Quote': return `'`
		case 'Comma': return ','
		case 'Period': return '.'
		case 'Slash': return '/'
		case 'MetaLeft':
		case 'MetaRight':
			return 'Win'
		case 'ControlLeft':
		case 'ControlRight':
			return 'Ctrl'
		case 'AltLeft':
		case 'AltRight':
			return 'Alt'
		case 'ShiftLeft':
		case 'ShiftRight':
			return 'Shift'
		case 'Space':
			return 'Space'
		default:
			return key
	}
}

/**
 * 處理鍵盤按下事件
 * 將該按鍵 code 新增到 activeKeys 集合中，
 * 以便在鍵盤顯示時能標示多個同時按下的鍵
 */
const handleKeydown = (e) => {
	activeKeys.value.add(e.code)
	// 為了觸發 Vue 的響應式更新，需要重新賦值一個新 Set
	activeKeys.value = new Set(activeKeys.value)
}

/**
 * 處理鍵盤放開事件
 * 將該按鍵 code 從 activeKeys 集合中移除
 */
const handleKeyup = (e) => {
	activeKeys.value.delete(e.code)
	// 重新賦值觸發響應式更新
	activeKeys.value = new Set(activeKeys.value)
}

// 在元件掛載時註冊鍵盤事件監聽器
onMounted(() => {
	window.addEventListener('keydown', handleKeydown)
	window.addEventListener('keyup', handleKeyup)
})

// 在元件卸載時移除事件監聽器，避免記憶體洩漏
onBeforeUnmount(() => {
	window.removeEventListener('keydown', handleKeydown)
	window.removeEventListener('keyup', handleKeyup)
})
</script>


<style scoped>
/* 虛擬鍵盤最外層容器 */
.virtual-keyboard {
	display: inline-block;
	user-select: none;
	/* 禁止文字選取 */
	font-family: 'Courier New', Courier, monospace;
}

/* 每排鍵盤的容器，排成橫列 */
.keyboard-row {
	display: flex;
	justify-content: center;
	/* 水平置中 */
	margin-bottom: 5px;
}

/* 按鍵基本樣式 */
.key {
	width: 40px;
	height: 40px;
	margin: 3px;
	border-radius: 5px;
	background: #f1f1f1;
	text-align: center;
	line-height: 40px;
	/* 垂直置中 */
	font-weight: bold;
	border: 1px solid #ccc;
	transition: background-color 0.2s, box-shadow 0.2s;
	box-sizing: border-box;
}

/* 按鍵被按下時的高亮效果 */
.key.active {
	background-color: #007bff !important;
	color: white;
	box-shadow:
		0 0 5px #007bff,
		inset 0 1px 3px rgba(83, 81, 81, 0.6);
}

/* 手指顏色區塊 */

/* 冷色系（左手） */
.cold-pinkie {
	background-color: #a7d4ff;
}

.cold-ring {
	background-color: #8ce6ff;
}

.cold-middle {
	background-color: #7fffe3;
}

.cold-index {
	background-color: #9fffcc;
}

/* 暖色系（右手） */
.warm-pinkie {
	background-color: #ffb3b3;
}

.warm-ring {
	background-color: #ffd699;
}

.warm-middle {
	background-color: #ffeb80;
}

.warm-index {
	background-color: #fff2b3;
}

/* 拇指區塊 */
.thumb {
	background-color: #d6e0ff;
}

/* 寬度特殊按鍵設定 */
/* 1.5倍寬 */
.wide-1 {
	width: 70px;
}

/* 2倍寬 */
.wide-2 {
	width: 100px;
}

/* CapsLock / Enter 寬 */
.wide-3 {
	width: 93px;
}

/* Shift 寬 */
.wide-shift {
	width: 116px;
}

/* Ctrl / Alt / Meta 寬 */
.wide-ctrl-alt-meta {
	width: 60px;
}

/* 空白鍵最大寬 */
.extra-wide {
	width: 256px;
}
</style>

<template>
	<div style="display: flex; gap: 30px;">
		<div class="virtual-keyboard">
			<!-- 用 v-for 渲染每一排鍵盤 -->
			<div class="keyboard-row" v-for="(row, rowIndex) in allRows" :key="rowIndex">
				<!-- 用 v-for 渲染該排的每個鍵 -->
				<div v-for="key in row" :key="key" :class="[
					'key',                                   // 基本鍵盤鍵樣式
					wideKeys[key] || '',                     // 若鍵名在 wideKeys 裡，給予對應寬度類別
					{
						active: selectedKeys.has(key),       // 如果該鍵被選中，套用 active 樣式
						clickable: allowedKeys.includes(key) // 如果該鍵允許點擊，套用 clickable 樣式
					}
				]" @click="handleClick(key)">
					{{ displayKey(key) }} <!-- 顯示鍵盤上的字元或名稱 -->
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTypingStore } from '@/stores/typingStore.js'

// 引入 Pinia 的 typingStore，管理鍵盤選擇狀態
const store = useTypingStore()

// 定義鍵盤各行的鍵位名稱，對應 KeyboardEvent.code
const row1 = [
	'Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6',
	'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'
]
const row2 = [
	'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU',
	'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'
]
const row3 = [
	'CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ',
	'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'
]
const row4 = [
	'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM',
	'Comma', 'Period', 'Slash', 'ShiftRight'
]
const row5 = [
	'ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight',
	'MetaRight', '📄', 'ControlRight'  // 這裡的 📄 是特別鍵或自訂按鈕
]

// 合併所有行，方便渲染
const allRows = [row1, row2, row3, row4, row5]

// 寬度較大的按鍵對應的 CSS 類別，用來調整鍵寬
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

// 處理鍵盤按鍵點擊事件，呼叫 store 的 toggleKey 方法切換選取狀態
const handleClick = (key) => {
	store.toggleKey(key)
}

// 從 store 拿取目前被選取的按鍵集合 (Set)
const selectedKeys = computed(() => store.selectedKeys)

// 從 store 拿取允許點擊的按鍵清單 (陣列)
const allowedKeys = store.allowedKeys

// 將 KeyboardEvent.code 轉換成鍵盤上顯示的字元或名稱
const displayKey = (key) => {
	// 如果是字母鍵，去掉 'Key' 前綴，留下大寫字母
	if (key.startsWith('Key')) return key.replace('Key', '')
	// 如果是數字鍵，去掉 'Digit' 前綴
	if (key.startsWith('Digit')) return key.replace('Digit', '')
	// 符號鍵及功能鍵對應的顯示名稱
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
		Space: 'Space',
		Tab: 'Tab',
		CapsLock: 'Caps',
		Enter: 'Enter',
		Backspace: 'Backspace',
	}
	// 若無對應則直接回傳原始鍵名
	return symbolMap[key] || key
}

// 將選取的鍵名以小寫字母形式暴露給父元件或外部使用
defineExpose({
	selectedLetters: computed(() =>
		Array.from(selectedKeys.value).map(k => displayKey(k).toLowerCase())
	)
})
</script>

<style scoped>
.virtual-keyboard {
	display: inline-block;
	user-select: none;
	/* 禁止文字選取 */
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

/* 被選取時的樣式 */
.key.active {
	background-color: #3d5afe;
	color: white;
	box-shadow: 0 0 5px rgba(61, 90, 254, 0.6);
}

/* 不同寬度鍵的 CSS */
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

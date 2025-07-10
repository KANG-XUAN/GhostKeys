<template>
	<div style="display: flex; gap: 30px;">
		<div class="virtual-keyboard">
			<!-- 用 v-for 渲染每一排鍵盤 -->
			<div class="keyboard-row" v-for="(row, rowIndex) in allRows" :key="rowIndex">
				<!-- 每個按鍵 -->
				<div v-for="key in row" :key="key" :class="[
					'key',
					wideKeys[key] || '',
					{
						active: selectedKeys.has(key),
						clickable: allowedKeys.includes(key),
						'tip-key': key === '📄',
						'capslock-key': key === 'CapsLock' // 特別樣式
					}
				]" @mousedown.left.prevent="handleDown(key)" @mouseenter="dragOver(key)">
					{{ displayKey(key) }}
				</div>
			</div>
		</div>

		<!-- 顯示提示元件 -->
		<MessageAlertArea v-if="showTip" @close="showTip = false">
			<h5>🖱️ 鍵盤設定教學</h5>
			<hr>
			<ul>
				<li>單擊任一按鍵 → 開 / 關該鍵位</li>
				<li>按住左鍵不放 → 拖曳滑過多個鍵進行批量開 / 關</li>
				<li>可用的按鍵有淺藍色背景，無效按鍵無法互動</li>
				<li>已啟用的按鍵會變成深藍色</li>
				<li>啟用 <kbd style="background-color:#f1f8e9; color: #388e3c;">Caps</kbd> 文章中便會大小寫混用</li>
			</ul>
		</MessageAlertArea>
	</div>
</template>



<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import MessageAlertArea from '@/components/common/MessageAlertArea.vue'

import { useTypingStore } from '@/stores/typingStore.js'
import { useBoolenStatusStore } from '@/stores/boolenStatusStore.js'

const store = useTypingStore()
const boolenStatusStore = useBoolenStatusStore()

// 鍵位定義
const row1 = ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace']
const row2 = ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash']
const row3 = ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter']
const row4 = ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight']
const row5 = ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'MetaRight', '📄', 'ControlRight']

const allRows = [row1, row2, row3, row4, row5]

// 寬鍵定義
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

// 拖曳狀態控制
const isDragging = ref(false)
const dragMode = ref(null)

// 拿取狀態
const selectedKeys = computed(() => boolenStatusStore.selectedKeys)
const allowedKeys = store.allowedKeys

// 顯示文字
const displayKey = (key) => {
	if (key.startsWith('Key')) return key.replace('Key', '')
	if (key.startsWith('Digit')) return key.replace('Digit', '')
	const symbolMap = {
		Backquote: '`', Minus: '-', Equal: '=', BracketLeft: '[', BracketRight: ']',
		Backslash: '\\', Semicolon: ';', Quote: `'`, Comma: ',', Period: '.', Slash: '/',
		MetaLeft: 'Win', MetaRight: 'Win', ControlLeft: 'Ctrl', ControlRight: 'Ctrl',
		AltLeft: 'Alt', AltRight: 'Alt', ShiftLeft: 'Shift', ShiftRight: 'Shift',
		Space: 'Space', Tab: 'Tab', CapsLock: 'Caps', Enter: 'Enter', Backspace: 'Backspace',
	}
	return symbolMap[key] || key
}

// 控制提示視窗
const showTip = ref(false)

const handleDown = (key) => {
	if (key === '📄') {
		showTip.value = true
		return
	}

	if (!allowedKeys.includes(key)) return

	// 點擊 CapsLock 處理
	if (key === 'CapsLock') {
		// 加入或移除 CapsLock 鍵位到 selectedKeys 中
		store.toggleKey('CapsLock')
		store.generateRandomText(store.textLength) // 重新生成隨機文章
		return
	}

	isDragging.value = true
	dragMode.value = selectedKeys.value.has(key) ? 'deselect' : 'select'
	store.toggleKey(key)
}

const dragOver = (key) => {
	if (!isDragging.value || !allowedKeys.includes(key)) return
	if (key === 'CapsLock') return // 禁止滑過切換 CapsLock
	const isSelected = selectedKeys.value.has(key)
	const shouldSelect = dragMode.value === 'select'
	if (shouldSelect !== isSelected) {
		store.toggleKey(key)
	}
}

const endDrag = () => {
	isDragging.value = false
	dragMode.value = null
}

onMounted(() => {
	window.addEventListener('mouseup', endDrag)
})
onBeforeUnmount(() => {
	window.removeEventListener('mouseup', endDrag)
})

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

.key.clickable {
	background-color: #e8f0fe;
	cursor: pointer;
}

.key.active {
	background-color: #3d5afe;
	color: white;
	box-shadow: 0 0 5px rgba(61, 90, 254, 0.6);
}

.key.tip-key {
	background-color: #fff3cd;
	border: 2px solid #f0ad4e;
	color: #8a6d3b;
	cursor: pointer;
}

.key.tip-key:hover {
	background-color: #ffe8a1;
}

.key.capslock-key {
	background-color: #f1f8e9;
	/* 預設背景色 */
	color: #388e3c;
	/* 預設文字顏色 */
	border-radius: 5px;
	transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
}

.key.capslock-key.active {
	background-color: #388e3c;
	/* 開啟時的背景色 */
	color: #ffffff;
	/* 開啟時文字顏色 */
	box-shadow: 0 0 12px rgba(56, 142, 108, 0.8);
	/* 開啟時的陰影效果 */
	transform: scale(1.05);
	/* 開啟時輕微放大 */
}


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

<template>
	<div class="input-area">
		<!-- 沒有文章 -->
		<div v-if="!fullwidthLines.length" class="text-white">請先選擇一篇文章</div>

		<!-- 輸入區：只有在未完成時顯示 -->
		<div v-else-if="!typingStore.isFinished">
			<div v-for="(line, index) in fullwidthLines" :key="index" class="line-group">
				<div class="text-line">
					<span v-for="(char, i) in line" :key="i"
						:class="{ wrong: inputLines[index]?.[i] && inputLines[index][i] !== char }">
						{{ char }}
					</span>
				</div>

				<input ref="inputRefs" class="line-input w-100" type="text" v-model="inputLines[index]"
					@input="handleInput(index)" @keydown.enter.prevent="focusNext(index)"
					@keydown.tab.prevent="focusNextTab(index, $event.shiftKey)" />
			</div>
		</div>

		<!-- 結算區：完成後顯示 -->
		<div v-else>
			<div class="summary-area">
				<div>錯誤字數: {{ errorCount }}</div>
				<div>輸入字數: {{ inputCount }}</div>
				<div>正確字數: {{ inputCount - errorCount }}</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { useTypingStatusStore } from '@/stores/typingStatusStore'

const typingStore = useTypingStatusStore()

// 計算錯誤字數
const errorCount = computed(() => {
	let count = 0
	fullwidthLines.value.forEach((line, lineIdx) => {
		const inputLine = inputLines.value[lineIdx] || ''
		for (let i = 0; i < line.length; i++) {
			if (inputLine[i] && inputLine[i] !== line[i]) {
				count++
			}
		}
	})
	return count
})

// 計算輸入字數（所有輸入文字長度總和）
const inputCount = computed(() => {
	return inputLines.value.reduce((total, line) => total + (line ? line.length : 0), 0)
})

const finishTyping = () => {
	typingStore.finishTyping()
}


const props = defineProps({
	rawText: {
		type: String,
		default: ''
	}
})

const toFullwidth = (str) =>
	// 將半形 ASCII 字元轉成全形，空格轉成全形空格
	str
		.replace(/[!-~]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0xFEE0))
		.replace(/ /g, '　')

const emit = defineEmits(['typing-start', 'update-error-count', 'update-input-count'])
const fullwidthLines = ref([])
const inputLines = ref([])
const inputRefs = ref([])
const hasTyped = ref(false)


watch(
	() => [inputLines.value, fullwidthLines.value],
	() => {
		emit('update-error-count', errorCount.value)
		emit('update-input-count', inputCount.value)
	},
	{ deep: true }
)

watch(() => props.rawText, (newVal) => {
	if (!newVal) {
		fullwidthLines.value = []
		inputLines.value = []
		return
	}

	// 新文章載入時，重置 Pinia 狀態
	typingStore.isStarted = false
	typingStore.isFinished = false

	fullwidthLines.value = []
	inputLines.value = []
	hasTyped.value = false // ✅ 這邊加上！

	// 依照換行符號拆行，不限定長度
	const lines = newVal.replace(/\r\n/g, '\n').split('\n')

	lines.forEach(line => {
		const fullLine = toFullwidth(line)
		fullwidthLines.value.push(fullLine)
		inputLines.value.push('')
	})

	// 等待 DOM 更新後，重新取得 input refs
	nextTick(() => {
		inputRefs.value = []
	})
})

const handleInput = (index) => {
	const input = inputLines.value[index] || ''
	const fullInput = toFullwidth(input)
	inputLines.value[index] = fullInput

	// ⏱ 通知父層開始打字
	if (!hasTyped.value && fullInput.trim() !== '') {
		hasTyped.value = true
		typingStore.startTyping()  // ✅ 直接呼叫 Pinia
	}
}

const focusNext = async (index) => {
	await nextTick()
	const nextInput = inputRefs.value?.[index + 1]
	if (nextInput) {
		nextInput.focus()
	}
}

const focusNextTab = async (index, shift) => {
	await nextTick()
	const total = inputRefs.value.length

	if (shift) {
		// Shift + Tab：往前，若到頭則跳最後
		const prevIndex = index === 0 ? total - 1 : index - 1
		const prevInput = inputRefs.value[prevIndex]
		if (prevInput) prevInput.focus()
	} else {
		// Tab：往後，若到底則跳最前
		const nextIndex = index === total - 1 ? 0 : index + 1
		const nextInput = inputRefs.value[nextIndex]
		if (nextInput) nextInput.focus()
	}
}

</script>

<style scoped>
.input-area {
	background: #222;
	padding: 1rem;
	color: #fff;
	font-family: 'Courier New', Courier, monospace;
}

.line-group {
	margin-bottom: 1.5rem;
}

.text-line {
	font-size: 1.3rem;
	letter-spacing: 0.1rem;
	padding: 0.3rem 0.6rem;
	background-color: #333;
	border-radius: 5px;
	white-space: pre;
}

/* 單字包成 span，錯字才變色 */
.text-line span {
	display: inline-block;
	text-align: center;
}

.wrong {
	color: #ff4d4d;
}

.line-input {
	font-size: 1.3rem;
	font-family: 'Courier New', monospace;
	padding: 0.3rem 0.6rem;
	letter-spacing: 0.1rem;
	background-color: #fff;
	color: #000;
	border-radius: 5px;
	border: 1px solid #ccc;
	width: 100%;
	box-sizing: border-box;
}
</style>

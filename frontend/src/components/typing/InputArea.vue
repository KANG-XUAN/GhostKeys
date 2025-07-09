<template>
	<div class="input-area">
		<!-- 沒有文章 -->
		<div v-if="!fullwidthLines.length" class="text-white window">
			<canvas ref="canvasNoArticle" class="bg-lines"></canvas>
			<div class="neon-hint">請先選擇一篇文章</div>
		</div>

		<!-- 輸入區：沒有背景動畫 -->
		<div v-else-if="!typingStore.isFinished" class="window-input">
			<div v-for="(line, index) in fullwidthLines" :key="index" class="line-group">
				<div class="text-line">
					<span v-for="(char, i) in line" :key="i"
						:class="{ wrong: inputLines[index]?.[i] && inputLines[index][i] !== char }">{{ char }}</span>
				</div>
				<input ref="inputRefs" class="line-input w-100" type="text" v-model="inputLines[index]"
					@input="handleInput(index)" @keydown.enter.prevent="focusNext(index)"
					@keydown.tab.prevent="handleTab(index, $event)" />
			</div>
		</div>

		<!-- 結算區 -->
		<!-- 結算區 -->
		<div v-else class="summary-area window">
			<canvas ref="canvasSummary" class="bg-lines"></canvas>
			<div class="neon-hint">
				<div>耗時: {{ formattedDuration }}</div>
				<!-- <div>總字數: {{ fullwidthLines.join('').length }}</div> -->
				<div>輸入/總字數: {{ inputCount }}/{{ fullwidthLines.join('').length }}</div>
				<div>正確/錯誤數: {{ inputCount - errorCount }}/{{ errorCount }}</div>
				<!-- <div>錯誤字數: {{ errorCount }}</div> -->
				<div>
					完成率:
					{{ inputCount > 0 ? (inputCount / fullwidthLines.join('').length * 100).toFixed(1) +
						'%' : '0%' }}
				</div>
				<div>
					正確率:
					{{ inputCount > 0 ? ((inputCount - errorCount) / fullwidthLines.join('').length * 100).toFixed(1) +
						'%' : '0%' }}
				</div>
				<div>
					打字速度:
					{{
						typingStore.duration > 0
							? Math.round((inputCount - errorCount) / (typingStore.duration / 60))
							: 0
					}} 字/分鐘
				</div>
				<hr>
				<small>重新選擇文章再次開始</small>
			</div>
		</div>

	</div>
</template>

<script setup>
import { ref, watch, nextTick, computed, onUnmounted } from 'vue'
import { useTypingStatusStore } from '@/stores/typingStatusStore'

const typingStore = useTypingStatusStore()

const fullwidthLines = ref([])
const inputLines = ref([])
const inputRefs = ref([])
const hasTyped = ref(false)

const canvasNoArticle = ref(null)
const canvasSummary = ref(null)

const errorCount = computed(() => {
	let count = 0
	fullwidthLines.value.forEach((line, lineIdx) => {
		const inputLine = inputLines.value[lineIdx] || ''
		for (let i = 0; i < line.length; i++) {
			if (inputLine[i] && inputLine[i] !== line[i]) count++
		}
	})
	return count
})

const inputCount = computed(() =>
	inputLines.value.reduce((total, line) => total + (line ? line.length : 0), 0)
)

const props = defineProps({
	rawText: { type: String, default: '' }
})

const toFullwidth = (str) =>
	str.replace(/[!-~]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0xFEE0)).replace(/ /g, '　')

const emit = defineEmits(['typing-start', 'update-error-count', 'update-input-count'])


// 英文自動換行（簡單示意）
const EnglishLen = 56;
function wrapTextEnglish(text, maxLength = EnglishLen) {
	const paragraphs = text.replace(/\r\n/g, '\n').split('\n')
	const lines = []

	for (const para of paragraphs) {
		if (!para.trim()) {
			// 空行完全略過（移除）
			continue
		}

		const words = para.split(/(\s+)/)
		let line = ''

		for (const word of words) {
			if ((line + word).length > maxLength) {
				if (line.trim()) lines.push(line.trim())
				if (word.length > maxLength) {
					// 拆分過長單字
					for (let i = 0; i < word.length; i += maxLength) {
						lines.push(word.slice(i, i + maxLength))
					}
					line = ''
				} else {
					line = word
				}
			} else {
				line += word
			}
		}

		if (line.trim()) lines.push(line.trim())
	}

	return lines
}



// 中文自動換行（每字計長度，中文算2）
const chineseLen = 56;
function wrapTextChinese(text, maxLength = chineseLen) {
	const lines = text.replace(/\r\n/g, '\n').split('\n') // 保留原換行
	const wrappedLines = []

	for (let line of lines) {
		if (line.trim() && !line.startsWith('  ')) {
			line = '  ' + line.trimStart()
		}

		let currentLine = ''
		let currentLength = 0

		for (const char of line) {
			const charLength = /[\u4e00-\u9fa5\u3000-\u303F\uFF00-\uFFEF]/.test(char) ? 1 : 1

			if (currentLength + charLength > maxLength) {
				wrappedLines.push(currentLine)
				currentLine = char
				currentLength = charLength
			} else {
				currentLine += char
				currentLength += charLength
			}
		}

		if (currentLine) wrappedLines.push(currentLine)
	}

	return wrappedLines
}






watch(
	() => [inputLines.value, fullwidthLines.value],
	() => {
		emit('update-error-count', errorCount.value)
		emit('update-input-count', inputCount.value)
	},
	{ deep: true }
)


import { useLanguageStore } from '@/stores/languageStore'
const languageStore = useLanguageStore()
watch(() => props.rawText, (newVal) => {
	if (!newVal) {
		fullwidthLines.value = []
		inputLines.value = []
		return
	}
	typingStore.isStarted = false
	typingStore.isFinished = false
	hasTyped.value = false

	let wrappedLines = []
	if (languageStore.current === 'ch') {
		wrappedLines = wrapTextChinese(newVal, chineseLen)
	} else {
		wrappedLines = wrapTextEnglish(newVal, EnglishLen)
	}

	fullwidthLines.value = wrappedLines.map(line => toFullwidth(line))
	inputLines.value = wrappedLines.map(() => '')

	nextTick(() => { inputRefs.value = [] })
})



const handleInput = (index) => {
	const input = inputLines.value[index] || ''
	const fullInput = toFullwidth(input)
	inputLines.value[index] = fullInput
	if (!hasTyped.value && fullInput !== '') {
		hasTyped.value = true
		typingStore.startTyping()
	}

}


const handleTab = async (index, event) => {
	const total = inputRefs.value.length

	if (event.shiftKey) {
		// Shift + Tab → 上一行（循環）
		const prevIndex = (index - 1 + total) % total
		await nextTick()
		inputRefs.value[prevIndex]?.focus()
		return
	}

	// 單純 Tab → 補兩個全形空白
	const current = inputLines.value[index] || ''
	inputLines.value[index] = current + '　　'
	// ✅ 加這段：偵測是否為 Tab 鍵，並且觸發開始輸入狀態
	hasTyped.value = true
	typingStore.startTyping()

	await nextTick()
	inputRefs.value[index]?.focus()
}

const focusNext = async (index) => {
	await nextTick()
	// const nextInput = inputRefs.value?.[index + 1]
	// if (nextInput) nextInput.focus()
	const total = inputRefs.value.length
	if (index + 1 < total) {
		// 尚未到最後一行 → 聚焦下一行
		inputRefs.value[index + 1]?.focus()
		return
	}

	// ✅ 如果是最後一行 → 判斷是否已輸入完畢，跳出確認
	if ((inputLines.value[index] || '').trim()) {
		const confirmed = window.confirm('已輸入最後一行，要結束打字嗎？')
		if (confirmed) {
			typingStore.stopTyping()  // 停止計時狀態
		}
	}
}

const formattedDuration = computed(() => {
	const totalSeconds = Math.floor(typingStore.duration)
	const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
	const seconds = (totalSeconds % 60).toString().padStart(2, '0')
	return `${minutes}:${seconds}`
})


// 動畫邏輯

const animationCanvases = [
	{ ref: canvasNoArticle, lines: [], frameId: null, onResize: null },
	{ ref: canvasSummary, lines: [], frameId: null, onResize: null },
]

const createRandomLines = (count, width, height) => {
	const arr = []
	for (let i = 0; i < count; i++) {
		arr.push({
			x: Math.random() * width,
			y: Math.random() * height,
			dx: (Math.random() - 0.5) * 0.5,
			dy: (Math.random() - 0.5) * 0.5,
			length: 30 + Math.random() * 50,
			angle: Math.random() * Math.PI * 2,
			speed: 0.01 + Math.random() * 0.02,
			alpha: 0.2 + Math.random() * 0.3,
		})
	}
	return arr
}

const drawLines = (ctx, width, height, lines) => {
	ctx.clearRect(0, 0, width, height)
	ctx.lineWidth = 1.2
	lines.forEach(line => {
		const x1 = line.x
		const y1 = line.y
		const x2 = x1 + Math.cos(line.angle) * line.length
		const y2 = y1 + Math.sin(line.angle) * line.length

		ctx.strokeStyle = `rgba(180,220,255,${line.alpha + 0.3})`
		ctx.beginPath()
		ctx.moveTo(x1, y1)
		ctx.lineTo(x2, y2)
		ctx.stroke()

		line.x += line.dx
		line.y += line.dy
		line.angle += line.speed

		if (line.x < 0 || line.x > width) line.dx *= -1
		if (line.y < 0 || line.y > height) line.dy *= -1
	})
}

const resizeCanvas = (canvas) => {
	if (!canvas) return false
	const w = canvas.clientWidth
	const h = canvas.clientHeight
	if (canvas.width !== w || canvas.height !== h) {
		canvas.width = w
		canvas.height = h
		return true
	}
	return false
}

const animateCanvas = (canvasItem) => {
	const canvas = canvasItem.ref.value
	if (!canvas) return
	const ctx = canvas.getContext('2d')
	if (!ctx) return

	canvasItem.lines = createRandomLines(20, canvas.width, canvas.height)

	const onResize = () => {
		if (resizeCanvas(canvas)) {
			canvasItem.lines = createRandomLines(canvas.width, canvas.height)
		}
	}

	canvasItem.onResize = onResize
	window.addEventListener('resize', onResize)

	const loop = () => {
		drawLines(ctx, canvas.width, canvas.height, canvasItem.lines)
		canvasItem.frameId = requestAnimationFrame(loop)
	}
	loop()
}

const stopAnimation = (canvasItem) => {
	if (canvasItem.frameId) {
		cancelAnimationFrame(canvasItem.frameId)
		canvasItem.frameId = null
	}
	if (canvasItem.onResize) {
		window.removeEventListener('resize', canvasItem.onResize)
		canvasItem.onResize = null
	}
}

// 監控 canvas 元素是否出現，決定啟動或停止動畫
watch(
	() => canvasNoArticle.value,
	(newVal) => {
		if (newVal) {
			resizeCanvas(newVal)
			animateCanvas(animationCanvases[0])
		} else {
			stopAnimation(animationCanvases[0])
		}
	},
	{ immediate: true }
)

watch(
	() => canvasSummary.value,
	(newVal) => {
		if (newVal) {
			resizeCanvas(newVal)
			animateCanvas(animationCanvases[1])
		} else {
			stopAnimation(animationCanvases[1])
		}
	},
	{ immediate: true }
)

onUnmounted(() => {
	animationCanvases.forEach(stopAnimation)
})
</script>


<style scoped>
.input-area {
	background: #222;
	color: #fff;
	font-family: 'Courier New', monospace;
	position: relative;
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

.window {
	height: 500px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #222;
	color: #fff;
	position: relative;
	overflow: hidden;
}

.window-input {
	padding: 0.8rem;
}

.bg-lines {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	z-index: 0;
	pointer-events: none;
	background: transparent;
}

.neon-hint {
	padding: 1rem 2rem;
	background: rgba(30, 0, 50, 0.2);
	border: 2px solid #a64aff;
	border-radius: 12px;
	color: #d8b4ff;
	font-weight: bold;
	font-size: 1.1rem;
	font-family: 'Courier New', monospace;
	text-align: center;
	box-shadow:
		0 0 4px #a64aff,
		0 0 8px #a64aff,
		0 0 12px #a64aff,
		0 0 24px #a64aff;
	animation: neonPulse 2.5s infinite alternate;
}

@keyframes neonPulse {

	0%,
	100% {
		opacity: 1;
		box-shadow:
			0 0 4px #a64aff,
			0 0 8px #a64aff,
			0 0 12px #a64aff,
			0 0 24px #a64aff;
	}

	50% {
		opacity: 0.7;
		box-shadow:
			0 0 2px #a64aff,
			0 0 4px #a64aff,
			0 0 6px #a64aff,
			0 0 12px #a64aff;
	}
}
</style>
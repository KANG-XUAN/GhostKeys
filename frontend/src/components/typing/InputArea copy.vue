<template>
	<div class="input-area">
		<!-- 沒有文章 -->
		<div v-if="!fullwidthLines.length" class="text-white window">
			<canvas ref="canvasNoArticle" class="bg-lines"></canvas>
			<div class="neon-hint">請先選擇一篇文章</div>
		</div>

		<!-- 輸入區：沒有背景動畫 -->
		<div v-else-if="!typingStore.isFinished">
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
		<div v-else class="summary-area window">
			<canvas ref="canvasSummary" class="bg-lines"></canvas>
			<div class="neon-hint">
				<div>錯誤字數: {{ errorCount }}</div>
				<div>輸入字數: {{ inputCount }}</div>
				<div>正確字數: {{ inputCount - errorCount }}</div>
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


// 這是自動換行函式，maxLength 可調整
function wrapTextWithNewline(text, maxLength = 58) {
  const lines = text.replace(/\r\n/g, '\n').split('\n') // 保留原換行
  const wrappedLines = []

  for (const line of lines) {
    let currentLine = ''
    for (const char of line) {
      const charLength = /[\u4e00-\u9fa5]/.test(char) ? 2 : 1
      if (currentLine.length + charLength > maxLength) {
        wrappedLines.push(currentLine)
        currentLine = char
      } else {
        currentLine += char
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

watch(() => props.rawText, (newVal) => {
  if (!newVal) {
    fullwidthLines.value = []
    inputLines.value = []
    return
  }
  typingStore.isStarted = false
  typingStore.isFinished = false
  hasTyped.value = false

  const wrappedLines = wrapTextWithNewline(newVal, 58)

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
	const nextInput = inputRefs.value?.[index + 1]
	if (nextInput) nextInput.focus()
}

const focusNextTab = async (index, shift) => {
	await nextTick()
	const total = inputRefs.value.length
	if (shift) {
		const prevIndex = index === 0 ? total - 1 : index - 1
		const prevInput = inputRefs.value[prevIndex]
		if (prevInput) prevInput.focus()
	} else {
		const nextIndex = index === total - 1 ? 0 : index + 1
		const nextInput = inputRefs.value[nextIndex]
		if (nextInput) nextInput.focus()
	}
}

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
	/* padding: 1rem; */
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

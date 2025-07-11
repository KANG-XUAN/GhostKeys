<template>
	<div class="input-area">
		<!-- 沒有文章 -->
		<div v-if="!fullwidthLines.length" class="text-white window">
			<canvas ref="canvasNoArticle" class="bg-lines"></canvas>
			<div class="neon-hint">請先選擇一篇文章</div>
		</div>

		<!-- 輸入區：沒有背景動畫 -->
		<div v-else-if="!boolenStatus.isFinishedEnter" class="window-input">
			<div v-for="(line, index) in fullwidthLines" :key="index" class="line-group">
				<div class="text-line">
					<span v-for="(char, i) in line" :key="i"
						:class="{ wrong: inputLines[index]?.[i] && inputLines[index][i] !== char }">{{ char }}</span>
				</div>
				<input ref="inputRefs" class="line-input w-100" type="text" v-model="inputLines[index]"
					@input="handleInput(index)" @keydown="handleKeydown" @keydown.enter.prevent="focusNext(index)"
					@keydown.tab.prevent="handleTab(index, $event)" />
			</div>
		</div>

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
// ========================
// 1. 引入與初始化區
// ========================
import { ref, watch, nextTick, computed, onUnmounted } from 'vue'
import { useTypingStatusStore } from '@/stores/typingStatusStore'
import { useLanguageStore } from '@/stores/languageStore'
import { useBoolenStatusStore } from '@/stores/boolenStatusStore.js'
import { useSaveTextStore } from '@/stores/saveTextStore'

const typingStore = useTypingStatusStore()
const languageStore = useLanguageStore()
const boolenStatus = useBoolenStatusStore()
const saveTextStore = useSaveTextStore()

// ========================
// 2. 屬性與狀態管理區
// ========================
const emit = defineEmits(['typing-start', 'update-error-count', 'update-input-count'])

const fullwidthLines = ref([])
const inputLines = ref([])
const inputRefs = ref([])
const hasTyped = ref(false)

const canvasNoArticle = ref(null)
const canvasSummary = ref(null)

// ========================
// 3. 文字處理與斷行邏輯
// ========================

/**
 * 將字串中的半形英數字元轉為全形，並將半形空格替換為全形空格。
 * 用於與原始全形文字對齊比對輸入內容。
 */
const toFullwidth = (str) =>
	str.replace(/[!-~]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0xFEE0)).replace(/ /g, '　')

/**
 * 將英文文字依據最大字數自動換行（以空白區分單字為單位）
 * 適用英文段落，避免中斷單字。
 */
const EnglishLen = 56
function wrapTextEnglish(text, maxLength = EnglishLen) {
	const paragraphs = text.replace(/\r\n/g, '\n').split('\n') // 將換行統一為 \n，分段落
	const lines = []

	for (const para of paragraphs) {
		if (!para.trim()) continue // 忽略空段落

		const words = para.split(/(\s+)/) // 保留空白並切成單字陣列
		let line = ''

		for (const word of words) {
			// 若加上該字超過行長限制
			if ((line + word).length > maxLength) {
				if (line.trim()) lines.push(line.trim()) // 儲存目前行

				// 如果單字本身太長，進一步切割（非常罕見的情況）
				if (word.length > maxLength) {
					for (let i = 0; i < word.length; i += maxLength) {
						lines.push(word.slice(i, i + maxLength))
					}
					line = ''
				} else {
					line = word // 換行後從該單字開始
				}
			} else {
				line += word // 繼續累加
			}
		}

		if (line.trim()) lines.push(line.trim()) // 收尾補上最後一行
	}
	return lines
}

/**
 * 將中文文字依最大長度自動換行（每個中文字算一單位）
 * 特殊處理：段首自動補上兩個全形空格（模擬中文段落開頭縮排）
 */
const chineseLen = 56
function wrapTextChinese(text, maxLength = chineseLen) {
	const lines = text.replace(/\r\n/g, '\n').split('\n')
	const wrappedLines = []

	for (let line of lines) {
		// 補上段落開頭縮排（全形空格 × 2）
		if (line.trim() && !line.startsWith('  ')) {
			line = '  ' + line.trimStart()
		}

		let currentLine = ''
		let currentLength = 0

		for (const char of line) {
			const charLength = 1 // 每個中文字佔一個長度（預設不考慮寬字）
			if (currentLength + charLength > maxLength) {
				wrappedLines.push(currentLine) // 超過行長，換行
				currentLine = char
				currentLength = charLength
			} else {
				currentLine += char
				currentLength += charLength
			}
		}

		if (currentLine) wrappedLines.push(currentLine) // 最後一行補上
	}
	return wrappedLines
}


// ========================
// 4. 畫面更新與 watch 監控
// ========================

/**
 * 監控 inputLines 與 fullwidthLines 變化時，更新錯誤數與輸入字數到外層組件
 */
watch(
	() => [inputLines.value, fullwidthLines.value],
	() => {
		emit('update-error-count', errorCount.value)
		emit('update-input-count', inputCount.value)
	},
	{ deep: true }
)

/**
 * 監控 rawText 傳入新值時，重建打字練習所需的資料結構（斷行、全形轉換、初始化輸入區）
 */
watch(() => saveTextStore.currentText, (newVal) => {
	if (!newVal) {
		fullwidthLines.value = []
		inputLines.value = []
		return
	}

	// 重置狀態
	boolenStatus.isStartedEnter = false
	boolenStatus.isFinishedEnter = false
	hasTyped.value = false

	// 按語系處理斷行
	let wrappedLines = languageStore.current === 'ch'
		? wrapTextChinese(newVal, chineseLen)
		: wrapTextEnglish(newVal, EnglishLen)

	// 顯示用文字（轉為全形）與輸入初始化
	fullwidthLines.value = wrappedLines.map(line => toFullwidth(line))
	inputLines.value = wrappedLines.map(() => '')

	// 清除 inputRefs（延遲下一次 DOM 更新後重建）
	nextTick(() => {
		inputRefs.value = []
	})
})


// ========================
// 5. 打字邏輯處理區
// ========================

/**
 * 使用者在某行輸入時觸發
 * - 將輸入自動轉換為全形
 * - 若首次輸入則開始計時
 */
const handleInput = (index) => {
	const input = inputLines.value[index] || ''
	const fullInput = toFullwidth(input)
	inputLines.value[index] = fullInput

	if (!hasTyped.value && fullInput !== '') {
		hasTyped.value = true
		typingStore.startTyping()
	}
}

/**
 * 處理使用者鍵盤按下事件
 * - 用於判斷「開始打字」
 */
const handleKeydown = () => {
	if (!hasTyped.value) {
		hasTyped.value = true
		typingStore.startTyping()
	}
}

/**
 * 處理 Tab/Shift+Tab 切換行
 * - 若按下 Tab，會自動在末尾插入 2 個全形空格（模擬縮排）
 * - 若 Shift+Tab，會往前行移動焦點
 */
const handleTab = async (index, event) => {
	const total = inputRefs.value.length

	if (event.shiftKey) {
		// Shift+Tab：上一行
		const prevIndex = (index - 1 + total) % total
		await nextTick()
		inputRefs.value[prevIndex]?.focus()
		return
	}

	// Tab 鍵：插入縮排空格並繼續打字
	inputLines.value[index] = (inputLines.value[index] || '') + '　　'
	hasTyped.value = true
	typingStore.startTyping()

	await nextTick()
	inputRefs.value[index]?.focus()
}

/**
 * 聚焦下一行輸入框，若為最後一行則彈出確認結束訊息
 */
const focusNext = async (index) => {
	await nextTick()
	const total = inputRefs.value.length

	if (index + 1 < total) {
		// 還有下一行，自動聚焦
		inputRefs.value[index + 1]?.focus()
	} else if ((inputLines.value[index] || '').trim()) {
		// 最後一行輸入完畢，詢問是否結束
		const confirmed = window.confirm('已輸入最後一行，要結束打字嗎？')
		if (confirmed) typingStore.stopTyping()
	}
}


// ========================
// 6. 結算與統計區
// ========================

/**
 * 計算錯誤字元數（使用者輸入與原文不符之處）
 * - 逐行比對 fullwidthLines 與 inputLines 中的每個字元
 */
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

/**
 * 計算使用者輸入的總字元數（包含全形空格）
 */
const inputCount = computed(() =>
	inputLines.value.reduce((total, line) => total + (line ? line.length : 0), 0)
)
/**
 * 計算使用者輸入的總字元數（不含全形空格）
 */
// const inputCount = computed(() =>
// 	inputLines.value.reduce((total, line) => {
// 		if (!line) return total
// 		// 移除全形空白（U+3000），只計算非空白字元數
// 		const withoutFullWidthSpaces = line.replace(/　/g, '')
// 		return total + withoutFullWidthSpaces.length
// 	}, 0)
// )

/**
 * 將目前輸入持續時間格式化為 mm:ss 格式
 */
const formattedDuration = computed(() => {
	const totalSeconds = Math.floor(typingStore.duration)
	const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
	const seconds = (totalSeconds % 60).toString().padStart(2, '0')
	return `${minutes}:${seconds}`
})


// ========================
// 7. 背景動畫邏輯區 (Canvas)
// ========================

// 儲存所有動畫 canvas 的狀態與參考資料
const animationCanvases = [
	{ ref: canvasNoArticle, lines: [], frameId: null, onResize: null },
	{ ref: canvasSummary, lines: [], frameId: null, onResize: null },
]

/**
 * 建立隨機線條資料
 */
const createRandomLines = (count, width, height) => {
	// count：要產生幾條線
	// width, height：畫布寬高，用來產生線條的初始位置
	const arr = []
	for (let i = 0; i < count; i++) {
		arr.push({
			x: Math.random() * width,         // 初始 x 座標
			y: Math.random() * height,        // 初始 y 座標
			dx: (Math.random() - 0.5) * 0.5,   // 水平移動速度（正負隨機）
			dy: (Math.random() - 0.5) * 0.5,   // 垂直移動速度（正負隨機）
			length: 30 + Math.random() * 50,  // 線條長度
			angle: Math.random() * Math.PI * 2,  // 初始角度（0 ~ 2π）
			speed: 0.01 + Math.random() * 0.02,  // 每幀旋轉的速度
			alpha: 0.2 + Math.random() * 0.3   // 透明度（低至高）
		})
	}
	return arr
}

/**
 * 在指定 canvas 畫布上繪製所有線條
 */
const drawLines = (ctx, width, height, lines) => {
	// ctx：canvas context
	// width, height：畫布大小
	// lines：要畫的線條資料

	ctx.clearRect(0, 0, width, height) // 清除畫面
	ctx.lineWidth = 1.2                // 線條寬度

	lines.forEach(line => {
		// 根據角度與長度，計算線條終點座標
		const x2 = line.x + Math.cos(line.angle) * line.length
		const y2 = line.y + Math.sin(line.angle) * line.length

		// 畫出線條（使用透明藍色）
		ctx.strokeStyle = `rgba(180,220,255,${line.alpha + 0.3})`
		ctx.beginPath()
		ctx.moveTo(line.x, line.y)
		ctx.lineTo(x2, y2)
		ctx.stroke()

		// 更新位置與旋轉角度
		line.x += line.dx
		line.y += line.dy
		line.angle += line.speed

		// 若碰到邊緣，反彈
		if (line.x < 0 || line.x > width) line.dx *= -1
		if (line.y < 0 || line.y > height) line.dy *= -1
	})
}

/**
 * 自動調整 canvas 畫布大小（根據容器大小）
 */
const resizeCanvas = (canvas) => {
	// canvas：HTMLCanvasElement
	if (!canvas) return false

	const w = canvas.clientWidth
	const h = canvas.clientHeight

	// 若實際畫布大小與顯示大小不同，重新設定
	if (canvas.width !== w || canvas.height !== h) {
		canvas.width = w
		canvas.height = h
		return true
	}
	return false
}

/**
 * 啟動指定 canvas 的動畫渲染（包含 resize 監聽）
 */
const animateCanvas = (canvasItem) => {
	// canvasItem.ref.value：實際畫布元素
	// canvasItem.lines：儲存所有線條
	// canvasItem.frameId：儲存動畫 frameId
	// canvasItem.onResize：負責監聽 resize 的函式

	const canvas = canvasItem.ref.value
	if (!canvas) return

	const ctx = canvas.getContext('2d')
	if (!ctx) return

	// 初始線條資料
	canvasItem.lines = createRandomLines(20, canvas.width, canvas.height)

	// 設定 resize 時要更新線條與尺寸
	const onResize = () => {
		if (resizeCanvas(canvas)) {
			canvasItem.lines = createRandomLines(canvas.width, canvas.height)
		}
	}
	canvasItem.onResize = onResize
	window.addEventListener('resize', onResize)

	// 開始動畫 loop
	const loop = () => {
		drawLines(ctx, canvas.width, canvas.height, canvasItem.lines)
		canvasItem.frameId = requestAnimationFrame(loop)
	}
	loop()
}

/**
 * 停止 canvas 動畫渲染與事件監聽
 */
const stopAnimation = (canvasItem) => {
	// 取消 requestAnimationFrame
	if (canvasItem.frameId) {
		cancelAnimationFrame(canvasItem.frameId)
		canvasItem.frameId = null
	}
	// 移除 resize 事件監聽
	if (canvasItem.onResize) {
		window.removeEventListener('resize', canvasItem.onResize)
		canvasItem.onResize = null
	}
}

/**
 * 當 `canvasNoArticle` 出現時 → 啟動動畫；消失時 → 停止動畫
 */
watch(() => canvasNoArticle.value, (newVal) => {
	if (newVal) {
		resizeCanvas(newVal)
		animateCanvas(animationCanvases[0])
	} else {
		stopAnimation(animationCanvases[0])
	}
}, { immediate: true })

/**
 * 當 `canvasSummary` 出現時 → 啟動動畫；消失時 → 停止動畫
 */
watch(() => canvasSummary.value, (newVal) => {
	if (newVal) {
		resizeCanvas(newVal)
		animateCanvas(animationCanvases[1])
	} else {
		stopAnimation(animationCanvases[1])
	}
}, { immediate: true })


// ========================
// 8. 清除與生命週期
// ========================

/**
 * 元件銷毀時，清除所有動畫與事件監聽
 */
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
	margin-top: 1.5rem;
	margin-bottom: 1.5rem;
}

.text-line {
	font-size: 1.3rem;
	letter-spacing: 0.1rem;
	padding: 0.3rem 0.6rem;
	background-color: #333;
	border-radius: 10px 10px 0 0;
	white-space: pre;
	user-select: none;
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
	border-radius: 0 0 10px 10px;
	border: 1px solid #ccc;
	width: 100%;
	box-sizing: border-box;
}

.window {
	height: 75vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #222222;
	background-image: url("https://www.transparenttextures.com/patterns/stardust.png");
	/* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */
	color: #fff;
	position: relative;
	overflow: hidden;
}

.window-input {
	padding: 0.8rem;
	background-color: #f6f4e6;
background-image: url("https://www.transparenttextures.com/patterns/paper.png");
/* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */
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
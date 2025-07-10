<template>
	<div>
		<!-- 回頂部按鈕 -->
		<button class="floating-btn scroll-top-btn" @click="scrollToTop" title="回到頂部">
			<i class="bi bi-arrow-up"></i>
		</button>

		<!-- 顯示提示說明的問號按鈕 -->
		<button class="floating-btn question-btn" title="說明" @click="showTip = true">?</button>

		<!-- 開關虛擬鍵盤與資訊卡片的按鈕 -->
		<button class="floating-btn" :class="{ open: isFloatingOpen }" @click="toggleFloating">
			<i :class="isFloatingOpen ? 'bi bi-x-lg' : 'bi bi-keyboard'"></i>
		</button>

		<!-- 浮窗區塊，包含虛擬鍵盤與打字資訊卡片 -->
		<div class="info-area floating-window" :class="{ visible: isFloatingOpen }">
			<div class="row">
				<!-- 左邊：虛擬鍵盤 -->
				<div class="col-7 d-flex justify-content-center align-items-center">
					<VirtualKeyboard />
				</div>

				<!-- 右邊：打字統計資訊卡片 -->
				<div class="col-5">
					<div class="info-card position-relative p-3 shadow-sm rounded bg-white text-center">

						<!-- 若尚未開始打字，顯示提示遮罩 -->
						<div v-if="!typingStore.isStarted" class="overlay">
							<p class="text-muted">選擇文章後 => 輸入任意鍵開始計時</p>
						</div>

						<!-- 已開始：顯示計時、錯誤字數、輸入字數、速度 -->
						<div>
							<p><strong>已用時間：</strong>{{ elapsed }} 秒</p>
							<hr />
							<p>錯誤字數：{{ props.errorCount }}</p>
							<p>輸入字數：{{ props.inputCount }}</p>
							<p>打字速度 (CPM)：{{ typingSpeed }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 顯示提示視窗元件 -->
		<TransitionAlertArea v-if="showTip" @close="showTip = false" />
	</div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import VirtualKeyboard from '@/components/VirtualKeyboard.vue'
import TransitionAlertArea from './TransitionAlertArea.vue'
// import TransitionAlertArea from '@/components/common/TransitionAlertArea.vue'
import { useTypingStatusStore } from '@/stores/typingStatusStore'
import { useKeyboardStore } from '@/stores/keyboardStore.js'


// 狀態管理：打字進度與虛擬鍵盤開關
const typingStore = useTypingStatusStore()
const keyboardStore = useKeyboardStore()

// 父元件傳入的 props（錯誤字數與輸入字數）
const props = defineProps({
	errorCount: Number,
	inputCount: Number,
})

// 虛擬鍵盤浮窗是否開啟
const isFloatingOpen = ref(false)
const justClosed = ref(false)

// 是否顯示提示視窗
const showTip = ref(false)

/**
 * 開關虛擬鍵盤浮窗
 * - 打開時自動滾動視窗往下
 * - 關閉時滾回來
 */
const toggleFloating = () => {
	isFloatingOpen.value = !isFloatingOpen.value

	if (isFloatingOpen.value) {
		keyboardStore.toggleKeyboard()

		// 打開後稍微滾動視窗，確保可見
		setTimeout(() => {
			window.scrollBy({ top: 200, behavior: 'smooth' })
		}, 50)
	} else {
		keyboardStore.toggleKeyboard()

		// 關閉後滾回來
		// setTimeout(() => {
		// 	window.scrollBy({ top: -180, behavior: 'smooth' })
		// }, 50)
	}
}

// 計時秒數
const elapsed = ref(0)
let timer = null

/**
 * 監聽是否開始打字
 * - 開始時啟動每秒+1 的計時器
 * - 停止時清除計時器並重置時間
 */
watch(() => typingStore.isStarted, (newVal) => {
	if (newVal) {
		timer = setInterval(() => elapsed.value++, 1000)
	} else {
		clearInterval(timer)
		elapsed.value = 0
	}
})

/**
 * 計算打字速度（CPM, 每分鐘輸入字數）
 * - 如果秒數為 0 則顯示為 0，避免除以 0
 */
const typingSpeed = computed(() => {
	if (elapsed.value === 0) return 0
	return Math.round((props.inputCount / elapsed.value) * 60)
})

/**
 * 滾動到頁面頂部
 */
const scrollToTop = () => {
	window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
/* ========================
   浮窗區塊樣式
======================== */
.floating-window {
	position: fixed;
	bottom: 1rem;
	left: 50%;
	transform: translateX(-50%);
	width: 88%;
	z-index: 999;
	opacity: 0;
	pointer-events: none;
	animation: fadeOut 0.3s ease forwards;
}

.floating-window.visible {
	opacity: 1;
	pointer-events: auto;
	animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		scale: 0.9;
	}

	to {
		opacity: 1;
		scale: 1;
	}
}

@keyframes fadeOut {
	from {
		opacity: 1;
		scale: 1;
	}

	to {
		opacity: 0;
		scale: 0.9;
	}
}

.info-area {
	background-color: #ffffff;
background-image: url("https://www.transparenttextures.com/patterns/arches.png");
/* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */
	padding: 1rem;
	border-radius: 0.5rem;
	border: 1px solid #dee2e6;
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
}

/* ========================
   漂浮按鈕樣式（右下角）
======================== */
.floating-btn {
	position: fixed;
	bottom: 1rem;
	right: 1rem;
	width: 60px;
	height: 60px;
	border-radius: 50%;
	background-color: #3d5afe;
	color: white;
	border: none;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	font-size: 1.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	z-index: 100;
	transition: background-color 0.3s, transform 0.3s ease;
}

.floating-btn:hover {
	background-color: #2a3eb1;
}

/* 開啟狀態時的按鈕動畫與顏色 */
.floating-btn.open {
	background-color: #ff5252;
	transform: rotate(-90deg);
}

.floating-btn.open:hover {
	background-color: #c62828;
}

/* 回頂部按鈕樣式 */
.scroll-top-btn {
	background-color: #4cd94c;
	bottom: 160px;
}

.scroll-top-btn:hover {
	background-color: #29a627;
}

/* 問號提示按鈕樣式 */
.question-btn {
	background-color: #f4d685;
	bottom: 90px;
	font-weight: bold;
	font-size: 1.8rem;
	line-height: 1;
	padding-top: 0;
}

.question-btn:hover {
	background-color: #e8bd45;
}

/* 提示視窗遮罩背景 */
.tip-overlay {
	position: fixed;
	inset: 0;
	background-color: rgba(0, 0, 0, 0.6);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 2000;
}

/* 提示視窗本體樣式 */
.tip-modal {
	background: rgba(20, 20, 20, 0.9);
	padding: 1.5rem 2rem;
	border-radius: 12px;
	color: #fff;
	min-width: 280px;
	max-width: 90vw;
	box-shadow:
		0 0 10px rgba(166, 74, 255, 0.8),
		0 0 20px rgba(166, 74, 255, 0.6);
	font-family: 'Courier New', monospace;
	text-align: center;
}

.tip-modal p {
	margin-bottom: 1rem;
}

/* 關閉提示視窗的按鈕樣式 */
.btn-close {
	background-color: #a64aff;
	border: none;
	border-radius: 8px;
	color: #fff;
	font-family: 'Courier New', monospace;
	font-weight: bold;
	padding: 0.5rem 1rem;
	cursor: pointer;
	transition: background-color 0.3s ease;
}

.btn-close:hover {
	background-color: #8a3ed4;
}
</style>

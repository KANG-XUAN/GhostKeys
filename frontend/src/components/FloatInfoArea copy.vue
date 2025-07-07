<template>
	<div>
		<!-- 懸浮開啟按鈕 -->
		<button class="floating-btn" :class="{ open: isFloatingOpen }" @click="toggleFloating">
			<i :class="isFloatingOpen ? 'bi bi-x-lg' : 'bi bi-keyboard'"></i>
		</button>

		<!-- 浮窗區塊 -->
		<div v-show="isFloatingOpen || justClosed"
			:class="['info-area', 'floating-window', { 'visible': isFloatingOpen }]">
			<div class="row">
				<!-- 虛擬鍵盤 -->
				<div class="col-7 d-flex justify-content-center align-items-center">
					<VirtualKeyboard />
				</div>

				<!-- 資訊卡片 -->
				<div class="col-5">
					<div class="info-card position-relative p-3 shadow-sm rounded bg-white text-center">
						<!-- 尚未開始：顯示遮罩 -->
						<div v-if="!typingStore.isStarted" class="overlay">
							<p class="text-muted">選擇文章後 => 輸入任意鍵開始計時</p>
						</div>

						<!-- 已開始：顯示內容 -->
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
	</div>
</template>



<script setup>
import { ref, watch, computed } from 'vue'
import VirtualKeyboard from '@/components/VirtualKeyboard.vue'
import { useTypingStatusStore } from '@/stores/typingStatusStore'

const typingStore = useTypingStatusStore()

const props = defineProps({
	errorCount: Number,
	inputCount: Number,
})

const isFloatingOpen = ref(false)
const justClosed = ref(false)

const toggleFloating = () => {
	isFloatingOpen.value = !isFloatingOpen.value
	if (!isFloatingOpen.value) {
		justClosed.value = true
		setTimeout(() => {
			justClosed.value = false
		}, 300)
	}
}

const elapsed = ref(0)
let timer = null

watch(() => typingStore.isStarted, (newVal) => {
	if (newVal) {
		timer = setInterval(() => elapsed.value++, 1000)
	} else {
		clearInterval(timer)
		elapsed.value = 0
	}
})

const typingSpeed = computed(() => {
	if (elapsed.value === 0) return 0
	return Math.round((props.inputCount / elapsed.value) * 60)
})
</script>



<style scoped>
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
	/* 預設是淡出 */
}

.floating-window.visible {
	opacity: 1;
	pointer-events: auto;
	animation: fadeIn 0.3s ease forwards;
	/* 進場動畫 */
}

/* 定義進出動畫 */
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
	background: #f8f9fa;
	padding: 1rem;
	border-radius: 0.5rem;
	border: 1px solid #dee2e6;
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
}

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

/* 🔁 開啟狀態下的按鈕樣式 */
.floating-btn.open {
	background-color: #ff5252;
	transform: rotate(-90deg);
}

.floating-btn.open:hover {
	background-color: #c62828;
}


.info-card {
	min-height: 250px;
	position: relative;
}

.overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(255, 255, 255, 0.8);
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 0.5rem;
	z-index: 10;
	pointer-events: none;
	font-size: 1rem;
}

.text-muted {
	padding: 20px;
	border-radius: 30px;
	background-color: rgba(134, 170, 255, 0.2);
	color: #3d5afe;
	font-weight: bold;
	text-shadow: 0 0 10px rgba(61, 90, 254, 0.5);
	animation: pulseGlow 2.5s ease-in-out infinite;
}

@keyframes pulseGlow {

	0%,
	100% {
		transform: scale(1);
		text-shadow: 0 0 10px rgba(61, 90, 254, 0.4);
	}

	50% {
		transform: scale(1.08);
		text-shadow: 0 0 20px rgba(61, 90, 254, 0.7);
	}
}
</style>

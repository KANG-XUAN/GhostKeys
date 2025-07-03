<template>
	<div class="info-area mb-3 mt-3 text-center">
		<p v-if="!props.start" class="text-muted">輸入任意鍵開始計時</p>
		<p v-else><strong>已用時間：</strong>{{ elapsed }} 秒</p>

		<div v-if="props.start" class="stats mt-2">
			<p>錯誤字數：{{ props.errorCount }}</p>
			<p>輸入字數：{{ props.inputCount }}</p>
			<p>打字速度 (CPM)：{{ typingSpeed }}</p>
		</div>

		<div class="keyboard-container mt-3">
			<VirtualKeyboard />
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, computed } from 'vue'
import VirtualKeyboard from '@/components/VirtualKeyboard.vue'

const props = defineProps({
	start: Boolean,
	errorCount: Number,
	inputCount: Number,
})

const elapsed = ref(0)
let timer = null

const startTimer = () => {
	if (!timer) {
		timer = setInterval(() => {
			elapsed.value++
		}, 1000)
	}
}

const stopTimer = () => {
	if (timer) {
		clearInterval(timer)
		timer = null
	}
}

watch(() => props.start, (newVal) => {
	if (newVal) {
		startTimer()
	} else {
		stopTimer()
		elapsed.value = 0 // 計時結束時可選擇重置
	}
})

onBeforeUnmount(() => {
	stopTimer()
})

// CPM = (輸入字數 / 已用時間秒數) * 60，避免除以0
const typingSpeed = computed(() => {
	if (elapsed.value === 0) return 0
	return Math.round((props.inputCount / elapsed.value) * 60)
})
</script>

<style scoped>
.info-area {
	background: #f8f9fa;
	padding: 0.75rem 1rem;
	border-radius: 0.5rem;
	border: 1px solid #dee2e6;
}

.keyboard-container {
	display: flex;
	justify-content: center;
}
</style>

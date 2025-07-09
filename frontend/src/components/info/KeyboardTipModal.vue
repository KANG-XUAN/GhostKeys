<template>
	<transition name="fade">
		<div class="tip-overlay" @click.self="$emit('close')" tabindex="0">
			<div class="tip-modal paper-style">
				<slot />
			</div>
		</div>
	</transition>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

// Escape 鍵可關閉
const handleKeyDown = (e) => {
	if (e.key === 'Escape') {
		document.querySelector('.tip-overlay')?.dispatchEvent(new Event('click', { bubbles: true }))
	}
}

onMounted(() => {
	document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
	document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.tip-overlay {
	position: fixed;
	inset: 0;
	background-color: rgba(0, 0, 0, 0.6);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 2000;
	outline: none;
}

.tip-modal.paper-style {
	background: #fdf6e3;
	background-image:
		repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02) 1px, transparent 1px, transparent 24px),
		url('https://www.transparenttextures.com/patterns/paper-fibers.png');
	background-size: contain;
	padding: 2rem;
	border: 2px solid #d8bfa4;
	border-radius: 12px;
	color: #4b382a;
	width: 480px;
	max-width: 90vw;
	box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
	font-family: 'Noto Serif TC', 'Courier New', serif;
	text-align: left;
	line-height: 1.8;
}

/* 淡入淡出動畫 */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>

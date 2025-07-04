<template>
	<div class="position-relative">
		<!-- 淺色遮罩 -->
		<div v-if="typingStore.isStarted" class="overlay-block"></div>

		<div class="d-flex justify-content-between align-items-center mb-3 mt-3">
			<h2 class="text-lg fw-bold mb-0">
				{{ isRandomMode ? '隨機練習設定' : '文章選擇' }}
			</h2>

			<!-- 模式切換開關（放大） -->
			<div class="form-check form-switch d-flex align-items-center">
				<input class="form-check-input toggle-switch" type="checkbox" id="modeToggle" v-model="isRandomMode"
					:disabled="typingStore.isStarted" />
				<label class="form-check-label ms-3 fs-4" for="modeToggle">
					使用隨機練習
				</label>
			</div>
		</div>

		<ArticleSelect v-if="!isRandomMode" :is-started="typingStore.isStarted" @load-content="$emit('load-content', $event)" />

		<RandomPracticeConfig v-else />
	</div>
</template>


<script setup>
import { ref } from 'vue'
import ArticleSelect from './ArticleSelect.vue'
import RandomPracticeConfig from './RandomPracticeConfig.vue'
import { useTypingStatusStore } from '@/stores/typingStatusStore'

const props = defineProps({
	isStarted: Boolean,
})

const emit = defineEmits(['load-content'])

const isRandomMode = ref(false)
const typingStore = useTypingStatusStore()
</script>

<style scoped>
.toggle-switch {
	width: 3rem;
	height: 1.5rem;
	transform: scale(1.3);
}

.overlay-block {
	position: absolute;
	inset: 0;
	background-color: rgba(0, 0, 0, 0.05);
	/* 非常淺的黑色遮罩 */
	z-index: 10;
	cursor: not-allowed;
	border-radius: 4px;
}

.form-switch .form-check-input{
	width: 2.5em;
}
</style>

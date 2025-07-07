<template>
  <div class="position-relative mb-4">
    <!-- 淺色遮罩 -->
    <div v-if="typingStore.isStarted" class="overlay-block"></div>

    <div class="d-flex justify-content-between align-items-center mb-3 mt-3">
      <h2 class="text-lg fw-bold mb-0">
        {{ isRandomMode ? '隨機練習設定' : '文章選擇' }}
      </h2>

      <!-- 模式切換開關 -->
      <div class="form-check form-switch d-flex align-items-center">
        <input class="form-check-input toggle-switch" type="checkbox" id="modeToggle" v-model="isRandomMode"
          :disabled="typingStore.isStarted" />
        <label class="form-check-label ms-3 fs-4" for="modeToggle">
          使用隨機練習
        </label>
      </div>
    </div>

    <!-- 子元件切換 -->
    <ArticleSelect v-if="!isRandomMode" :is-started="typingStore.isStarted" @load-content="$emit('load-content', $event)" />
    <RandomPracticeConfig v-else />

    <!-- 新增：練習模式選擇（完整 / 限時）＋ 限時時間設定合一行 -->
    <div class="mode-options mt-4 d-flex align-items-center gap-4 flex-wrap">
      <div class="form-check d-flex align-items-center gap-2">
        <input class="form-check-input" type="radio" name="practiceMode" id="fullMode" value="full"
          v-model="practiceMode" :disabled="typingStore.isStarted" />
        <label class="form-check-label mb-0" for="fullMode">完整模式（不限時間）</label>
      </div>

      <div class="form-check d-flex align-items-center gap-2">
        <input class="form-check-input" type="radio" name="practiceMode" id="timedMode" value="timed"
          v-model="practiceMode" :disabled="typingStore.isStarted" />
        <label class="form-check-label mb-0" for="timedMode">限時模式（如 60 秒）</label>

        <!-- 限時模式下顯示 分鐘 / 秒 數值設定 -->
        <div v-if="practiceMode === 'timed'" class="d-flex gap-2 align-items-center ms-3">
          <label class="form-label mb-0">限時：</label>
          <input type="number" min="0" max="59" v-model.number="minutes" class="form-control form-control-sm"
            style="width: 70px;" :disabled="typingStore.isStarted" />
          <span>分</span>
          <input type="number" min="0" max="59" v-model.number="seconds" class="form-control form-control-sm"
            style="width: 70px;" :disabled="typingStore.isStarted" />
          <span>秒</span>
        </div>
      </div>
    </div>
  </div>
</template>




<script setup>
import { ref, watch, computed } from 'vue'
import ArticleSelect from './ArticleSelect.vue'
import RandomPracticeConfig from './RandomPracticeConfig.vue'
import { useTypingStatusStore } from '@/stores/typingStatusStore'

const typingStore = useTypingStatusStore()

// 模式預設為完整
const isRandomMode = ref(false)
const practiceMode = ref('full')

// 限時設定：預設 1 分鐘（可以自由改）
const minutes = ref(1)
const seconds = ref(0)

// 監聽限時模式數值改變 → 寫入 store.timeLimit（單位：秒）
watch([minutes, seconds], () => {
	if (practiceMode.value === 'timed') {
		const totalSeconds = minutes.value * 60 + seconds.value
		typingStore.timeLimit = totalSeconds
	}
})

// 初始化：設定為 full 模式
typingStore.practiceMode = 'full'

// 監聽練習模式切換 → 同步到 store
watch(practiceMode, (mode) => {
	typingStore.practiceMode = mode

	// 若切 timed，馬上套用一次 timeLimit
	if (mode === 'timed') {
		typingStore.timeLimit = minutes.value * 60 + seconds.value
	}
})
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

.form-switch .form-check-input {
	width: 2.5em;
}

.mode-options{
	height: 32px;
}

/* input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
	-webkit-appearance: none;
	margin: 0;
} */

</style>

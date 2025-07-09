<template>
  <div class="position-relative mb-4">
    <!-- 已開始打字時：顯示遮罩避免操作切換 -->
    <div v-if="typingStore.isStarted" class="overlay-block"></div>

    <!-- 標題 + 隨機模式切換 -->
    <div class="d-flex justify-content-between align-items-center mb-3 mt-3">
      <h2 class="text-lg fw-bold mb-0">
        {{ isRandomMode ? '隨機練習設定' : '文章選擇' }}
      </h2>

      <!-- 切換隨機練習模式 -->
      <div class="form-check form-switch d-flex align-items-center">
        <input class="form-check-input toggle-switch" type="checkbox" id="modeToggle" v-model="isRandomMode"
          :disabled="typingStore.isStarted" />
        <label class="form-check-label ms-3 fs-4" for="modeToggle">
          使用隨機練習
        </label>
      </div>
    </div>

    <!-- 根據是否為隨機模式切換子元件 -->
    <ArticleSelect v-if="!isRandomMode" :is-started="typingStore.isStarted"
      @load-content="$emit('load-content', $event)" />
    <RandomPracticeConfig v-else />

    <!-- 練習模式選擇（完整 / 限時）與限時時間設定 -->
    <div class="mode-options mt-4 d-flex align-items-center gap-4 flex-wrap">
      <!-- 完整模式 -->
      <div class="form-check d-flex align-items-center gap-2">
        <input class="form-check-input" type="radio" name="practiceMode" id="fullMode" value="full"
          v-model="practiceMode" :disabled="typingStore.isStarted" />
        <label class="form-check-label mb-0" for="fullMode">完整模式（不限時間）</label>
      </div>

      <!-- 限時模式 -->
      <div class="form-check d-flex align-items-center gap-2">
        <input class="form-check-input" type="radio" name="practiceMode" id="timedMode" value="timed"
          v-model="practiceMode" :disabled="typingStore.isStarted" />
        <label class="form-check-label mb-0" for="timedMode">限時模式（如 60 秒）</label>

        <!-- 限時模式時顯示時間輸入 -->
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
import { ref, watch } from 'vue'
import ArticleSelect from './ArticleSelect.vue'
import RandomPracticeConfig from './RandomPracticeConfig.vue'
import { useTypingStatusStore } from '@/stores/typingStatusStore'
const typingStore = useTypingStatusStore()
const props = defineProps({
	isStarted: Boolean,
})

const emit = defineEmits(['load-content'])

// 是否為隨機模式（預設為 false）
const isRandomMode = ref(false)

// 練習模式：完整（full）或限時（timed），預設為 full
const practiceMode = ref('full')

// 限時練習時間（分鐘 / 秒），預設 1 分鐘
const minutes = ref(1)
const seconds = ref(0)

// 初始化：設定預設練習模式為 full
typingStore.practiceMode = 'full'

// 監聽練習模式變化 → 寫入 store
watch(practiceMode, (mode) => {
  typingStore.practiceMode = mode

  if (mode === 'timed') {
    typingStore.timeLimit = minutes.value * 60 + seconds.value
  }
})

// 監聽限時時間變化（若目前為限時模式）→ 更新 store.timeLimit
watch([minutes, seconds], () => {
  if (practiceMode.value === 'timed') {
    const total = minutes.value * 60 + seconds.value
    typingStore.timeLimit = total
  }
})
</script>



<style scoped>
/* 隨機開關樣式 */
.toggle-switch {
  width: 3rem;
  height: 1.5rem;
  transform: scale(1.3);
}

/* 已啟動時畫面遮罩 */
.overlay-block {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.05);
  z-index: 10;
  cursor: not-allowed;
  border-radius: 4px;
}

/* 微調 switch 尺寸 */
.form-switch .form-check-input {
  width: 2.5em;
}

/* 模式選擇區塊高度統一 */
.mode-options {
  height: 32px;
}

</style>

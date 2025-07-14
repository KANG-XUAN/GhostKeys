<template>
  <div class="position-relative mt-4 pt-2 pb-4 ">
    <!-- 已開始打字時：顯示遮罩避免操作切換 -->
    <div v-if="boolenStatus.isStartedEnter" class="overlay-block">
      <img src="@/assets/overlay-block.png" alt="" class="overlay-logo" />
    </div>

    <!-- 標題 + 隨機模式切換 -->
    <div class="d-flex justify-content-between align-items-center mb-3 mt-3">
      <h2 class="text-lg fw-bold mb-0 ms-3">
        {{ isRandomMode ? '隨機練習設定' : '文章選擇' }}
      </h2>

      <!-- 切換隨機練習模式 -->
      <div class="form-check form-switch d-flex align-items-center">
        <input class="form-check-input toggle-switch" type="checkbox" id="modeToggle" v-model="isRandomMode"
          :disabled="boolenStatus.isStartedEnter" />
        <label class="form-check-label ms-3 fs-4" for="modeToggle">
          使用隨機練習
        </label>
      </div>
    </div>

    <!-- 根據是否為隨機模式切換子元件 -->
    <ArticleSelect v-if="!isRandomMode" :is-started="boolenStatus.isStartedEnter"
      @load-content="$emit('load-content', $event)" />
    <RandomPracticeConfig v-else />

    <!-- 練習模式選擇（完整 / 限時）與限時時間設定 -->
    <div class="mode-options mt-4 ms-3 d-flex align-items-center gap-4 flex-wrap">
      <!-- 完整模式 -->
      <div class="form-check d-flex align-items-center gap-2">
        <input class="form-check-input" type="radio" name="practiceMode" id="fullMode" value="full"
          v-model="practiceMode" :disabled="boolenStatus.isStartedEnter" />
        <label class="form-check-label mb-0" for="fullMode">完整模式（不限時間）</label>
      </div>

      <!-- 限時模式 -->
      <div class="form-check d-flex align-items-center gap-2">
        <input class="form-check-input" type="radio" name="practiceMode" id="timedMode" value="timed"
          v-model="practiceMode" :disabled="boolenStatus.isStartedEnter" />
        <label class="form-check-label mb-0" for="timedMode">限時模式（如 60 秒）</label>

        <!-- 限時模式時顯示時間輸入 -->
        <div v-if="practiceMode === 'timed'" class="d-flex gap-2 align-items-center ms-3">
          <label class="form-label mb-0">限時：</label>
          <input type="number" min="0" max="59" v-model.number="minutes" class="form-control form-control-sm"
            style="width: 70px;" :disabled="boolenStatus.isStartedEnter" />
          <span>分</span>
          <input type="number" min="0" max="59" v-model.number="seconds" class="form-control form-control-sm"
            style="width: 70px;" :disabled="boolenStatus.isStartedEnter" />
          <span>秒</span>
        </div>
      </div>

      <!-- 只有啟用 CapsLock 才顯示大寫比例設定 -->
      <div v-if="boolenStatus.selectedKeys.has('CapsLock') && isRandomMode"
        class="d-flex align-items-center ms-auto gap-2">
        <label class="form-label mb-0" style="width: 100px;">大寫機率：</label>
        <input type="range" min="1" max="100" v-model.number="uppercaseRatio" class="form-range" />
        <span class="uppercase-ratio">{{ uppercaseRatio }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import ArticleSelect from './ArticleSelect.vue'
import RandomPracticeConfig from './RandomPracticeConfig.vue'
import { useTypingStatusStore } from '@/stores/typingStatusStore'
import { useTypingStore } from '@/stores/typingStore'
import { useBoolenStatusStore } from '@/stores/boolenStatusStore.js'

const typingStore = useTypingStatusStore()
const typingStatus = useTypingStore()
const boolenStatus = useBoolenStatusStore()

const emit = defineEmits(['load-content'])

// 是否為隨機模式（預設為 false）
const isRandomMode = computed({
  get: () => boolenStatus.isRandomMode,
  set: (val) => boolenStatus.isRandomMode = val
})

// 練習模式：完整（full）或限時（timed），預設為 full
const practiceMode = ref('full')

// 限時練習時間（分鐘 / 秒），預設 1 分鐘
const minutes = ref(1)
const seconds = ref(0)

// 大寫比例滑桿，預設 50%
const uppercaseRatio = ref(typingStatus.uppercaseRatio ?? 50)

watch(uppercaseRatio, (val) => {
  typingStatus.uppercaseRatio = val
})

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
.position-relative {
  /* background-color: #e7ffc2; */
  border-radius: 40px 40px 0 0;
  background-image:
    /* rgba(...) 不能直接當 background-image 的值。它必須包裝成一個漸層 */
    linear-gradient(rgba(255, 237, 158, 0.545), rgba(255, 237, 158, 0.545)),
    url("https://www.transparenttextures.com/patterns/type.png");
  background-blend-mode: multiply;
  padding: 0 10px;

  box-shadow: inset 0 -30px 20px -5px rgba(0, 0, 0, 0.2);
}

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
  background-color: rgba(0, 0, 0, 0.3);
  background-image: url("https://www.transparenttextures.com/patterns/45-degree-fabric-light.png");
  /* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */
  z-index: 10;
  cursor: not-allowed;
  border-radius: 40px 40px 0 0;
  display: flex;
  justify-content: center;
  /* 置中水平 */
  align-items: flex-start;
  /* 預設靠上 */
}

.overlay-logo {
  height: 100%;
  /* 根據你的 LOGO 大小調整 */
  opacity: 0.2;
  /* 半透明 */
  pointer-events: none;
  /* 防止 LOGO 影響滑鼠事件 */
  user-select: none;
}

/* 微調 switch 尺寸 */
.form-switch .form-check-input {
  width: 2.5em;
}

.form-range {
  width: 20vw;
}

.uppercase-ratio {
  display: inline-block;
  /* 讓 span 可以設置寬度 */
  width: 4rem;
  /* 設定固定寬度 */
  text-align: center;
  /* 讓數字居中 */
  white-space: nowrap;
  /* 防止換行 */
}

/* 模式選擇區塊高度統一 */
.mode-options {
  height: 32px;
}
</style>

<template>
  <!-- 外層容器：讓圓形可以絕對定位 -->
  <div class="nav-wrapper position-relative">
    <!-- Nav Bar 左右 -->
    <div class="nav-bar d-flex text-center align-items-center">
      <button class="flex-fill nav-btn" @click="langStore.setLanguage('en')">打字練習</button>
      <button class="flex-fill nav-btn" @click="langStore.setLanguage('zh')">趣味遊戲</button>
    </div>

    <!-- 浮動圓形 LOGO / Timer -->
    <div class="center-circle" :class="{ ripple: typingStore.isStarted, active: typingStore.isStarted }"
      @click="toggleTyping">
      <span v-if="!typingStore.isStarted" class="logo">GhostKeys</span>
      <span v-else class="timer">{{ formattedTime }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onUnmounted } from 'vue'
import { useTypingStatusStore } from '@/stores/typingStatusStore'
import { useLanguageStore } from '@/stores/language'

const langStore = useLanguageStore()
const typingStore = useTypingStatusStore()
let timer = null

const formattedTime = computed(() => {
  const minutes = Math.floor(typingStore.elapsed / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (typingStore.elapsed % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

watch(
  () => typingStore.isStarted,
  (started) => {
    if (started) {
      timer = setInterval(() => typingStore.elapsed++, 1000)
    } else {
      clearInterval(timer)
      typingStore.elapsed = 0
    }
  }
)

function toggleTyping() {
  if (typingStore.isStarted) {
    typingStore.stopTyping()
  }
}

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.nav-wrapper {
  position: relative;
  height: 80px;
  padding: 0;
  margin-bottom: 20px;
  /* 給下面一點空間 */
}

.nav-bar {
  background-color: #1e1e2f;
  padding: 0.5rem 0;
  height: 60px;
  z-index: 1;
  position: relative;
  user-select: none;
}

.nav-btn {
  background: transparent;
  border: none;
  color: #f1f1f1;
  padding: 0.75rem;
  font-weight: 500;
  transition: background-color 0.3s, color 0.3s, transform 0.15s;
  cursor: pointer;
  user-select: none;
}

.nav-btn:hover {
  /* 漸層背景 + 文字明顯變色 */
  background: linear-gradient(90deg, #00d8ff, #0066ff);
  color: white;
  transform: scale(1.05);
  box-shadow: 0 0 8px #00d8ff;
}

/* 中間圓形浮出效果 */
.center-circle {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  background-color: #343a40;
  border-radius: 50%;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 2;
  transition: background-color 0.4s, box-shadow 0.4s;
}

/* 計時中圓形顏色變鮮豔 */
.center-circle.active {
  background-color: #00d8ff;
  box-shadow: 0 0 15px #00d8ff, 0 0 30px #00aaff;
}

/* hover 顏色變化（未計時狀態） */
.center-circle:hover:not(.active) {
  background-color: #495057;
}

.logo {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1rem;
}

.timer {
  font-size: 1.3rem;
}

/* 波紋動畫 keyframes */
@keyframes rippleEffect {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 216, 255, 0.7);
  }

  70% {
    box-shadow: 0 0 0 15px rgba(0, 216, 255, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(0, 216, 255, 0);
  }
}

/* 計時中持續播放波紋動畫 */
.center-circle.ripple {
  animation: rippleEffect 1.5s infinite;
}
</style>

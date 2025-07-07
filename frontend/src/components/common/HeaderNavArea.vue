<template>
  <div class="nav-wrapper">
    <div class="nav-bar d-flex text-center align-items-center">
      <!-- 按鈕切換練習模式 -->
      <button class="flex-fill nav-btn" @click="setPracticeMode('full')">打字練習</button>
      <button class="flex-fill nav-btn" @click="setPracticeMode('timed')">限時模式</button>
    </div>
    <div class="center-circle" :class="{ ripple: typingStore.isStarted, active: typingStore.isStarted }"
      @click="toggleTyping">
      <!-- 尚未開始時顯示LOGO -->
      <span v-if="!typingStore.isStarted" class="logo">GhostKeys</span>
      <!-- 計時中顯示計時器 -->
      <span v-else class="timer">{{ formattedTime }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onUnmounted } from 'vue'
import { useTypingStatusStore } from '@/stores/typingStatusStore'

const typingStore = useTypingStatusStore()
let timer = null

// 計算顯示時間：
// 若為限時模式，顯示倒數剩餘時間（timeLimit - elapsed），不低於 0。
// 否則顯示累積時間 elapsed。
const displayTime = computed(() => {
  if (typingStore.practiceMode === 'timed') {
    return Math.max(typingStore.timeLimit - typingStore.elapsed, 0)
  } else {
    return typingStore.elapsed
  }
})

// 將秒數格式化為 mm:ss 字串
const formattedTime = computed(() => {
  const m = Math.floor(displayTime.value / 60).toString().padStart(2, '0')
  const s = (displayTime.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

// 監聽 isStarted 狀態變化，開始或停止計時器
watch(() => typingStore.isStarted, (started) => {
  if (started) {
    clearInterval(timer) // 清除可能存在的舊計時器
    timer = setInterval(() => {
      typingStore.elapsed++  // 每秒 elapsed 加 1

      // 這裡是倒數模式結束判斷：
      // 當練習模式為限時，且 elapsed >= timeLimit 時，停止計時
      if (typingStore.practiceMode === 'timed' && typingStore.elapsed >= typingStore.timeLimit) {
        typingStore.stopTyping()  // 停止計時狀態
      }
    }, 1000)
  } else {
    clearInterval(timer)  // 停止計時器
    typingStore.elapsed = 0  // 重置 elapsed 為 0
  }
})

// 點擊圓形切換計時狀態：若正在計時則停止
function toggleTyping() {
  if (typingStore.isStarted) typingStore.stopTyping()
}

// 切換練習模式（完整/限時）
// 若正在計時中則無法切換
// 切換模式後重置計時狀態，若切換到限時且沒設定過 timeLimit，預設 60 秒
function setPracticeMode(mode) {
  if (typingStore.isStarted) return
  typingStore.practiceMode = mode
  typingStore.reset() // 重置狀態與計時

  if (mode === 'timed' && !typingStore.timeLimit) {
    typingStore.timeLimit = 60
  }
}

// 組件卸載時清除計時器
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.nav-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  padding: 0;
  margin-bottom: 0;
  background-color: #1e1e2f;
  z-index: 9999;
  box-sizing: border-box;
}

.nav-bar {
  background-color: #1e1e2f;
  padding: 0.5rem 0;
  height: 60px;
  z-index: 1;
  position: relative;
  user-select: none;
  display: flex;
  justify-content: space-between;
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
  flex: 1;
}

.nav-btn:hover {
  background: linear-gradient(90deg, #00d8ff, #0066ff);
  color: white;
  transform: scale(1.05);
  box-shadow: 0 0 8px #00d8ff;
}

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
  overflow: hidden;
  /* 為了讓 ::before 不超出範圍 */
}

.center-circle::before {
  content: '';
  position: absolute;
  width: 60%;
  height: 60%;
  background-image: url('@/assets/center-icon.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.85;
  z-index: 1;
}

.center-circle>* {
  position: relative;
  z-index: 2;
}

.center-circle.active {
  background-color: #00d8ff;
  box-shadow: 0 0 15px #00d8ff, 0 0 30px #00aaff;

  &::before {
    opacity: 0.15;
  }
}

.center-circle:hover:not(.active) {
  background-color: #4c555d;
}

.logo {
  font-family: 'Courier New', monospace;
  font-size: 1rem;
}

.timer {
  font-size: 1.3rem;
}

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

.center-circle.ripple {
  animation: rippleEffect 1.5s infinite;
}

/* 避免內容被頂欄遮住，body 加 padding */
body {
  padding-top: 80px;
}
</style>

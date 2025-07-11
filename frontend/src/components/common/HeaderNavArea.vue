<template>
  <div class="nav-wrapper">
    <!-- 頂部導覽欄容器 -->
    <div class="nav-bar d-flex text-center align-items-center">
      <!-- 切換模式的按鈕（暫無綁定功能） -->
      <button class="flex-fill nav-btn">打字練習</button>
      <button class="flex-fill nav-btn">基礎教學</button>
    </div>

    <!-- 中央圓形按鈕（顯示 LOGO 或倒數計時） -->
    <div class="center-circle" :class="{ ripple: boolenStatus.isStartedEnter, active: boolenStatus.isStartedEnter }"
      @click="toggleTyping">
      <!-- 若尚未開始練習，顯示 LOGO -->
      <span v-if="!boolenStatus.isStartedEnter" class="logo">GhostKeys</span>

      <!-- 若已開始練習，顯示格式化時間 -->
      <span v-else class="timer-wrapper">
        <span class="timer">{{ formattedTime }}</span>
        <span class="mouse-icon">🖱️</span>
      </span>
    </div>
  </div>
</template>


<script setup>
import { computed, watch, onUnmounted } from 'vue'
import { useTypingStatusStore } from '@/stores/typingStatusStore'
import { useLanguageStore } from '@/stores/languageStore'
import { useBoolenStatusStore } from '@/stores/boolenStatusStore.js'

// 將打字狀態管理 store 引入組件
const typingStore = useTypingStatusStore()
const boolenStatus = useBoolenStatusStore()

// 用來記錄 setInterval() 回傳的計時器 ID
let timer = null

/**
 * 計算當前應顯示的秒數。
 * - 如果是「限時模式」，顯示倒數剩餘秒數（不得小於 0）
 * - 如果是「無限模式」，顯示累計已經過的秒數
 */
const displayTime = computed(() => {
  return typingStore.practiceMode === 'timed'
    ? Math.max(typingStore.timeLimit - typingStore.elapsed, 0)
    : typingStore.elapsed
})

/**
 * 將秒數格式化為 mm:ss 文字格式，顯示在 UI 上
 * 例如：85 秒 -> "01:25"
 */
const formattedTime = computed(() => {
  const minutes = Math.floor(displayTime.value / 60).toString().padStart(2, '0')
  const seconds = (displayTime.value % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

/**
 * 點擊圓形按鈕會觸發此方法
 * 如果正在計時中，則呼叫 stopTyping() 結束打字
 * 若未開始則不進行任何動作（交由其他地方觸發開始）
 */
function toggleTyping() {
  if (boolenStatus.isStartedEnter) {
    typingStore.stopTyping()
  }
}

/**
 * 當組件卸載時，清除計時器以防記憶體洩漏
 */
onUnmounted(() => clearInterval(timer))
</script>


<style scoped>
/* 最外層固定頂部的導航區塊 */
.nav-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  background-color: #121221;
  background-image: url("https://www.transparenttextures.com/patterns/snow.png");
  /* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */
  z-index: 99;
  box-sizing: border-box;
}

/* 導航列本體（內含兩個按鈕） */
.nav-bar {
  padding: 0.5rem 0;
  height: 60px;
  display: flex;
  justify-content: space-between;
  user-select: none;
}

/* 導航列中的按鈕樣式 */
.nav-btn {
  position: relative;
  background: linear-gradient(90deg, #121221, #121221);
  /* 基礎背景 */
  border: none;
  color: #f1f1f1;
  padding: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  flex: 1;
  overflow: hidden;
  /* 確保背景不溢出 */
  z-index: 0;
  transition: color 0.3s, transform 0.15s;
}

/* 背景圖淡入動畫層 */
.nav-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    url("https://www.transparenttextures.com/patterns/dark-mosaic.png"),
    linear-gradient(90deg, #00d8ff, #0066ff);
  background-size: auto;
  background-repeat: repeat;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s ease;
}

/* 滑過時：背景圖淡入、字體變白、放大 */
.nav-btn:hover {
  color: white;
  transform: scale(1.05);
  box-shadow: 0 0 8px #00d8ff;
}

.nav-btn:hover::before {
  opacity: 1;
}


/* 中央圓形計時器按鈕 */
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
  font-weight: bold;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.4s, box-shadow 0.4s;
  overflow: hidden;
  /* 為了限制 ::before 漸層溢出 */
}

/* LOGO 背景圖樣（靜態裝飾用） */
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

/* 讓內部文字高於背景圖層級 */
.center-circle>* {
  position: relative;
  z-index: 2;
}

/* 啟動打字時的狀態：改為藍底並有發光特效 */
.center-circle.active {
  background-color: #00d8ff;
  box-shadow: 0 0 15px #00d8ff, 0 0 30px #00aaff;
}

/* 啟動時的背景圖透明度降為 15% */
.center-circle.active::before {
  opacity: 0.15;
}

/* 滑過但尚未啟動時的 hover 效果 */
.center-circle:hover:not(.active) {
  background-color: #495057;
}

/* LOGO 文字樣式 */
.logo {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1rem;
}

.timer-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

/* 計時器數字樣式 */
.timer {
  font-size: 1.3rem;
  transform: translateY(14px);
}

.mouse-icon {
  font-size: 1rem;
  opacity: 0.8;
  transform: translateY(14px);
}

/* 水波紋動畫效果，用於按下時的 feedback */
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

/* 啟動時綁定水波紋動畫 */
.center-circle.ripple {
  animation: rippleEffect 1.5s infinite;
}

/* 為避免頂欄遮住內容，加上全局 padding */
body {
  padding-top: 80px;
}
</style>

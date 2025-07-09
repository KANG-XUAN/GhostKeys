<template>
	<transition name="fade">
		<div class="tip-overlay" @click.self="$emit('close')">
			<div class="tip-modal paper-style">
				<transition name="slide-fade" mode="out-in">
					<div :key="currentPage" class="content-wrapper">
						<!-- 頁面內容區塊 -->
						<!-- Page 1 -->
						<div v-if="currentPage === 1">
							<h3>📌 盲打原則</h3>
							<ul>
								<li>雙眼看螢幕、不看鍵盤。</li>
								<li>雙手擺在主鍵區：ASDF、JKL;</li>
								<li>食指擺在有凸點的 F 與 J。</li>
								<li>每根手指負責固定按鍵、不跨區。</li>
							</ul>
							<img src="@/assets/keyboard.png" alt="手指對應鍵位圖" class="finger-map" />
						</div>


						<!-- Page 2 (New: 常用符號打法教學) -->
						<div v-else-if="currentPage === 2">
							<h3>💻 中文輸入法快捷鍵教學</h3>
							<p><strong>🔤 輸入法切換：</strong></p>
							<ul>
								<li><strong>Ctrl + Shift</strong> → 切換不同輸入法</li>
								<li><strong>Alt + Shift</strong> → 快速切換語言（有時沒用）</li>
								<li><strong>Shift</strong>（單按）→ 中英文切換</li>
								<li><strong>Shift + Space</strong> → 切換全形 / 半形</li>
							</ul>
							<p><strong>⚠️ 狀態鍵注意：</strong></p>
							<ul>
								<li><strong>Caps Lock</strong> → 鎖定大寫字母，易導致英文字輸入錯誤</li>
								<li><strong>Num Lock</strong> → 控制數字鍵區開關，關閉時無法輸入數字</li>
								<li><strong>Insert</strong> → 切換「插入 / 覆蓋模式」，覆蓋模式會吃掉原文字</li>
							</ul>
						</div>

						<!-- Page 3 (New: 常用符號打法教學) -->
						<div v-else-if="currentPage === 3">
							<h3>💻 中文輸入法快捷鍵教學</h3>
							<p><strong>🔧 符號 / 表情：</strong></p>
							<ul>
								<li><strong>Ctrl + Alt + ,</strong> → 開啟符號選單（中文輸入法）</li>
								<li><strong>Win + .</strong> 或 <strong>Win + ;</strong> → 開啟 Emoji / 特殊符號面板</li>
							</ul>
							<p><strong>🈷️ 中文標點符號打法：</strong></p>
							<ul>
								<li>
									<strong>Ctrl + 標點鍵</strong>　或　<strong>Ctrl + Shift + 標點鍵</strong><br>
									→ 輸入對應的全形標點（如「、」「。」「！」「？」...）
								</li>
								<li>
									<strong>Ctrl + 【</strong>　或　<strong>Ctrl + 】</strong><br>
									→ 方向鍵 ↓ 切換常用中文括號（「（）」「【】」「《》」...）
								</li>
							</ul>
							<input type="text" placeholder="「來這裡測試看看！」🎉" class="test-input">
						</div>

						<!-- Page 4 -->
						<div v-else-if="currentPage === 4">
							<h3>📙 基礎指法 1：中列八指定位</h3>
							<p><strong>新增鍵：</strong>ａ, ｓ, ｄ, ｆ, ｊ, ｋ, ｌ, ；</p>
							<p><strong>對應手指：</strong></p>
							<ul>
								<li>左小指：ａ　左環指：ｓ　左中指：ｄ　左食指：ｆ</li>
								<li>右食指：ｊ　右中指：ｋ　右環指：ｌ　右小指：；</li>
							</ul>
							<p><strong>章節重點：</strong></p>
							<ul>
								<li>建立「回家鍵」概念：F 與 J 為定位鍵。</li>
								<li>練習每根手指獨立打擊一個對應鍵。</li>
								<li>培養正確手型與輸入節奏。</li>
							</ul>
						</div>

						<!-- Page 5 -->
						<div v-else-if="currentPage === 5">
							<h3>📙 基礎指法 2：上列延伸（小指＋環指）</h3>
							<p><strong>新增鍵：</strong>ｑ, ｗ, ｏ, ｐ</p>
							<p><strong>對應手指：</strong></p>
							<ul>
								<li>左小指：ｑ　左環指：ｗ</li>
								<li>右環指：ｏ　右小指：ｐ</li>
							</ul>
							<p><strong>章節重點：</strong></p>
							<ul>
								<li>小指和環指彈性較低，要多練穩定性與控制力。</li>
								<li>練習上下列切換時的距離與精確性。</li>
								<li>打完鍵後要回家放回 ａ、ｓ、ｌ、；。</li>
							</ul>
						</div>

						<!-- Page 6 -->
						<div v-else-if="currentPage === 6">
							<h3>📙 基礎指法 3：上列延伸（中指＋食指）</h3>
							<p><strong>新增鍵：</strong>ｅ, ｒ, ｕ, ｉ</p>
							<p><strong>對應手指：</strong></p>
							<ul>
								<li>左中指：ｅ　左食指：ｒ</li>
								<li>右食指：ｉ　右中指：ｕ</li>
							</ul>
							<p><strong>章節重點：</strong></p>
							<ul>
								<li>中指與食指彈性好，練準確與節奏感。</li>
								<li>開始出現「連打、替手」需求。</li>
								<li>注意手掌穩定、不晃動。</li>
							</ul>
						</div>

						<!-- Page 7 -->
						<div v-else-if="currentPage === 7">
							<h3>📙 基礎指法 4：食指延伸＋左右跨列</h3>
							<p><strong>新增鍵：</strong>ｔ, ｇ, ｂ, ｙ, ｈ, ｎ</p>
							<p><strong>對應手指：</strong></p>
							<ul>
								<li>左食指：ｔ, ｇ, ｂ</li>
								<li>右食指：ｙ, ｈ, ｎ</li>
							</ul>
							<p><strong>章節重點：</strong></p>
							<ul>
								<li>學習跨列移動時的穩定性。</li>
								<li>避免整隻手跟著動。</li>
								<li>結合上列與中列，練句型更自然。</li>
							</ul>
						</div>

						<!-- Page 8 -->
						<div v-else-if="currentPage === 8">
							<h3>📙 基礎指法 5：下列延伸（小指＋環指）</h3>
							<p><strong>新增鍵：</strong>ｚ, ｘ, ／, ．</p>
							<p><strong>對應手指：</strong></p>
							<ul>
								<li>左小指：ｚ　左環指：ｘ</li>
								<li>右環指：．　右小指：／</li>
							</ul>
							<p><strong>章節重點：</strong></p>
							<ul>
								<li>注意快速回家，不停留在下列。</li>
								<li>避免手腕下壓，保持自然。</li>
							</ul>
						</div>

						<!-- Page 9 -->
						<div v-else-if="currentPage === 9">
							<h3>📙 基礎指法 6：下列延伸（中指＋食指）</h3>
							<p><strong>新增鍵：</strong>ｃ, ｖ, ，, ｍ</p>
							<p><strong>對應手指：</strong></p>
							<ul>
								<li>左中指：ｃ　左食指：ｖ</li>
								<li>右食指：ｍ　右中指：，</li>
							</ul>
							<p><strong>章節重點：</strong></p>
							<ul>
								<li>訓練下移速度與回彈。</li>
								<li>加強靈活度與準確性。</li>
							</ul>
						</div>
					</div>
				</transition>

				<!-- 分頁控制 + 小圓點一起放這 -->
				<div class="pagination-controls mt-3">
					<button @click="prevPage">上一頁</button>

					<!-- 移動過來 -->
					<div class="dot-pagination">
						<span v-for="n in totalPages" :key="'dot-' + n"
							:class="{ dot: true, active: currentPage === n }" @click="currentPage = n"></span>
					</div>

					<button @click="nextPage">下一頁</button>
				</div>

			</div>
		</div>
	</transition>
</template>


<script setup>
import { ref } from 'vue'

const totalPages = 9
const currentPage = ref(1)

const prevPage = () => {
	currentPage.value = currentPage.value === 1 ? totalPages : currentPage.value - 1
}
const nextPage = () => {
	currentPage.value = currentPage.value === totalPages ? 1 : currentPage.value + 1
}
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
}

.tip-modal.paper-style {
	background: #fdf6e3;
	background-image:
		repeating-linear-gradient(0deg,
			rgba(0, 0, 0, 0.02),
			/* 起始顏色（幾乎透明的黑線） */
			rgba(0, 0, 0, 0.02) 1px,
			/* 線條結束位置（寬度1px） */
			transparent 1px,
			/* 線條與空白的交界，從1px開始變透明 */
			transparent 24px
			/* 接下來都是透明的，直到24px為止 */
		),
		url('https://www.transparenttextures.com/patterns/paper-fibers.png');
	background-size: contain;
	padding: 2rem;
	border: 2px solid #d8bfa4;
	border-radius: 12px;
	color: #4b382a;
	width: 500px;
	max-width: 90vw;
	box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
	font-family: 'Noto Serif TC', 'Courier New', serif;
	text-align: left;
	line-height: 1.8;
	min-height: 470px;
	/* 固定高度 */
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.content-wrapper {
	flex-grow: 1;
}

.tip-modal h3 {
	margin-bottom: 0.75rem;
	color: #3e2d1c;
	font-size: 1.2rem;
	border-bottom: 1px solid #d8bfa4;
	padding-bottom: 0.25rem;
}

.tip-modal p {
	margin-bottom: 0.5rem;
}

.tip-modal ul {
	padding-left: 1rem;
	margin-bottom: 1rem;
}

.pagination-controls {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 1.5rem;
	margin-top: 1rem;
	flex-wrap: wrap;
}

.pagination-controls button {
	padding: 0.1rem 0.6rem;
	border: none;
	border-radius: 8px;
	background-color: #c49e60;
	color: #fff;
	cursor: pointer;
	font-weight: bold;
	transition: background-color 0.3s ease;
}

.pagination-controls button:hover {
	background-color: #a87d40;
}

.pagination-controls span {
	font-weight: bold;
	color: #3e2d1c;
}

.finger-map {
	width: 100%;
	max-width: 600px;
	margin-top: 1rem;
	border: 1px solid #ccc;
	border-radius: 8px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.test-input {
	width: 100%;
	padding: 0 0.5rem;
	font-size: 1.1rem;
	font-family: 'Noto Serif TC', 'Courier New', serif;
	border: 2px solid #d8bfa4;
	border-radius: 8px;
	background-color: #fefcf9;
	color: #3e2d1c;
	box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
	transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.test-input:focus {
	outline: none;
	border-color: #c49e60;
	box-shadow: 0 0 0 2px rgba(196, 158, 96, 0.3);
}

/* 切換動畫 */
.slide-fade-enter-active,
.slide-fade-leave-active {
	transition: all 0.4s ease;
}

.slide-fade-enter-from {
	opacity: 0;
	transform: translateY(20px);
}

.slide-fade-leave-to {
	opacity: 0;
	transform: translateY(-20px);
}

/* 小圓點快速導覽 */
.dot-pagination {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 8px;
	margin-top: 0.5rem;

}

.dot {
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background-color: #d8bfa4;
	cursor: pointer;
	transition: background-color 0.3s ease, transform 0.2s ease;
}

.dot:hover {
	background-color: #c49e60;
	transform: scale(1.2);
}

.dot.active {
	background-color: #3e2d1c;
}
</style>

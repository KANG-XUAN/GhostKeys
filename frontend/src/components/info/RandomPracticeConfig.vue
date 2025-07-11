<template>
	<div class="container-fluid">
		<div class="row">
			<!-- 左側：虛擬鍵盤區 (col-7) -->
			<div class="col-7">
				<VirtualKeyboard />
			</div>

			<!-- 中間：預設按鍵方案 + 長度設定 (col-3) -->
			<div class="col-3">
				<!-- 文章長度設定 -->
				<div class="input-group">
					<span class="input-group-text input-group-text-left">文章長度</span>
					<input id="lengthInput" type="number" class="form-control form-control-sm"
						v-model.number="typingStore.textLength" @change="handleLengthChange" min="40" max="1000" />
					<span class="input-group-text input-group-text-right">字</span>
				</div>

				<!-- 預設按鍵方案清單 -->
				<div class="list-group preset-list overflow-auto">
					<button v-for="(letters, name) in presets" :key="name" @click="applyPreset(name)"
						class="list-group-item list-group-item-action" :class="{ active: selectedPreset === name }">
						{{ name }}
					</button>
				</div>
			</div>

			<!-- 右側：顯示隨機文字 + 確定按鈕 (col-2) -->
			<div class="text-preview-box col-2 d-flex flex-column">
				<div class="d-flex justify-content-between align-items-center line">
					<h5 class="mb-0 ps-2">隨機文章展示</h5>
					<button class="btn btn-success" @click="confirmText">確定</button>
				</div>

				<!-- 隨機文字展示區 -->
				<!-- ⚠️ pre不能換行、縮排，不然框內會有TAB混入 -->
				<pre class="random-text-box flex-grow-1" style="height: 207px;">
{{ saveTextStore.randomText }}</pre>
			</div>
		</div>
	</div>
</template>


<script setup>
import { ref, nextTick } from 'vue'
import VirtualKeyboard from '@/components/info/Setting_VirtualKeyboard.vue'
import { useTypingStore } from '@/stores/typingStore.js'
import { useSaveTextStore } from '@/stores/saveTextStore.js'

const typingStore = useTypingStore()
const saveTextStore = useSaveTextStore()

// 預設字母範本清單（名稱：按鍵陣列）
const presets = {
	'基礎指法1(基礎八指)': ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
	'基礎指法2(中　列 + 上列小指)': [..."asdfjkl;", 'q', 'p'],
	'基礎指法3(中　列 + 上列環指)': [..."asdfjkl;qp", 'w', 'o'],
	'基礎指法4(中　列 + 上列中指)': [..."asdfjkl;qpwo", 'e', 'i'],
	'基礎指法5(中　列 + 上列食指)': [..."asdfjkl;qpwoei", 'r', 'u'],
	'基礎指法5(中上列 + 食指延伸)': [..."asdfjkl;qpwoeiru", 't', 'g', 'b', 'y', 'h', 'n'],
	'基礎指法6(中上列 + 下列小指)': [..."asdfjkl;qpwoeirutgbyhn", 'z', '/'],
	'基礎指法7(中上列 + 下列環指)': [..."asdfjkl;qpwoeirutgbyhnz/", 'x', '.'],
	'基礎指法8(中上列 + 下列中指)': [..."asdfjkl;qpwoeirutgbyhnz/x.", 'c', ','],
	'基礎指法9(中上列 + 下列食指)': [..."asdfjkl;qpwoeirutgbyhnz/x.c,", 'v', 'm'],
	'☆數字列練習': ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
	'☆全字母練習': [..."abcdefghijklmnopqrstuvwxyz"],
	'☆單手練習(左)': [..."12345qwertasdfgzxcvb"],
	'☆單手練習(右)': [..."67890yuiophjkl;nm,./"],
	'★雙手練習': [..."12345qwertasdfgzxcvb67890yuiophjkl;nm,./"],
	'★盲打練習(字母＋數字)': [..."abcdefghijklmnopqrstuvwxyz1234567890"],
	'★盲打練習(字母＋符號)': [..."abcdefghijklmnopqrstuvwxyz-=[];',./"],
	'★盲打練習(數字＋符號)': [..."1234567890-=[];',./"],
	'★盲打練習(常用按鍵)': [...'abcdefghijklmnopqrstuvwxyz1234567890;,.'],
	'全按鍵啟用': [..."abcdefghijklmnopqrstuvwxyz[]\\;',./`1234567890-="],
	'全按鍵取消': [""],
}

// 使用者選擇的 preset 名稱
const selectedPreset = ref('')

// 套用某個預設字母組合
const applyPreset = (name) => {
	selectedPreset.value = name
	const presetLetters = presets[name] || []
	typingStore.setSelectedLetters(presetLetters)
}

// 確認使用隨機文章
const confirmText = async () => {
	saveTextStore.setCurrentText('')
	await nextTick()
	saveTextStore.setCurrentText(saveTextStore.randomText)

	// 設定捲動條位置（向下移動到輸入區）
	window.scrollTo({ top: 1000 })
}

// 輸入文章長度限制在 40～1000 字內
const handleLengthChange = () => {
	if (typingStore.textLength < 40) typingStore.textLength = 40
	if (typingStore.textLength > 1000) typingStore.textLength = 1000
}
</script>


<style scoped>
.random-text-box {
	background-color: #f8f9fa;
	padding: 10px;
	margin: 0;
	border-radius: 5px;
	white-space: pre-wrap;
	overflow-y: auto;
	font-family: 'Courier New', Courier, monospace;
}

/* 針對 input-group 中的 span 設置樣式 */
.input-group .input-group-text {
	border-radius: 18px 0 0 0;
	/* 上圓角，下面無圓角 */
	border: 2px solid #ccc;
	border-bottom: 0.8px solid #ccc;
	/* 邊框樣式，可以根據需要修改 */
}

.input-group-text-left {
	border-right: 0 !important;
}

.input-group-text-right {
	border-left: 0 !important;
}

/* 針對 input 設置無圓角 */
.input-group .form-control {
	border-radius: 0;
	border-top: 2px solid #ccc;
	border-bottom: 0.8px solid #ccc;
}


.list-group {
	max-height: 220px;
	border-radius: 0 0 6px 6px;
	border: 1px solid #ccc;
	/* 邊框樣式，可以根據需要修改 */
}

.list-group-item {
	border-left: 0;
}

.preset-list button.active {
	background-color: #0d6efd;
	color: white;
}

/* 設定預設按鍵方案清單的底部圓角 */
.preset-list {
	border-radius: 0 0 0 18px;
	/* 只對底部設圓角 */
	border: 2px solid #ccc;
	border-top: 0;
	/* 邊框樣式 */
	margin-bottom: 10px;
	/* 預設按鍵清單和其他元素之間的間距 */
}


/* 使 active 按鈕的樣式更加明顯 */
.preset-list .active {
	background-color: #007bff;
	/* 讓 active 按鈕背景顏色突出 */
	color: white;
}


/* col2 隨機文章 */
.text-preview-box {
	border: 2px solid #ccc;
	border-radius: 0 18px 18px 0;
	/* 對應 col-3 的 preset-list：左下角圓角，這裡是右下角 */
	overflow: hidden;
	background-color: #fff;
	padding: 0;
	height: 258px;
}

.text-preview-box .btn-success {
	border-radius: 0;
}

.text-preview-box .line {
	height: 37px;
	border-bottom: 0.8px solid #ccc;
}
</style>

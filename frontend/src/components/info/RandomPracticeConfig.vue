<template>
	<div class="container-fluid">
		<div class="row">
			<!-- 左側虛擬鍵盤 col-7 -->
			<div class="col-7">
				<VirtualKeyboard />
			</div>

			<!-- 中間：預設按鈕方案 col-3 -->
			<div class="col-3">
				<!-- 新增：設定文章長度 -->
				<div class="input-group mb-2">
					<span class="input-group-text">文章長度</span>
					<input id="lengthInput" type="number" class="form-control form-control-sm"
						v-model.number="store.textLength" @change="handleLengthChange" min="40" max="1000" />
					<span class="input-group-text">字</span>
				</div>

				<div class="list-group preset-list overflow-auto" style="max-height: 205px;">
					<button v-for="(letters, name) in presets" :key="name" @click="applyPreset(name)"
						class="list-group-item list-group-item-action" :class="{ active: selectedPreset === name }">
						{{ name }}
					</button>
				</div>
			</div>

			<div class="col-2 d-flex flex-column">
				<div class="d-flex justify-content-between align-items-center mb-2">
					<h5 class="mb-0">隨機文章展示</h5>
					<button class="btn btn-success" @click="confirmText">確定</button>
				</div>

				<!-- pre不能換行，不然框內會有TAB混入 -->
				<pre class="random-text-box flex-grow-1" style="height: 207px;">{{ store.randomText }}</pre>
			</div>

		</div>
	</div>
</template>

<script setup>
import VirtualKeyboard from '@/components/info/Setting_VirtualKeyboard.vue'
import { useTypingStore } from '@/stores/typingStore.js'
import { useRandomTextExportStore } from '@/stores/randomTextExportStore.js'
import { ref } from 'vue'

const store = useTypingStore()
const exportStore = useRandomTextExportStore() // ⬅ 使用新的 store

// 預設字母對照表（可自行擴充）
const presets = {
	'基礎指法1(基礎八指)': ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
	'基礎指法2(中列 + 上列小指)': ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'q', 'p'],
	'基礎指法3(中列 + 上列環指)': ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'q', 'p', 'w', 'o'],
	'基礎指法4(中列 + 上列中指)': ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'q', 'p', 'w', 'o', 'e', 'i'],
	'基礎指法5(中列 + 上列食指)': ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'q', 'p', 'w', 'o', 'e', 'i', 'r', 'u'],
	'基礎指法5(中上列 + 食指延伸)': ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'q', 'p', 'w', 'o', 'e', 'i', 'r', 'u', 't', 'g', 'b', 'y', 'h', 'n'],
	'基礎指法6(中上列 + 下列小指)': ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'q', 'p', 'w', 'o', 'e', 'i', 'r', 'u', 't', 'g', 'b', 'y', 'h', 'n', 'z', '/'],
	'基礎指法7(中上列 + 下列環指)': ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'q', 'p', 'w', 'o', 'e', 'i', 'r', 'u', 't', 'g', 'b', 'y', 'h', 'n', 'z', '/', 'x', '.'],
	'基礎指法8(中上列 + 下列中指)': ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'q', 'p', 'w', 'o', 'e', 'i', 'r', 'u', 't', 'g', 'b', 'y', 'h', 'n', 'z', '/', 'x', '.', 'c', ','],
	'基礎指法9(中上列 + 下列食指)': ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'q', 'p', 'w', 'o', 'e', 'i', 'r', 'u', 't', 'g', 'b', 'y', 'h', 'n', 'z', '/', 'x', '.', 'c', ',', 'v', 'm'],
	'☆數字列練習': ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
	'☆全字母練習': [...'abcdefghijklmnopqrstuvwxyz'],
	'☆單手練習(左)': [...'12345qwertasdfgzxcvb'],
	'☆單手練習(右)': [...'67890yuiophjkl;nm,./'],
	'☆盲打練習(字母＋數字)': [...'abcdefghijklmnopqrstuvwxyz1234567890'],
	'☆盲打練習(字母＋符號)': [...'abcdefghijklmnopqrstuvwxyz-=[];\',./'],
	'☆盲打練習(數字＋符號)': [...'1234567890-=[];\',./'],
	'☆盲打練習(常用按鍵)': [...'abcdefghijklmnopqrstuvwxyz1234567890;,.'],
	'☆全按鍵啟用': [...'abcdefghijklmnopqrstuvwxyz[]\\;\',./`1234567890-='],
}

const selectedPreset = ref('')

const applyPreset = (name) => {
	selectedPreset.value = name
	const presetLetters = presets[name] || []
	store.setSelectedLetters(presetLetters)
}

const confirmText = () => {
	exportStore.setConfirmedText(store.randomText) // ⬅ 存到 exportStore
	console.log(store.randomText)
}

// 驗證:輸入長度數值
const handleLengthChange = () => {
	if (store.textLength < 40) {
		store.textLength = 40
	}
	if (store.textLength > 1000) {
		store.textLength = 1000
	}
}


</script>

<style scoped>
.random-text-box {
	background-color: #f8f9fa;
	padding: 10px;
	border-radius: 5px;
	white-space: pre-wrap;
	overflow-y: auto;
	font-family: 'Courier New', Courier, monospace;
}

.preset-list button.active {
	background-color: #0d6efd;
	color: white;
}
</style>

<template>
	<div>
		<!-- 表單列：路徑選擇、語言選擇、檔案選擇 -->
		<div class="row align-items-center mb-3">

			<!-- 路徑選擇：main 或 models 下的資料夾 -->
			<div class="col-3">
				<select class="form-select ms-3" v-model="selectedPath" @change="handlePathChange"
					:disabled="boolenStatus.isStartedEnter">
					<option value="main">指法練習</option>
					<optgroup label="models">
						<option v-for="folder in modelFolders" :key="folder" :value="`models/${folder}`">
							{{ folder }}
						</option>
					</optgroup>
				</select>
			</div>

			<!-- 語言選擇：英文 / 中文 -->
			<div class="col-2">
				<select class="form-select ms-2" v-model="selectedLanguage" @change="handleLanguageChange"
					:disabled="boolenStatus.isStartedEnter">
					<option value="en">English</option>
					<option value="ch">中文</option>
				</select>
			</div>

			<!-- 檔案選擇：根據路徑與語言動態載入 -->
			<div class="col-7">
				<select class="form-select" v-model="selectedFile" @change="previewFile"
					:disabled="boolenStatus.isStartedEnter">
					<option disabled value="">請選擇文章</option>
					<option v-for="file in availableFiles" :key="file" :value="file">
						{{ file }}
					</option>
				</select>
			</div>
		</div>

		<!-- 預覽 Modal：顯示文章內容 -->
		<div v-if="showModal" class="modal-backdrop">
			<div class="modal-box">
				<h3 class="text-lg fw-bold mb-2">文章內容預覽</h3>
				<pre class="preview-text">{{ fileContent }}</pre>
				<div class="d-flex justify-content-end mt-3">
					<button class="btn btn-secondary me-2" @click="cancelModal">取消</button>
					<button class="btn btn-primary" @click="confirmContent">確定</button>
				</div>
			</div>
		</div>
	</div>
</template>


<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { useLanguageStore } from '@/stores/languageStore'
import { useTypingStatusStore } from '@/stores/typingStatusStore'
import { useFileStore } from '@/stores/fileStore'

import { useBoolenStatusStore } from '@/stores/boolenStatusStore.js'
const boolenStatus = useBoolenStatusStore()
import { useSaveTextStore } from '@/stores/saveTextStore.js'
const saveTextStore = useSaveTextStore()

// 發出事件（例如 emit('load-content', 內容)）
const emit = defineEmits(['load-content'])

// --------------------------
// 狀態變數區
// --------------------------

const fileContent = ref('')        // 預覽內容
const showModal = ref(false)       // 是否顯示預覽 modal

const allFileMap = ref({})         // 所有檔案地圖（從後端抓取）
const modelFolders = ref([])       // models 下的資料夾名稱列表
const availableFiles = ref([])     // 可供選擇的檔案清單

// --------------------------
// 使用 Pinia Store
// --------------------------

const languageStore = useLanguageStore()
const typingStore = useTypingStatusStore()
const fileStore = useFileStore()

const selectedLanguage = computed({
	get: () => languageStore.current,
	set: val => languageStore.current = val
})

// --------------------------
// store 狀態對應 computed 綁定
// --------------------------

const selectedPath = computed({
	get: () => fileStore.selectedPath,
	set: (val) => fileStore.selectedPath = val
})

const selectedFile = computed({
	get: () => fileStore.selectedFile,
	set: (val) => fileStore.selectedFile = val
})

// --------------------------
// 監聽：打字結束時重置畫面
// --------------------------

watch(() => boolenStatus.isFinishedEnter, (finished) => {
	if (finished) {
		fileStore.clearSelection()
		selectedFile.value = '' // ← 清掉，保證選同檔案也會觸發 @change
		fileContent.value = ''
		showModal.value = false
	}
})

// --------------------------
// 監聽：語言與路徑變更時更新檔案清單
// --------------------------

watch(() => languageStore.current, () => {
	fileStore.selectedFile = ''
	updateAvailableFiles()
})

watch(selectedPath, () => {
	fileStore.selectedFile = ''
	updateAvailableFiles()
})

// --------------------------
// 初始掛載時，取得所有可選檔案資料
// --------------------------

onMounted(async () => {
	const res = await fetch('/api/templates/list')
	const data = await res.json()
	allFileMap.value = data
	modelFolders.value = Object.keys(data.models || {})
	updateAvailableFiles()
})

// --------------------------
// 方法：處理選單改變
// --------------------------

const handlePathChange = () => {
	fileStore.selectedFile = ''
	updateAvailableFiles()
}

const handleLanguageChange = () => {
	fileStore.selectedFile = ''
	updateAvailableFiles()
}

// --------------------------
// 方法：根據路徑與語言更新檔案清單
// --------------------------

const updateAvailableFiles = () => {
	const [base, sub] = selectedPath.value.split('/')
	const lang = languageStore.current  // 直接用 store 裡的 current
	let files = []

	if (base === 'main') {
		files = allFileMap.value.main?.[lang] || []
	} else if (base === 'models' && sub) {
		files = allFileMap.value.models?.[sub]?.[lang] || []
	}

	availableFiles.value = files
}


// --------------------------
// 方法：載入文章內容並預覽
// --------------------------

const previewFile = async () => {
	const path = selectedPath.value
	const lang = selectedLanguage.value
	const fileName = selectedFile.value

	const res = await fetch(`/api/templates/file?path=${path}&lang=${lang}&name=${encodeURIComponent(fileName)}`)
	const rawContent = await res.text()

	fileContent.value = rawContent  // ← 保留原始換行與空行
	showModal.value = true
}


// --------------------------
// Modal 操作方法
// --------------------------

const cancelModal = () => {
	showModal.value = false
	fileContent.value = ''
	fileStore.selectedFile = ''
}

const confirmContent = async () => {
	saveTextStore.setCurrentText('')
	await nextTick() // 等待 DOM & reactivity 更新
	saveTextStore.setFileText(fileContent.value)

	// 預覽視窗關閉
	showModal.value = false

	// 設定捲動條位置（向下移動到輸入區）
	window.scrollTo({ top: 1000 })
}
</script>

<style scoped>
/* 預覽 Modal 背景遮罩 */
.modal-backdrop {
	position: fixed;
	inset: 0;
	background-color: rgba(0, 0, 0, 0.6);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
}

/* Modal 本體樣式 */
.modal-box {
	background: #fdf6e3;
	background-image:
		repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02) 1px, transparent 1px, transparent 24px),
		url('https://www.transparenttextures.com/patterns/paper-fibers.png');
	/* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */
	background-size: contain;
	padding: 2rem;
	border: 2px solid #d8bfa4;
	border-radius: 12px;
	color: #4b382a;
	border-radius: 8px;
	width: 90%;
	max-width: 600px;
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* 預覽文字區塊樣式 */
.preview-text {
	white-space: pre-wrap;
	max-height: 300px;
	overflow-y: auto;
	background: #f8f9fa;
	padding: 1rem;
	border: 1px solid #ccc;
	border-radius: 6px;
}

/* 選單中 optgroup 的縮排 */
select optgroup option {
	padding-left: 1rem;
}
</style>

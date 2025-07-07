<template>
	<div>
		<!-- 表單排版：路徑選擇 + 語言選擇 + 檔案選單 -->
		<div class="row align-items-center mb-3">
			<!-- 路徑選擇 -->
			<div class="col-3">
				<select class="form-select" v-model="selectedPath" @change="handlePathChange" :disabled="isStarted">
					<option value="main">預設</option>
					<optgroup label="models">
						<option v-for="folder in modelFolders" :key="folder" :value="`models/${folder}`">
							{{ folder }}
						</option>
					</optgroup>
				</select>
			</div>

			<!-- 語言選擇 -->
			<div class="col-2">
				<select class="form-select" v-model="languageStore.current" @change="handleLanguageChange"
					:disabled="isStarted">
					<option value="en">English</option>
					<option value="ch">中文</option>
				</select>
			</div>

			<!-- 檔案選擇 -->
			<div class="col-7">
				<select class="form-select" v-model="selectedFile" @change="previewFile" :disabled="isStarted">
					<option disabled value="">請選擇文章</option>
					<option v-for="file in availableFiles" :key="file" :value="file">
						{{ file }}
					</option>
				</select>
			</div>
		</div>

		<!-- Modal 預覽 -->
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
import { ref, onMounted, watch } from 'vue'
import { useLanguageStore } from '@/stores/languageStore'
import { useTypingStatusStore } from '@/stores/typingStatusStore'  // 新增引入

const props = defineProps({
	isStarted: Boolean
})

const emit = defineEmits(['load-content'])

const selectedPath = ref('main')
const selectedFile = ref('')
const fileContent = ref('')
const showModal = ref(false)

const modelFolders = ref([])
const allFileMap = ref({})
const availableFiles = ref([])

const languageStore = useLanguageStore()
const typingStore = useTypingStatusStore()  // 新增取得 typingStatusStore

// 監聽 isFinished 狀態，結束時清空 selectedFile
watch(() => typingStore.isFinished, (finished) => {
	if (finished) {
		selectedFile.value = ''
		fileContent.value = ''
		showModal.value = false
	}
})

// 當語言改變時更新可用檔案清單
watch(() => languageStore.current, () => {
	selectedFile.value = ''
	updateAvailableFiles()
})

// 當路徑改變時更新可用檔案清單
watch(selectedPath, () => {
	selectedFile.value = ''
	updateAvailableFiles()
})

onMounted(async () => {
	const res = await fetch('/api/templates/list')
	const data = await res.json()
	allFileMap.value = data
	modelFolders.value = Object.keys(data.models || {})
	updateAvailableFiles()
})

const handlePathChange = () => {
	selectedFile.value = ''
	updateAvailableFiles()
}

const handleLanguageChange = () => {
	selectedFile.value = ''
	updateAvailableFiles()
}

const updateAvailableFiles = () => {
	const [base, sub] = selectedPath.value.split('/')
	let files = []

	const lang = languageStore.current

	if (base === 'main') {
		files = allFileMap.value.main?.[lang] || []
	} else if (base === 'models' && sub) {
		files = allFileMap.value.models?.[sub]?.[lang] || []
	}

	availableFiles.value = files
}

const previewFile = async () => {
	if (!selectedFile.value) return

	const path = selectedPath.value
	const lang = languageStore.current
	const fileName = selectedFile.value

	const res = await fetch(`/api/templates/file?path=${path}&lang=${lang}&name=${encodeURIComponent(fileName)}`)
	let content = await res.text()

	fileContent.value = content
	showModal.value = true
}

const cancelModal = () => {
	showModal.value = false
	fileContent.value = ''
	selectedFile.value = ''
}

const confirmContent = () => {
	emit('load-content', fileContent.value)
	showModal.value = false
}
</script>


<style scoped>
.modal-backdrop {
	position: fixed;
	inset: 0;
	background-color: rgba(0, 0, 0, 0.6);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
}

.modal-box {
	background: white;
	padding: 2rem;
	border-radius: 8px;
	width: 90%;
	max-width: 600px;
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.preview-text {
	white-space: pre-wrap;
	max-height: 300px;
	overflow-y: auto;
	background: #f8f9fa;
	padding: 1rem;
	border: 1px solid #ccc;
	border-radius: 6px;
}

select optgroup option {
	padding-left: 1rem;
}
</style>

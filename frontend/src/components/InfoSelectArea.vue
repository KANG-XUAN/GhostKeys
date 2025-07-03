<!-- TypingBox.vue -->

<template>
	<div>
		<h2 class="text-lg fw-bold">文章選擇</h2>

		<!-- 表單排版：選單 + 切換器 -->
		<div class="row align-items-center mb-3">
			<!-- 下拉選單（左側 col-9） -->
			<div class="col-9">
				<select class="form-select" v-model="selectedFile" @change="previewFile(currentType, selectedFile)">
					<option disabled value="">{{ placeholderText }}</option>
					<option v-for="file in fileList[currentType]" :key="file" :value="file">
						{{ file }}
					</option>
				</select>

			</div>

			<!-- 類型切換器（右側 col-3） -->
			<div class="col-1 d-flex align-items-center justify-content-center">
				<!-- 左：開關 -->
				<div class="form-check form-switch w-100">
					<input class="form-check-input big-switch" type="checkbox" id="typeToggle" v-model="isModelType" />
				</div>
			</div>
			<div class="col-2 d-flex align-items-center justify-content-start">
				<!-- 右：分類文字 -->
				<div>
					<label class="form-check-label fw-semibold" for="typeToggle">
						{{ currentTypeLabel }}
					</label>
				</div>
			</div>

		</div>

		<!-- Modal 遮罩浮窗 -->
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
import { ref, computed, watch, onMounted } from 'vue'

const emit = defineEmits(['load-content'])

const fileList = ref({ main: [], models: [] })
const selectedFile = ref('')
const fileContent = ref('')
const showModal = ref(false)

// 開關狀態：true = models，false = main
const isModelType = ref(false)
const currentType = computed(() => (isModelType.value ? 'models' : 'main'))
const currentTypeLabel = computed(() => (isModelType.value ? '當前選擇：Models' : '當前選擇：主文章'))

// 當分類切換時，清空下拉選單選擇
watch(currentType, () => {
	selectedFile.value = ''
})
const placeholderText = computed(() =>
	isModelType.value ? '請選擇自選文章' : '請選擇預設文章'
)

onMounted(async () => {
	const res = await fetch('/api/templates/list')
	fileList.value = await res.json()
})

const previewFile = async (type, name) => {
	if (!name) return
	const res = await fetch(`/api/templates/file?type=${type}&name=${encodeURIComponent(name)}`)
	let content = await res.text()

	// 把多個連續空行，替換成最多只保留一個空行
	// 使用正則表達式將連續的多個空行，換成一個空行
	// content = content.replace(/(\n\s*\n)+/g, '\n\n')

	// 另外，如果你想完全去除空行，可改成：
	content = content.split('\n').filter(line => line.trim() !== '').join('\n')

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
.form-check-input {
	cursor: pointer;
}

.form-check-label {
	cursor: pointer;
	user-select: none;
}

.modal-backdrop {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
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

/* 放大開關 */
.big-switch {
	width: 4rem !important;
	height: 2rem;
}

.big-switch:checked {
	background-color: #0d6efd;
}

.big-switch:focus {
	box-shadow: none;
}
</style>

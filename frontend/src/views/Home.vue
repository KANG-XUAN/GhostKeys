<template>
	<div>
		<div class="main-content"></div>
		<div class="container-fluid">
			<div class="row">
				<HeaderNavArea @switch="setLanguage" />
			</div>
		</div>

		<div class="container">
			<InfoSettingArea @load-content="handleContentLoad" :text="sentence" />
			<FloatInfoArea :errorCount="currentErrorCount" :inputCount="currentInputCount" />

			<InputArea :rawText="selectedText" @update-error-count="updateErrorCount"
				@update-input-count="updateInputCount" />
		</div>

		<!-- 浮動鍵盤 -->
		<FloatInfoArea :errorCount="currentErrorCount" :inputCount="currentInputCount" />
		<!-- 在 FooterArea 之前加這段 -->
		<div v-if="keyboardStore.isKeyboardOpen" class="keyboard-padding"></div>

		<div class="container-fluid">
			<div class="row">
				<FooterArea />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watchEffect, nextTick, watch } from 'vue'
import HeaderNavArea from '@/components/common/HeaderNavArea.vue'
import FooterArea from '@/components/common/FooterArea.vue'
import FloatInfoArea from '@/components/FloatInfoArea.vue'
import InfoSettingArea from '@/components/info/InfoSettingArea.vue'
import InputArea from '@/components/typing/InputArea.vue'
import { useKeyboardStore } from '@/stores/keyboardStore.js'
const keyboardStore = useKeyboardStore()


const language = ref('en')
const sentence = ref('')
const sentenceProvider = ref(null)

const setLanguage = (lang) => {
	language.value = lang
}


import { useRandomTextExportStore } from '@/stores/randomTextExportStore.js'
const exportStore = useRandomTextExportStore()

const selectedText = ref('')

// 包一個函式，先清空再設定，保證每次都觸發更新
const setSelectedText = async (newText) => {
	if (selectedText.value === newText) {
		selectedText.value = ''
		await nextTick()
	}
	selectedText.value = newText
}

watchEffect(() => {
	if (exportStore.confirmedText) {
		setSelectedText(exportStore.confirmedText)
	}
})

// 將檔案內容丟入練習區
const handleContentLoad = (text) => {
	setSelectedText(text)
}

// 錯誤與輸入字數
const currentErrorCount = ref(0)
const currentInputCount = ref(0)

const updateErrorCount = (count) => {
	currentErrorCount.value = count
}
const updateInputCount = (count) => {
	currentInputCount.value = count
}

watch(language, () => {
	if (sentenceProvider.value && sentenceProvider.value.currentSentence) {
		sentence.value = sentenceProvider.value.currentSentence
	} else {
		sentence.value = ''
	}
})
</script>

<style scoped>
.main-content {
	padding-top: 80px;
	/* 頂欄高度，對應 nav-wrapper 固定高度 */
}

.keyboard-padding {
	height: 220px;
}
</style>

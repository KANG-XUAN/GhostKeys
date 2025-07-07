<template>
	<div>
		<div class="container-fluid">
			<div class="row">
				<HeaderNavArea @switch="setLanguage" />
			</div>
		</div>
		<div class="main-content"></div>

		<div class="container">
			<InfoSettingArea @load-content="handleContentLoad" :text="sentence" />

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
import { ref, watch } from 'vue'
import HeaderNavArea from '@/components/common/HeaderNavArea.vue'
import FooterArea from '@/components/common/FooterArea.vue'
import FloatInfoArea from '@/components/FloatInfoArea.vue'
import InfoSettingArea from '@/components/info/InfoSettingArea.vue'
import InputArea from '@/components/typing/InputArea.vue'

// 浮動鍵盤留白
import { useKeyboardStore } from '@/stores/keyboardStore.js'
const keyboardStore = useKeyboardStore()

const language = ref('en')
const sentence = ref('')
const sentenceProvider = ref(null)

const setLanguage = (lang) => {
	language.value = lang
}


import { useRandomTextExportStore } from '@/stores/randomTextExportStore.js'
import { watchEffect } from 'vue'
const exportStore = useRandomTextExportStore()
// 當 pinia store 的文章更新時，selectedText 也同步更新
watchEffect(() => {
	if (exportStore.confirmedText) {
		selectedText.value = exportStore.confirmedText
	}
})


// 將檔案內容丟入練習區
const selectedText = ref('')
const handleContentLoad = (text) => {
	selectedText.value = text
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
<template>
	<div>
		<div class="container-fluid">
			<div class="row">
				<HeaderNavArea @switch="setLanguage" />
			</div>
		</div>

		<div class="container">
			<InfoSelectArea @load-content="handleContentLoad" :text="sentence" />
			<InfoArea :start="isTyping" :errorCount="currentErrorCount" :inputCount="currentInputCount" />

			<InputArea :rawText="selectedText" @typing-start="onTypingStart" @update-error-count="updateErrorCount"
				@update-input-count="updateInputCount" />
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue'
import HeaderNavArea from '@/components/HeaderNavArea.vue'
import InfoArea from '@/components/InfoArea.vue'
import InfoSelectArea from '@/components/InfoSelectArea.vue'
import InputArea from '@/components/InputArea.vue'

const language = ref('en')
const sentence = ref('')
const sentenceProvider = ref(null)

const setLanguage = (lang) => {
	language.value = lang
}


// 將檔案內容丟入練習區
const selectedText = ref('')
const handleContentLoad = (text) => {
	selectedText.value = text
}

// info資訊區
const isTyping = ref(false)
// 在打字區觸發時改為 true
const onTypingStart = () => {
	if (!isTyping.value) {
		isTyping.value = true
	}
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

<template>
	<div>
		<div class="main-content"></div>
		<div class="container-fluid">
			<div class="row">
				<HeaderNavArea @switch="setLanguage" />
			</div>
		</div>

		<div class="container">
			<InfoSettingArea :text="sentence" />
			<!-- <FloatInfoArea :errorCount="currentErrorCount" :inputCount="currentInputCount" /> -->

			<InputArea @update-error-count="updateErrorCount" @update-input-count="updateInputCount" />
		</div>

		<!-- 浮動鍵盤 -->
		<FloatInfoArea :errorCount="countNumberStore.errorCount" :inputCount="countNumberStore.inputCount" />
		<!-- 在 FooterArea 之前加這段 -->
		<div v-if="boolenStatus.isKeyboardOpen" class="keyboard-padding"></div>

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

// Pinia
import { useBoolenStatusStore } from '@/stores/boolenStatusStore.js'
const boolenStatus = useBoolenStatusStore()
import { useCountNumberStore } from '@/stores/countNumberStore.js'
const countNumberStore = useCountNumberStore()


const language = ref('en')
const sentence = ref('')
const sentenceProvider = ref(null)

const setLanguage = (lang) => {
	language.value = lang
}


// 替代原本的 ref
const updateErrorCount = (count) => {
  countNumberStore.setErrorCount(count)
}

const updateInputCount = (count) => {
  countNumberStore.setInputCount(count)
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

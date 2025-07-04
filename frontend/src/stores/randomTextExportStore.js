import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRandomTextExportStore = defineStore('randomTextExport', () => {
	const confirmedText = ref('')

	function wrapText(text, maxLength = 56) {
		const words = text.split(/(\s+)/)  // 拆字並保留空白（不會吃掉空格）
		let line = ''
		const lines = []

		for (const word of words) {
			// 預計加上這個字後會超過長度
			if ((line + word).length > maxLength) {
				if (line.trim().length > 0) {
					// 移除開頭空格（如果有）
					lines.push(line.trimStart().trimEnd())
					line = ''
				}

				// 如果這個 word 自己就超過一行長度，強制切割
				if (word.length > maxLength) {
					let start = 0
					while (start < word.length) {
						lines.push(word.slice(start, start + maxLength))
						start += maxLength
					}
					line = ''
				} else {
					line = word
				}
			} else {
				line += word
			}
		}

		if (line.trim().length > 0) {
			lines.push(line.trimStart().trimEnd())
		}

		return lines.join('\n')
	}


	function setConfirmedText(text) {
		confirmedText.value = wrapText(text)
	}

	return { confirmedText, setConfirmedText }
})

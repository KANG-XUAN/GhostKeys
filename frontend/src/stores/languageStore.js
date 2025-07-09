// frontend/src/stores/language.js


// 在任何組件中都可以透過 langStore.current 拿到目前語言狀態，這樣就不用透過 props 傳遞了。

import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', {
	state: () => ({
		current: 'en'
	}),
	actions: {
		setLanguage(lang) {
			this.current = lang
		}
	}
})

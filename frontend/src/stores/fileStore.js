// stores/fileStore.js
import { defineStore } from 'pinia'

export const useFileStore = defineStore('file', {
	state: () => ({
		selectedPath: 'main',
		selectedFile: '',
	}),
	actions: {
		clearSelection() {
			this.selectedPath = 'main'
			this.selectedFile = ''
		},
	},
})

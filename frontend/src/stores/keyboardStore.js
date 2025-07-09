import { defineStore } from 'pinia'

export const useKeyboardStore = defineStore('keyboard', {
  state: () => ({
    isKeyboardOpen: false
  }),
  actions: {
    toggleKeyboard() {
      this.isKeyboardOpen = !this.isKeyboardOpen
    }
  }
})

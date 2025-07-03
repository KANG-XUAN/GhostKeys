<!-- frontend/src/components/LanguageSelector.vue -->


<template>
  <div class="nav-bar d-flex text-center">
    <button class="flex-fill nav-btn" @click="langStore.setLanguage('en')">English</button>
    <button class="flex-fill nav-btn" @click="langStore.setLanguage('zh')">中文</button>
  </div>
</template>

<script setup>
import { useLanguageStore } from '@/stores/language'
const langStore = useLanguageStore()
</script>

<style scoped>
.nav-bar {
  background-color: #1e1e2f;
  padding: 0.5rem 0;
}

.nav-btn {
  background: transparent;
  border: none;
  color: #f1f1f1;
  padding: 0.75rem;
  font-weight: 500;
  transition: background-color 0.3s, color 0.3s;
}

.nav-btn:hover {
  background-color: #343a40;
  color: #00d8ff;
  cursor: pointer;
}
</style>

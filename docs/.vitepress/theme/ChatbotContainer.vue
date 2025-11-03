<template>
  <div>
    <ChatbotButton :is-open="isChatbotOpen" @toggle="toggleChatbot" />
    <ChatbotWidget :is-open="isChatbotOpen" @close="closeChatbot" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatbotButton from './ChatbotButton.vue'
import ChatbotWidget from './ChatbotWidget.vue'

const isChatbotOpen = ref(false)

function toggleChatbot() {
  isChatbotOpen.value = !isChatbotOpen.value
}

function closeChatbot() {
  isChatbotOpen.value = false
}
</script>

<template>
  <button
    class="chatbot-fab"
    @click="toggleChatbot"
    :class="{ active: isOpen }"
    title="打开 AI 学习助手"
  >
    <Transition name="icon-rotate" mode="out-in">
      <span v-if="!isOpen" key="chat">💬</span>
      <span v-else key="close">✕</span>
    </Transition>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

function toggleChatbot() {
  emit('toggle')
}
</script>

<style scoped>
.chatbot-fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  z-index: 9998;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
}

.chatbot-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 28px rgba(59, 130, 246, 0.6);
}

.chatbot-fab:active {
  transform: scale(0.95);
}

.chatbot-fab.active {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.5);
}

.chatbot-fab.active:hover {
  box-shadow: 0 6px 28px rgba(239, 68, 68, 0.6);
}

/* Icon transition */
.icon-rotate-enter-active,
.icon-rotate-leave-active {
  transition: all 0.3s ease;
}

.icon-rotate-enter-from {
  opacity: 0;
  transform: rotate(-180deg) scale(0);
}

.icon-rotate-leave-to {
  opacity: 0;
  transform: rotate(180deg) scale(0);
}

/* Responsive */
@media (max-width: 768px) {
  .chatbot-fab {
    width: 56px;
    height: 56px;
    right: 20px;
    bottom: 20px;
    font-size: 24px;
  }
}

/* Hide on very small screens if needed */
@media (max-width: 400px) {
  .chatbot-fab {
    width: 52px;
    height: 52px;
    right: 16px;
    bottom: 16px;
    font-size: 22px;
  }
}
</style>

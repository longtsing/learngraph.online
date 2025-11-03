<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div
        v-if="isOpen"
        class="chatbot-widget"
        :style="widgetStyle"
        ref="widgetRef"
      >
        <!-- Header with drag functionality -->
        <div
          class="chatbot-header"
          @mousedown="startDrag"
        >
          <span class="chatbot-title">🤖 LangGraph 学习助手</span>
          <button @click="closeDialog" class="close-btn" title="关闭">✕</button>
        </div>

        <!-- Messages Area -->
        <div class="chatbot-messages" ref="messagesContainer">
          <!-- Welcome message -->
          <div v-if="messages.length === 0" class="welcome-msg">
            <p>👋 你好！我是 LangGraph 学习助手</p>
            <p>问我任何关于 LangGraph、AI Agent 的问题</p>
          </div>

          <!-- Message history -->
          <div v-if="messages.length > 0" class="history-list">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              class="message-item"
              :class="{
                expanded: expandedMessages.has(index),
                'user-message': msg.role === 'user',
                'assistant-message': msg.role === 'assistant'
              }"
            >
              <!-- Collapsed view -->
              <div
                v-if="!expandedMessages.has(index)"
                class="message-collapsed"
                @click="toggleMessage(index)"
              >
                <span class="msg-icon">{{ msg.role === 'user' ? '👤' : '🤖' }}</span>
                <span class="msg-preview">{{ getMessagePreview(msg.content) }}</span>
                <span class="expand-icon">▶</span>
              </div>

              <!-- Expanded view -->
              <div
                v-else
                class="message-expanded"
              >
                <div class="message-expanded-header" @click="toggleMessage(index)">
                  <span class="msg-icon">{{ msg.role === 'user' ? '👤' : '🤖' }}</span>
                  <span class="collapse-icon">▼</span>
                </div>
                <div class="message-expanded-content">
                  <div v-html="renderMessage(msg.content)"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading indicator -->
          <div v-if="isLoading" class="message assistant">
            <div class="msg-avatar">🤖</div>
            <div class="msg-content">
              <div class="loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="chatbot-input">
          <textarea
            v-model="userInput"
            @keydown.enter.ctrl="sendMessage"
            @keydown.enter.meta="sendMessage"
            placeholder="输入你的问题... (Ctrl/Cmd+Enter 发送)"
            rows="2"
            :disabled="isLoading"
            ref="inputRef"
          ></textarea>
          <button
            @click="sendMessage"
            :disabled="!userInput.trim() || isLoading"
            class="send-btn"
          >
            {{ isLoading ? '⏳' : '📤' }}
          </button>
        </div>

        <!-- Resize handles -->
        <div class="resize-handle resize-right" @mousedown="startResize($event, 'right')"></div>
        <div class="resize-handle resize-bottom" @mousedown="startResize($event, 'bottom')"></div>
        <div class="resize-handle resize-bottom-right" @mousedown="startResize($event, 'bottom-right')"></div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

// Component state
const messages = ref<Message[]>([])
const userInput = ref('')
const isLoading = ref(false)
const expandedMessages = ref<Set<number>>(new Set())
const messagesContainer = ref<HTMLElement | null>(null)
const widgetRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)

// Widget position and size
const widgetPosition = ref({ x: 0, y: 0 })
const widgetSize = ref({ width: 480, height: 600 })
const isDragging = ref(false)
const isResizing = ref(false)
const resizeDirection = ref('')
const dragStart = ref({ x: 0, y: 0 })

// Calculate widget position (bottom-right by default)
const widgetStyle = computed(() => {
  const defaultRight = 20
  const defaultBottom = 20

  if (widgetPosition.value.x === 0 && widgetPosition.value.y === 0) {
    return {
      position: 'fixed',
      right: `${defaultRight}px`,
      bottom: `${defaultBottom}px`,
      width: `${widgetSize.value.width}px`,
      height: `${widgetSize.value.height}px`,
    }
  }

  return {
    position: 'fixed',
    left: `${widgetPosition.value.x}px`,
    top: `${widgetPosition.value.y}px`,
    width: `${widgetSize.value.width}px`,
    height: `${widgetSize.value.height}px`,
  }
})

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true
})

// Render message with Markdown
function renderMessage(content: string): string {
  try {
    const html = marked.parse(content) as string
    return DOMPurify.sanitize(html)
  } catch (err) {
    console.error('Failed to render markdown:', err)
    return content.replace(/\n/g, '<br>')
  }
}

// Get API Keys
function getApiKeys(): { openai?: string; anthropic?: string; deepseek?: string } {
  try {
    return {
      openai: localStorage.getItem('langgraph_api_openai') || undefined,
      anthropic: localStorage.getItem('langgraph_api_anthropic') || undefined,
      deepseek: localStorage.getItem('langgraph_api_deepseek') || undefined,
    }
  } catch (err) {
    console.error('Failed to get API keys:', err)
  }
  return {}
}

// Send message
async function sendMessage() {
  if (!userInput.value.trim() || isLoading.value) return

  const question = userInput.value.trim()

  messages.value.push({
    role: 'user',
    content: question
  })

  userInput.value = ''
  isLoading.value = true

  await scrollToBottom()

  try {
    const apiKeys = getApiKeys()
    if (!apiKeys.openai && !apiKeys.anthropic && !apiKeys.deepseek) {
      messages.value.push({
        role: 'assistant',
        content: '❌ 需要配置 API Key\n\n请在浏览器 localStorage 中设置以下任一 key:\n- `langgraph_api_openai`\n- `langgraph_api_anthropic`\n- `langgraph_api_deepseek`'
      })
      return
    }

    const requestBody = {
      user_question: question,
      messages: messages.value.slice(0, -1).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      context: null
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (apiKeys.deepseek) headers['X-DeepSeek-API-Key'] = apiKeys.deepseek
    if (apiKeys.openai) headers['X-OpenAI-API-Key'] = apiKeys.openai
    if (apiKeys.anthropic) headers['X-Anthropic-API-Key'] = apiKeys.anthropic

    const response = await fetch(`${getBackendUrl()}/api/chat/ask`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    })

    const result = await response.json()

    if (result.success) {
      messages.value.push({
        role: 'assistant',
        content: result.response
      })
    } else {
      messages.value.push({
        role: 'assistant',
        content: `❌ ${result.error}`
      })
    }
  } catch (err: any) {
    messages.value.push({
      role: 'assistant',
      content: `❌ 错误: ${err.message || String(err)}`
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

// Get backend URL
function getBackendUrl(): string {
  if (import.meta.env.DEV) {
    return 'http://localhost:8000'
  }
  return 'https://learngraph-backend.onrender.com'
}

// Get message preview (first 50 chars)
function getMessagePreview(content: string): string {
  const textOnly = content.replace(/```[\s\S]*?```/g, '[代码]')
  const singleLine = textOnly.replace(/\n/g, ' ').trim()
  return singleLine.length > 50 ? singleLine.substring(0, 50) + '...' : singleLine
}

// Toggle message expand/collapse
function toggleMessage(index: number) {
  if (expandedMessages.value.has(index)) {
    expandedMessages.value.delete(index)
  } else {
    expandedMessages.value.add(index)
  }
}

// Scroll to bottom
async function scrollToBottom() {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Close dialog
function closeDialog() {
  emit('close')
}

// Drag functionality
function startDrag(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('close-btn')) return

  isDragging.value = true
  dragStart.value = {
    x: e.clientX - widgetPosition.value.x,
    y: e.clientY - widgetPosition.value.y
  }

  if (widgetPosition.value.x === 0 && widgetPosition.value.y === 0) {
    const rect = widgetRef.value?.getBoundingClientRect()
    if (rect) {
      widgetPosition.value = {
        x: rect.left,
        y: rect.top
      }
      dragStart.value = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }
  }

  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
  e.preventDefault()
}

function handleDrag(e: MouseEvent) {
  if (!isDragging.value) return

  widgetPosition.value = {
    x: e.clientX - dragStart.value.x,
    y: e.clientY - dragStart.value.y
  }
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// Resize functionality
function startResize(e: MouseEvent, direction: string) {
  isResizing.value = true
  resizeDirection.value = direction
  dragStart.value = {
    x: e.clientX,
    y: e.clientY
  }

  if (widgetPosition.value.x === 0 && widgetPosition.value.y === 0) {
    const rect = widgetRef.value?.getBoundingClientRect()
    if (rect) {
      widgetPosition.value = {
        x: rect.left,
        y: rect.top
      }
    }
  }

  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  e.preventDefault()
  e.stopPropagation()
}

function handleResize(e: MouseEvent) {
  if (!isResizing.value) return

  const deltaX = e.clientX - dragStart.value.x
  const deltaY = e.clientY - dragStart.value.y
  const minWidth = 320
  const minHeight = 400

  const direction = resizeDirection.value

  if (direction.includes('right')) {
    widgetSize.value.width = Math.max(minWidth, widgetSize.value.width + deltaX)
    dragStart.value.x = e.clientX
  }
  if (direction.includes('bottom')) {
    widgetSize.value.height = Math.max(minHeight, widgetSize.value.height + deltaY)
    dragStart.value.y = e.clientY
  }
}

function stopResize() {
  isResizing.value = false
  resizeDirection.value = ''
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

// Watch for dialog open
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})
</script>

<style scoped>
.chatbot-widget {
  position: fixed;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 9999;
  overflow: hidden;
}

/* Header */
.chatbot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  cursor: move;
  user-select: none;
}

.chatbot-title {
  font-size: 14px;
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Messages Area */
.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: var(--vp-c-bg);
  min-height: 0;
}

.welcome-msg {
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 13px;
  padding: 32px 16px;
}

.welcome-msg p {
  margin: 8px 0;
}

.welcome-msg p:first-child {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

/* Message History */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-item {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Collapsed Message */
.message-collapsed {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
}

.message-item.user-message .message-collapsed {
  background: #eff6ff;
  border-color: #93c5fd;
}

.dark .message-item.user-message .message-collapsed {
  background: #1e3a8a;
  border-color: #3b82f6;
}

.message-item.assistant-message .message-collapsed {
  background: #f0fdf4;
  border-color: #86efac;
}

.dark .message-item.assistant-message .message-collapsed {
  background: #14532d;
  border-color: #22c55e;
}

.message-collapsed:hover {
  opacity: 0.9;
  transform: translateX(2px);
}

.msg-icon {
  flex-shrink: 0;
  font-size: 16px;
}

.msg-preview {
  flex: 1;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expand-icon {
  flex-shrink: 0;
  font-size: 10px;
  color: var(--vp-c-text-3);
  transition: transform 0.2s;
}

/* Expanded Message */
.message-expanded {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.message-item.user-message .message-expanded {
  background: #eff6ff;
  border-color: #93c5fd;
}

.dark .message-item.user-message .message-expanded {
  background: #1e3a8a;
  border-color: #3b82f6;
}

.message-item.assistant-message .message-expanded {
  background: #f0fdf4;
  border-color: #86efac;
}

.dark .message-item.assistant-message .message-expanded {
  background: #14532d;
  border-color: #22c55e;
}

.message-expanded-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.03);
  cursor: pointer;
  transition: background 0.2s;
  user-select: none;
}

.dark .message-expanded-header {
  background: rgba(255, 255, 255, 0.05);
}

.message-expanded-header:hover {
  background: rgba(0, 0, 0, 0.06);
}

.dark .message-expanded-header:hover {
  background: rgba(255, 255, 255, 0.08);
}

.collapse-icon {
  font-size: 10px;
  color: var(--vp-c-text-3);
}

.message-expanded-content {
  padding: 14px;
  color: var(--vp-c-text-1);
  line-height: 1.6;
  word-wrap: break-word;
  font-size: 13px;
}

/* Loading indicator */
.message {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  animation: fadeIn 0.3s;
}

.msg-avatar {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.msg-content {
  flex: 1;
  padding: 10px 14px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.loading-dots {
  display: inline-flex;
  gap: 4px;
}

.loading-dots span {
  animation: bounce 1.4s infinite;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-6px);
  }
}

/* Input Area */
.chatbot-input {
  padding: 12px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  display: flex;
  gap: 10px;
}

.chatbot-input textarea {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: inherit;
  font-size: 13px;
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  line-height: 1.5;
}

.chatbot-input textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.chatbot-input textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-btn {
  padding: 10px 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  white-space: nowrap;
  align-self: flex-end;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.send-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

/* Resize Handles */
.resize-handle {
  position: absolute;
  background: transparent;
  z-index: 10;
}

.resize-right {
  top: 0;
  bottom: 0;
  right: 0;
  width: 8px;
  cursor: ew-resize;
}

.resize-bottom {
  left: 0;
  right: 0;
  bottom: 0;
  height: 8px;
  cursor: ns-resize;
}

.resize-bottom-right {
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
}

/* Markdown content styles */
.message-expanded-content :deep(pre) {
  background: #1e1e1e;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 10px 0;
  font-size: 12px;
}

.message-expanded-content :deep(code) {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
}

.message-expanded-content :deep(pre code) {
  background: none;
  padding: 0;
  color: #86efac;
}

.message-expanded-content :deep(p) {
  margin: 8px 0;
}

.message-expanded-content :deep(ul),
.message-expanded-content :deep(ol) {
  margin: 8px 0;
  padding-left: 20px;
}

.message-expanded-content :deep(li) {
  margin: 4px 0;
}

/* Transition */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

/* Scrollbar */
.chatbot-messages::-webkit-scrollbar {
  width: 8px;
}

.chatbot-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chatbot-messages::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 4px;
}

.chatbot-messages::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-text-3);
}

/* Responsive */
@media (max-width: 768px) {
  .chatbot-widget {
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
  }
}
</style>

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
          <span class="chatbot-title">🤖 ChatBot</span>
          <button @click="closeDialog" class="close-btn" title="关闭">✕</button>
        </div>

        <!-- Messages Area with collapsible history -->
        <div class="chatbot-messages" ref="messagesContainer">
          <!-- Welcome message -->
          <div v-if="messages.length === 0" class="welcome-msg">
            <p>问我任何关于代码的问题</p>
          </div>

          <!-- Message history with individual expand/collapse -->
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
              <!-- Collapsed view (1 line) -->
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
            placeholder="输入问题... (Ctrl/Cmd+Enter)"
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
        <div class="resize-handle resize-top" @mousedown="startResize($event, 'top')"></div>
        <div class="resize-handle resize-right" @mousedown="startResize($event, 'right')"></div>
        <div class="resize-handle resize-bottom" @mousedown="startResize($event, 'bottom')"></div>
        <div class="resize-handle resize-left" @mousedown="startResize($event, 'left')"></div>
        <div class="resize-handle resize-top-left" @mousedown="startResize($event, 'top-left')"></div>
        <div class="resize-handle resize-top-right" @mousedown="startResize($event, 'top-right')"></div>
        <div class="resize-handle resize-bottom-left" @mousedown="startResize($event, 'bottom-left')"></div>
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
  hasCode?: boolean
}

const props = defineProps<{
  isOpen: boolean
  code: string
}>()

const emit = defineEmits<{
  close: []
  applyCode: [code: string]
}>()

// Component state
const messages = ref<Message[]>([])
const userInput = ref('')
const isLoading = ref(false)
const expandedMessages = ref<Set<number>>(new Set())
const messagesContainer = ref<HTMLElement | null>(null)
const widgetRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)

// Widget position and size (1.2x larger)
const widgetPosition = ref({ x: 0, y: 0 })
const widgetSize = ref({ width: 456, height: 600 })
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

// Get API Key
function getApiKey(): string | null {
  try {
    return localStorage.getItem('langgraph_api_openai')
  } catch (err) {
    console.error('Failed to get API key:', err)
  }
  return null
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
    const apiKey = getApiKey()
    if (!apiKey) {
      messages.value.push({
        role: 'assistant',
        content: '❌ 需要 OpenAI API Key\n\n请访问 "⚡ Python 运行器" 配置'
      })
      return
    }

    const requestBody = {
      code: props.code,
      user_question: question,
      messages: messages.value.slice(0, -1).map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    }

    const response = await fetch(`${getBackendUrl()}/api/chat/explain-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OpenAI-API-Key': apiKey
      },
      body: JSON.stringify(requestBody)
    })

    const result = await response.json()

    if (result.success) {
      messages.value.push({
        role: 'assistant',
        content: result.response,
        hasCode: result.has_code
      })

      // 如果响应包含代码，自动应用到代码块
      if (result.has_code) {
        const code = extractCode(result.response)
        if (code) {
          emit('applyCode', code)
        }
      }
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
  return 'https://learnpy-online-backend.onrender.com'
}

// Extract code from response
function extractCode(content: string): string | null {
  const match = content.match(/```python\n([\s\S]*?)\n```/)
  return match ? match[1].trim() : null
}

// Get message preview (first 50 chars)
function getMessagePreview(content: string): string {
  // Remove markdown code blocks for preview
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

// Close dialog and clear history
function closeDialog() {
  messages.value = []
  expandedMessages.value.clear()
  widgetPosition.value = { x: 0, y: 0 }
  widgetSize.value = { width: 456, height: 600 }
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

  // If widget is in default position, calculate current position
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

  // Calculate current position if in default mode
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
  const minWidth = 300
  const minHeight = 350

  const direction = resizeDirection.value

  if (direction.includes('right')) {
    widgetSize.value.width = Math.max(minWidth, widgetSize.value.width + deltaX)
    dragStart.value.x = e.clientX
  }
  if (direction.includes('left')) {
    const newWidth = Math.max(minWidth, widgetSize.value.width - deltaX)
    if (newWidth > minWidth) {
      widgetPosition.value.x += deltaX
      widgetSize.value.width = newWidth
      dragStart.value.x = e.clientX
    }
  }
  if (direction.includes('bottom')) {
    widgetSize.value.height = Math.max(minHeight, widgetSize.value.height + deltaY)
    dragStart.value.y = e.clientY
  }
  if (direction.includes('top')) {
    const newHeight = Math.max(minHeight, widgetSize.value.height - deltaY)
    if (newHeight > minHeight) {
      widgetPosition.value.y += deltaY
      widgetSize.value.height = newHeight
      dragStart.value.y = e.clientY
    }
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
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
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
  padding: 8px 12px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  cursor: move;
  user-select: none;
}

.chatbot-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.close-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: var(--vp-c-text-2);
  padding: 2px 6px;
  border-radius: 3px;
  transition: all 0.2s;
  line-height: 1;
}

.close-btn:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

/* Messages Area */
.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  background: var(--vp-c-bg);
  min-height: 0;
}

.welcome-msg {
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 12px;
  padding: 20px 10px;
}

.welcome-msg p {
  margin: 0;
}

/* Message History List */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
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

/* Collapsed Message (1 line) */
.message-collapsed {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 11px;
}

/* User message - light green background */
.message-item.user-message .message-collapsed {
  background: #f0fdf4;
  border-color: #86efac;
}

.dark .message-item.user-message .message-collapsed {
  background: #14532d;
  border-color: #166534;
}

/* AI message - light purple background */
.message-item.assistant-message .message-collapsed {
  background: #faf5ff;
  border-color: #e9d5ff;
}

.dark .message-item.assistant-message .message-collapsed {
  background: #3b0764;
  border-color: #6b21a8;
}

.message-collapsed:hover {
  opacity: 0.9;
  transform: translateX(2px);
}

.msg-icon {
  flex-shrink: 0;
  font-size: 14px;
}

.msg-preview {
  flex: 1;
  color: var(--vp-c-text-2);
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

.message-collapsed:hover .expand-icon {
  transform: translateX(2px);
}

/* Expanded Message */
.message-expanded {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  overflow: hidden;
}

/* User message expanded - light green */
.message-item.user-message .message-expanded {
  background: #f0fdf4;
  border-color: #86efac;
}

.dark .message-item.user-message .message-expanded {
  background: #14532d;
  border-color: #166534;
}

/* AI message expanded - light purple */
.message-item.assistant-message .message-expanded {
  background: #faf5ff;
  border-color: #e9d5ff;
}

.dark .message-item.assistant-message .message-expanded {
  background: #3b0764;
  border-color: #6b21a8;
}

.message-expanded-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
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
  padding: 10px;
  color: var(--vp-c-text-1);
  line-height: 1.5;
  word-wrap: break-word;
  font-size: 11px;
}

/* Messages (for loading indicator) */
.message {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  animation: fadeIn 0.3s;
  font-size: 12px;
}

.msg-avatar {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 50%;
  background: var(--vp-c-bg);
}

.message.assistant .msg-avatar {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.msg-content {
  flex: 1;
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  line-height: 1.5;
  word-wrap: break-word;
  font-size: 11px;
}

/* Markdown styles for expanded content */
.message-expanded-content :deep(pre) {
  background: #1e1e1e;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 8px 0;
  font-size: 10px;
}

.message-expanded-content :deep(code) {
  background: rgba(0, 0, 0, 0.1);
  padding: 1px 4px;
  border-radius: 2px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 10px;
}

.message-expanded-content :deep(pre code) {
  background: none;
  padding: 0;
  color: #86efac;
}

.dark .message-expanded-content :deep(pre code) {
  color: #86efac;
}

.message-expanded-content :deep(p) {
  margin: 4px 0;
}

.message-expanded-content :deep(ul),
.message-expanded-content :deep(ol) {
  margin: 6px 0;
  padding-left: 16px;
}

.message-expanded-content :deep(li) {
  margin: 3px 0;
}

.loading-dots {
  display: inline-flex;
  gap: 3px;
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
  padding: 10px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  display: flex;
  gap: 8px;
}

.chatbot-input textarea {
  flex: 1;
  padding: 8px;
  border: 2px solid #86efac;
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: inherit;
  font-size: 11px;
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  line-height: 1.4;
}

.dark .chatbot-input textarea {
  border-color: #166534;
}

.chatbot-input textarea:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(134, 239, 172, 0.1);
}

.dark .chatbot-input textarea:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(22, 101, 52, 0.2);
}

.chatbot-input textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-btn {
  padding: 8px 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
  align-self: flex-end;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
}

.send-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
}

/* Resize Handles */
.resize-handle {
  position: absolute;
  background: transparent;
  z-index: 10;
}

.resize-top,
.resize-bottom {
  left: 0;
  right: 0;
  height: 8px;
  cursor: ns-resize;
}

.resize-top {
  top: 0;
}

.resize-bottom {
  bottom: 0;
}

.resize-left,
.resize-right {
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: ew-resize;
}

.resize-left {
  left: 0;
}

.resize-right {
  right: 0;
}

.resize-top-left,
.resize-top-right,
.resize-bottom-left,
.resize-bottom-right {
  width: 12px;
  height: 12px;
}

.resize-top-left {
  top: 0;
  left: 0;
  cursor: nwse-resize;
}

.resize-top-right {
  top: 0;
  right: 0;
  cursor: nesw-resize;
}

.resize-bottom-left {
  bottom: 0;
  left: 0;
  cursor: nesw-resize;
}

.resize-bottom-right {
  bottom: 0;
  right: 0;
  cursor: nwse-resize;
}

/* Transition */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Scrollbar styling */
.chatbot-messages::-webkit-scrollbar {
  width: 6px;
}

.chatbot-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chatbot-messages::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 3px;
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

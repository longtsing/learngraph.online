<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div
        v-if="isOpen"
        class="code-assistant-dialog"
        :style="dialogStyle"
        ref="dialogRef"
      >
        <!-- Header -->
        <div class="dialog-header" @mousedown="startDrag">
          <span class="dialog-title">🤖 AI 代码助手</span>
          <button @click="closeDialog" class="close-btn" title="关闭">✕</button>
        </div>

        <!-- Messages Area -->
        <div class="dialog-messages" ref="messagesContainer">
          <!-- Welcome message -->
          <div v-if="messages.length === 0" class="welcome-msg">
            <p>💡 我可以帮你:</p>
            <ul>
              <li>添加代码注释</li>
              <li>解释代码逻辑</li>
              <li>优化代码结构</li>
              <li>修复代码错误</li>
              <li>改进代码风格</li>
            </ul>
          </div>

          <!-- Message history -->
          <div v-if="messages.length > 0" class="history-list">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              class="message-item"
              :class="msg.role"
            >
              <div class="msg-avatar">{{ msg.role === 'user' ? '👤' : '🤖' }}</div>
              <div class="msg-content">
                <div v-html="renderMessage(msg.content)"></div>
                <!-- Apply code button if message contains code -->
                <button
                  v-if="msg.role === 'assistant' && msg.hasCode"
                  @click="applyCodeFromMessage(msg.content)"
                  class="apply-code-btn"
                >
                  ✅ 应用代码到编辑器
                </button>
              </div>
            </div>
          </div>

          <!-- Loading indicator -->
          <div v-if="isLoading" class="message-item assistant">
            <div class="msg-avatar">🤖</div>
            <div class="msg-content">
              <div class="loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <button @click="quickAction('添加详细注释')" :disabled="isLoading" class="quick-btn">
            📝 添加注释
          </button>
          <button @click="quickAction('解释这段代码')" :disabled="isLoading" class="quick-btn">
            💬 解释代码
          </button>
          <button @click="quickAction('优化这段代码')" :disabled="isLoading" class="quick-btn">
            ⚡ 优化代码
          </button>
        </div>

        <!-- Input Area -->
        <div class="dialog-input">
          <textarea
            v-model="userInput"
            @keydown.enter.ctrl="sendMessage"
            @keydown.enter.meta="sendMessage"
            placeholder="输入指令... (Ctrl/Cmd+Enter 发送)"
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

        <!-- Resize handle -->
        <div class="resize-handle" @mousedown="startResize"></div>
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
const messagesContainer = ref<HTMLElement | null>(null)
const dialogRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)

// Dialog position and size
const dialogPosition = ref({ x: 0, y: 0 })
const dialogHeight = ref(500)
const isDragging = ref(false)
const isResizing = ref(false)
const dragStart = ref({ x: 0, y: 0 })

// Calculate dialog position (bottom-right, smaller size)
const dialogStyle = computed(() => {
  const defaultRight = 20
  const defaultBottom = 20
  const defaultWidth = 420

  if (dialogPosition.value.x === 0 && dialogPosition.value.y === 0) {
    return {
      position: 'fixed',
      right: `${defaultRight}px`,
      bottom: `${defaultBottom}px`,
      width: `${defaultWidth}px`,
      height: `${dialogHeight.value}px`,
    }
  }

  return {
    position: 'fixed',
    left: `${dialogPosition.value.x}px`,
    top: `${dialogPosition.value.y}px`,
    width: '420px',
    height: `${dialogHeight.value}px`,
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

// Quick action
function quickAction(action: string) {
  userInput.value = action
  sendMessage()
}

// Send message with streaming
async function sendMessage() {
  if (!userInput.value.trim() || isLoading.value) return

  const question = userInput.value.trim()

  messages.value.push({
    role: 'user',
    content: question
  })

  userInput.value = ''
  isLoading.value = true

  // 创建一个空的助手消息用于流式填充
  const assistantMessageIndex = messages.value.length
  messages.value.push({
    role: 'assistant',
    content: '',
    hasCode: false
  })

  await scrollToBottom()

  try {
    const apiKeys = getApiKeys()
    if (!apiKeys.openai && !apiKeys.anthropic && !apiKeys.deepseek) {
      messages.value[assistantMessageIndex].content = '❌ 需要配置 API Key\n\n请在浏览器 localStorage 中设置以下任一 key:\n- `langgraph_api_openai`\n- `langgraph_api_anthropic`\n- `langgraph_api_deepseek`'
      return
    }

    const requestBody = {
      user_question: question,
      messages: messages.value.slice(0, assistantMessageIndex).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      context: `当前 Python 代码：\n\`\`\`python\n${props.code}\n\`\`\``
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (apiKeys.deepseek) headers['X-DeepSeek-API-Key'] = apiKeys.deepseek
    if (apiKeys.openai) headers['X-OpenAI-API-Key'] = apiKeys.openai
    if (apiKeys.anthropic) headers['X-Anthropic-API-Key'] = apiKeys.anthropic

    // 使用流式 API
    const response = await fetch(`${getBackendUrl()}/api/chat/ask/stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('Response body is not readable')
    }

    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))

            if (data.error) {
              messages.value[assistantMessageIndex].content = `❌ ${data.error}`
              break
            }

            if (data.content) {
              // 实时追加内容 (打字机效果)
              messages.value[assistantMessageIndex].content += data.content

              // 自动滚动
              await scrollToBottom()
            }

            if (data.done) {
              // 检查是否包含代码
              const content = messages.value[assistantMessageIndex].content
              const hasCode = content.includes('```python')
              messages.value[assistantMessageIndex].hasCode = hasCode

              // 如果包含代码，自动应用
              if (hasCode) {
                const extractedCode = extractCode(content)
                if (extractedCode) {
                  setTimeout(() => {
                    emit('applyCode', extractedCode)
                  }, 500)
                }
              }
            }
          } catch (e) {
            console.error('Failed to parse SSE data:', e)
          }
        }
      }
    }
  } catch (err: any) {
    messages.value[assistantMessageIndex].content = `❌ 错误: ${err.message || String(err)}`
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

// Extract code from response
function extractCode(content: string): string | null {
  const match = content.match(/```python\n([\s\S]*?)\n```/)
  return match ? match[1].trim() : null
}

// Apply code from message
function applyCodeFromMessage(content: string) {
  const code = extractCode(content)
  if (code) {
    emit('applyCode', code)
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
    x: e.clientX - dialogPosition.value.x,
    y: e.clientY - dialogPosition.value.y
  }

  if (dialogPosition.value.x === 0 && dialogPosition.value.y === 0) {
    const rect = dialogRef.value?.getBoundingClientRect()
    if (rect) {
      dialogPosition.value = {
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

  dialogPosition.value = {
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
function startResize(e: MouseEvent) {
  isResizing.value = true
  dragStart.value = {
    x: e.clientX,
    y: e.clientY
  }

  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  e.preventDefault()
  e.stopPropagation()
}

function handleResize(e: MouseEvent) {
  if (!isResizing.value) return

  const deltaY = e.clientY - dragStart.value.y
  const minHeight = 350

  dialogHeight.value = Math.max(minHeight, dialogHeight.value + deltaY)
  dragStart.value.y = e.clientY
}

function stopResize() {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

// Watch for dialog open
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => {
      inputRef.value?.focus()
    })
  } else {
    // Clear messages when closing
    messages.value = []
  }
})
</script>

<style scoped>
.code-assistant-dialog {
  position: fixed;
  background: var(--vp-c-bg);
  border: 2px solid #3b82f6;
  border-radius: 12px;
  box-shadow: 0 12px 48px rgba(59, 130, 246, 0.3);
  display: flex;
  flex-direction: column;
  z-index: 10000;
  overflow: hidden;
}

/* Header */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  cursor: move;
  user-select: none;
}

.dialog-title {
  font-size: 13px;
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: white;
  padding: 3px 7px;
  border-radius: 4px;
  transition: all 0.2s;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Messages Area */
.dialog-messages {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  background: var(--vp-c-bg);
  min-height: 0;
}

.welcome-msg {
  color: var(--vp-c-text-2);
  font-size: 12px;
  padding: 16px;
  text-align: center;
}

.welcome-msg p {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.welcome-msg ul {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  display: inline-block;
}

.welcome-msg li {
  margin: 6px 0;
  padding-left: 20px;
  position: relative;
}

.welcome-msg li:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #3b82f6;
  font-weight: bold;
}

/* Message History */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-item {
  display: flex;
  gap: 10px;
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

.msg-avatar {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
}

.message-item.assistant .msg-avatar {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.message-item.user .msg-avatar {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.msg-content {
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  font-size: 12px;
  line-height: 1.6;
}

.message-item.user .msg-content {
  background: #eff6ff;
  border-color: #93c5fd;
}

.dark .message-item.user .msg-content {
  background: #1e3a8a;
  border-color: #3b82f6;
}

.message-item.assistant .msg-content {
  background: #f0fdf4;
  border-color: #86efac;
}

.dark .message-item.assistant .msg-content {
  background: #14532d;
  border-color: #22c55e;
}

/* Apply code button */
.apply-code-btn {
  margin-top: 10px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.2s;
}

.apply-code-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

/* Loading dots */
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
    transform: translateY(-5px);
  }
}

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: 6px;
  padding: 8px 12px;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
}

.quick-btn {
  flex: 1;
  min-width: 90px;
  padding: 6px 10px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  font-size: 10px;
  color: var(--vp-c-text-1);
  transition: all 0.2s;
  white-space: nowrap;
}

.quick-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.quick-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Input Area */
.dialog-input {
  padding: 10px 12px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  display: flex;
  gap: 8px;
}

.dialog-input textarea {
  flex: 1;
  padding: 8px 10px;
  border: 2px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: inherit;
  font-size: 12px;
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  line-height: 1.4;
}

.dialog-input textarea:focus {
  border-color: #3b82f6;
}

.dialog-input textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-btn {
  padding: 8px 14px;
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
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.send-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

/* Resize Handle */
.resize-handle {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 8px;
  cursor: ns-resize;
  background: transparent;
}

/* Markdown content styles */
.msg-content :deep(pre) {
  background: #1e1e1e;
  padding: 10px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 8px 0;
  font-size: 11px;
}

.msg-content :deep(code) {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 5px;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 11px;
}

.msg-content :deep(pre code) {
  background: none;
  padding: 0;
  color: #86efac;
}

.msg-content :deep(p) {
  margin: 6px 0;
}

.msg-content :deep(ul),
.msg-content :deep(ol) {
  margin: 6px 0;
  padding-left: 18px;
}

.msg-content :deep(li) {
  margin: 3px 0;
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
.dialog-messages::-webkit-scrollbar {
  width: 6px;
}

.dialog-messages::-webkit-scrollbar-track {
  background: transparent;
}

.dialog-messages::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 3px;
}

.dialog-messages::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-text-3);
}
</style>

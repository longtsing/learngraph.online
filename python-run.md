# API Key 配置 🔑

配置 OpenAI / Anthropic / DeepSeek API Key，解锁本站所有 LangGraph 代码的一键运行功能。

<script setup>
import { ref, onMounted } from 'vue'

const openaiKey = ref('')
const anthropicKey = ref('')
const deepseekKey = ref('')
const savedOpenAI = ref('')
const savedAnthropic = ref('')
const savedDeepSeek = ref('')
const message = ref('')
const showOpenAI = ref(false)
const showAnthropic = ref(false)
const showDeepSeek = ref(false)

onMounted(() => {
  // 兼容旧的存储格式
  const oldKey = localStorage.getItem('openai_api_key')
  if (oldKey && !localStorage.getItem('langgraph_api_openai')) {
    localStorage.setItem('langgraph_api_openai', oldKey)
    localStorage.removeItem('openai_api_key')
  }

  const savedOAI = localStorage.getItem('langgraph_api_openai')
  const savedAnt = localStorage.getItem('langgraph_api_anthropic')
  const savedDS = localStorage.getItem('langgraph_api_deepseek')

  if (savedOAI) {
    savedOpenAI.value = savedOAI
    openaiKey.value = savedOAI
  }
  if (savedAnt) {
    savedAnthropic.value = savedAnt
    anthropicKey.value = savedAnt
  }
  if (savedDS) {
    savedDeepSeek.value = savedDS
    deepseekKey.value = savedDS
  }
})

function saveApiKeys() {
  let saved = false

  if (openaiKey.value.trim()) {
    if (!openaiKey.value.startsWith('sk-')) {
      message.value = '❌ OpenAI API Key 格式不正确（应以 sk- 开头）'
      setTimeout(() => message.value = '', 3000)
      return
    }
    localStorage.setItem('langgraph_api_openai', openaiKey.value.trim())
    savedOpenAI.value = openaiKey.value.trim()
    saved = true
  }

  if (anthropicKey.value.trim()) {
    if (!anthropicKey.value.startsWith('sk-ant-')) {
      message.value = '❌ Anthropic API Key 格式不正确（应以 sk-ant- 开头）'
      setTimeout(() => message.value = '', 3000)
      return
    }
    localStorage.setItem('langgraph_api_anthropic', anthropicKey.value.trim())
    savedAnthropic.value = anthropicKey.value.trim()
    saved = true
  }

  if (deepseekKey.value.trim()) {
    if (!deepseekKey.value.startsWith('sk-')) {
      message.value = '❌ DeepSeek API Key 格式不正确（应以 sk- 开头）'
      setTimeout(() => message.value = '', 3000)
      return
    }
    localStorage.setItem('langgraph_api_deepseek', deepseekKey.value.trim())
    savedDeepSeek.value = deepseekKey.value.trim()
    saved = true
  }

  if (!saved) {
    message.value = '❌ 请至少输入一个 API Key'
    setTimeout(() => message.value = '', 3000)
    return
  }

  message.value = '✅ 保存成功！现在可以运行所有代码示例了'
  setTimeout(() => message.value = '', 3000)
}

function clearAllApiKeys() {
  localStorage.removeItem('langgraph_api_openai')
  localStorage.removeItem('langgraph_api_anthropic')
  localStorage.removeItem('langgraph_api_deepseek')
  openaiKey.value = ''
  anthropicKey.value = ''
  deepseekKey.value = ''
  savedOpenAI.value = ''
  savedAnthropic.value = ''
  savedDeepSeek.value = ''
  message.value = '🗑️ 已清除所有 API Keys'
  setTimeout(() => message.value = '', 3000)
}

function maskKey(key) {
  if (!key) return ''
  if (key.length <= 8) return '***'
  return key.substring(0, 4) + '***' + key.substring(key.length - 4)
}
</script>

## 📝 配置步骤

您可以配置一个或多个 API Key。教程中的代码默认使用 OpenAI 模型。

<div style="max-width: 800px; margin: 20px 0; padding: 24px; background: var(--vp-c-bg-soft); border-radius: 8px; border: 2px solid var(--vp-c-divider);">
  <!-- OpenAI API Key -->
  <div style="margin-bottom: 24px;">
    <label style="display: block; margin-bottom: 10px; font-weight: 600; font-size: 15px;">
      🔑 OpenAI API Key
      <span v-if="savedOpenAI" style="font-size: 12px; background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; margin-left: 8px;">已配置 ✓</span>
    </label>
    <div style="display: flex; gap: 10px;">
      <input
        v-model="openaiKey"
        :type="showOpenAI ? 'text' : 'password'"
        placeholder="sk-proj-... 或 sk-..."
        style="flex: 1; padding: 12px 16px; border: 2px solid var(--vp-c-divider); border-radius: 8px; font-family: 'Consolas', monospace; font-size: 14px; background: var(--vp-c-bg); color: var(--vp-c-text-1);"
        @keyup.enter="saveApiKeys"
      />
      <button
        @click="showOpenAI = !showOpenAI"
        style="padding: 12px 18px; background: var(--vp-c-bg-mute); color: var(--vp-c-text-1); border: 2px solid var(--vp-c-divider); border-radius: 8px; cursor: pointer; font-size: 18px;"
        :title="showOpenAI ? '隐藏' : '显示'"
      >
        {{ showOpenAI ? '🙈' : '👁️' }}
      </button>
    </div>
    <small style="font-size: 12px; color: var(--vp-c-text-2); margin-top: 6px; display: block;">用于 GPT-3.5、GPT-4 等 OpenAI 模型</small>
  </div>

  <!-- Anthropic API Key -->
  <div style="margin-bottom: 24px;">
    <label style="display: block; margin-bottom: 10px; font-weight: 600; font-size: 15px;">
      🔑 Anthropic API Key
      <span v-if="savedAnthropic" style="font-size: 12px; background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; margin-left: 8px;">已配置 ✓</span>
    </label>
    <div style="display: flex; gap: 10px;">
      <input
        v-model="anthropicKey"
        :type="showAnthropic ? 'text' : 'password'"
        placeholder="sk-ant-..."
        style="flex: 1; padding: 12px 16px; border: 2px solid var(--vp-c-divider); border-radius: 8px; font-family: 'Consolas', monospace; font-size: 14px; background: var(--vp-c-bg); color: var(--vp-c-text-1);"
        @keyup.enter="saveApiKeys"
      />
      <button
        @click="showAnthropic = !showAnthropic"
        style="padding: 12px 18px; background: var(--vp-c-bg-mute); color: var(--vp-c-text-1); border: 2px solid var(--vp-c-divider); border-radius: 8px; cursor: pointer; font-size: 18px;"
        :title="showAnthropic ? '隐藏' : '显示'"
      >
        {{ showAnthropic ? '🙈' : '👁️' }}
      </button>
    </div>
    <small style="font-size: 12px; color: var(--vp-c-text-2); margin-top: 6px; display: block;">用于 Claude 系列模型</small>
  </div>

  <!-- DeepSeek API Key -->
  <div style="margin-bottom: 24px;">
    <label style="display: block; margin-bottom: 10px; font-weight: 600; font-size: 15px;">
      🔑 DeepSeek API Key
      <span v-if="savedDeepSeek" style="font-size: 12px; background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; margin-left: 8px;">已配置 ✓</span>
    </label>
    <div style="display: flex; gap: 10px;">
      <input
        v-model="deepseekKey"
        :type="showDeepSeek ? 'text' : 'password'"
        placeholder="sk-..."
        style="flex: 1; padding: 12px 16px; border: 2px solid var(--vp-c-divider); border-radius: 8px; font-family: 'Consolas', monospace; font-size: 14px; background: var(--vp-c-bg); color: var(--vp-c-text-1);"
        @keyup.enter="saveApiKeys"
      />
      <button
        @click="showDeepSeek = !showDeepSeek"
        style="padding: 12px 18px; background: var(--vp-c-bg-mute); color: var(--vp-c-text-1); border: 2px solid var(--vp-c-divider); border-radius: 8px; cursor: pointer; font-size: 18px;"
        :title="showDeepSeek ? '隐藏' : '显示'"
      >
        {{ showDeepSeek ? '🙈' : '👁️' }}
      </button>
    </div>
    <small style="font-size: 12px; color: var(--vp-c-text-2); margin-top: 6px; display: block;">用于 deepseek-chat 等 DeepSeek 模型</small>
  </div>

  <!-- 操作按钮 -->
  <div style="display: flex; gap: 12px; margin-bottom: 20px;">
    <button
      @click="saveApiKeys"
      style="flex: 1; padding: 12px 24px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 15px; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);"
    >
      💾 保存到本地
    </button>
    <button
      @click="clearAllApiKeys"
      style="padding: 12px 24px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 15px;"
    >
      🗑️ 清除所有
    </button>
  </div>

  <!-- 消息提示 -->
  <div v-if="message" style="padding: 14px 16px; background: var(--vp-c-bg); border-left: 4px solid var(--vp-c-brand); border-radius: 6px; margin-bottom: 20px; font-weight: 500;">
    {{ message }}
  </div>

  <!-- 状态显示 -->
  <div v-if="savedOpenAI || savedAnthropic || savedDeepSeek" style="padding: 16px; background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 8px; border-left: 4px solid #10b981;">
    <div style="font-weight: 600; margin-bottom: 8px; color: #065f46; font-size: 15px;">✅ API Key 已配置</div>
    <div style="display: flex; flex-direction: column; gap: 6px;">
      <div v-if="savedOpenAI" style="font-size: 13px; color: #047857;">
        <strong>OpenAI:</strong> <code style="font-family: 'Consolas', monospace; background: #ecfdf5; padding: 4px 8px; border-radius: 4px;">{{ maskKey(savedOpenAI) }}</code>
      </div>
      <div v-if="savedAnthropic" style="font-size: 13px; color: #047857;">
        <strong>Anthropic:</strong> <code style="font-family: 'Consolas', monospace; background: #ecfdf5; padding: 4px 8px; border-radius: 4px;">{{ maskKey(savedAnthropic) }}</code>
      </div>
      <div v-if="savedDeepSeek" style="font-size: 13px; color: #047857;">
        <strong>DeepSeek:</strong> <code style="font-family: 'Consolas', monospace; background: #ecfdf5; padding: 4px 8px; border-radius: 4px;">{{ maskKey(savedDeepSeek) }}</code>
      </div>
    </div>
    <div style="margin-top: 10px; font-size: 13px; color: #047857;">
      ✨ 现在访问任意教程页面，点击代码块的"运行代码"按钮即可执行！
    </div>
  </div>
  <div v-else style="padding: 16px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; border-radius: 8px;">
    <div style="font-weight: 600; color: #92400e; margin-bottom: 6px;">⚠️ 尚未配置 API Key</div>
    <div style="font-size: 13px; color: #78350f;">请先配置至少一个 API Key 才能运行代码示例</div>
  </div>
</div>

<div style="max-width: 800px; padding: 16px 20px; background: var(--vp-c-bg-soft); border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
  <div style="font-size: 14px; color: var(--vp-c-text-2); line-height: 1.8;">
    💡 <strong>如何获取 API Key：</strong><br/>
    • <strong>OpenAI:</strong> 访问 <a href="https://platform.openai.com/api-keys" target="_blank" style="color: var(--vp-c-brand); font-weight: 600;">OpenAI Platform</a><br/>
    • <strong>Anthropic:</strong> 访问 <a href="https://console.anthropic.com/settings/keys" target="_blank" style="color: var(--vp-c-brand); font-weight: 600;">Anthropic Console</a><br/>
    • <strong>DeepSeek:</strong> 访问 <a href="https://platform.deepseek.com/api_keys" target="_blank" style="color: var(--vp-c-brand); font-weight: 600;">DeepSeek Platform</a><br/>
    <br/>
    🔒 <strong>安全说明：</strong> 所有 API Key 仅保存在您的浏览器本地，不会上传到服务器
  </div>
</div>

---

## ✅ 验证 API Key

保存 API Key 后，运行以下示例验证配置是否成功。教程中的代码默认使用 OpenAI 模型。

### 示例 1：使用 OpenAI 模型（默认）

```python
import os
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-4o-mini",
    api_key=os.environ.get("OPENAI_API_KEY")
)
response = llm.invoke("用一句话介绍 LangChain")
print(response.content)
```

### 示例 2：使用 Anthropic Claude 模型

```python
import os
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(
    model="claude-haiku-4-5",
    api_key=os.environ.get("ANTHROPIC_API_KEY")
)
response = llm.invoke("用一句话介绍 LangChain")
print(response.content)
```

### 示例 3：使用 DeepSeek 模型

```python
import os
from langchain_deepseek import ChatDeepSeek

llm = ChatDeepSeek(
    model="deepseek-chat",
    api_key=os.environ.get("DEEPSEEK_API_KEY")
)
response = llm.invoke("用一句话介绍 LangChain")
print(response.content)
```

### 示例 4：LangGraph 简单图（使用 OpenAI）

创建一个最简单的 LangGraph 图，实现问答功能：

```python
import os
from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI
from typing import TypedDict

class State(TypedDict):
    question: str
    answer: str

def answer_node(state: State):
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        api_key=os.environ.get("OPENAI_API_KEY")
    )
    response = llm.invoke(state["question"])
    return {"answer": response.content}

graph = StateGraph(State)
graph.add_node("answer_node", answer_node)
graph.add_edge(START, "answer_node")
graph.add_edge("answer_node", END)

app = graph.compile()
result = app.invoke({"question": "什么是 LangGraph？"})
print(result["answer"])
```

### 💡 切换模型提示

- 教程中的所有代码默认使用 OpenAI 模型
- 如需使用其他模型，请参考上述示例修改代码
- 系统会自动将您配置的 API Key 注入到代码中

---

## 📚 开始学习

配置完成后，访问教程页面开始学习：

- 🚀 [LangGraph 飞速上手](/module-0/0.0-LangGraph-上手案例)
- 🐍 [Python 基础入门](/module-0/0.1-Python-基础入门)
- 📖 [第 1 章 - 基础概念](/module-1/1.1-simple-graph-最简图)

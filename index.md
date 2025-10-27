---
layout: home

hero:
  name: "LearnGraph"
  text: "AI 智能体开发学习平台"
  tagline: 从 Python 基础到 LangGraph、LangChain，从基础概念到生产部署 - 快速掌握 AI Agent 开发
  image:
    src: /logo.svg
    alt: LearnGraph.online
  actions:
    - theme: brand
      text: 开始学习 LangGraph
      link: /module-1/1.1-LangGraph-上手案例

features:
  - icon: 🤖
    title: LangGraph 智能体开发
    details: 深入学习 LangGraph 和 Multi-Agent 系统设计。从基础概念到生产部署，构建真正具备自主决策能力的智能体应用。

  - icon: 🔗
    title: LangChain 飞速上手
    details: 掌握 LangChain 核心组件和设计模式。学习 Chain、Agent、Memory 等关键概念，快速构建 LLM 应用。

  - icon: 🐍
    title: AI 时代学 Python
    details: 零基础入门 Python，学会使用 AI 工具辅助编程。通过实战项目快速上手，专为 AI 时代设计的学习路径。

  - icon: 🧠
    title: AI 与大模型入门飞速上手
    details: 理解大语言模型的工作原理，学习 Prompt Engineering、Function Calling、RAG 等核心技术。

  - icon: 💻
    title: 在线代码运行
    details: 网页内置 Python 环境，支持免登录运行代码。编辑、调试、学习一站式完成，无需本地配置。

  - icon: 💡
    title: 案例先行，通俗易懂
    details: 每个概念配有清晰定义、原理分析、代码示例。大白话解读专业术语，零基础也能快速掌握核心思想。
---

<script setup>
import BookSeries from './docs/.vitepress/components/BookSeries.vue'
</script>

<BookSeries />

## 📖 网站使用说明

- 本网站可以免登陆运行 Python 代码。如有报错，请到 [问题反馈](/feedback.html) 页面进行免登录登记
- Python 代码可以编辑并临时保存，但不会永久保存，网页刷新后就会自动还原
- 对网站使用中碰到任何问题或有任何改进意见，可以到 [问题反馈](/feedback.html) 页面进行免登录评论，或邮箱联系作者：brycew6m@gmail.com
- 运行 `LangGraph/LangChain` 代码，需要用户保存自己的 [API Key](/python-run.html)
- 本网站的所有基础核心功能，永久免费
- 重要声明：本网站不会保存或获取任何用户的 API Key 数据，请放心使用

### 🔑 API Key 配置与使用

#### 配置 API Key

点击页面右上角的 **🔑 API Keys** 按钮，可以配置以下三种 API Key：

1. **OpenAI API Key** - 用于 GPT-4o、GPT-5 等模型
2. **Anthropic API Key** - 用于 Claude 系列模型
3. **DeepSeek API Key** - 用于 DeepSeek 系列模型（默认使用的是最新和最便宜的模型）

所有 API Key 仅保存在您的浏览器本地存储（localStorage）中，网站不会上传或收集任何密钥信息。

#### 代码中使用不同模型

配置好 API Key 后，您可以在代码中使用不同的模型：

**方式 1：使用 OpenAI 模型（整个网站默认）**

```python
import os
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-5",
    api_key=os.environ.get("OPENAI_API_KEY")
)
response = llm.invoke("用一句话介绍 LangChain")
print(response.content)
```

**方式 2：使用 Anthropic Claude 模型（需要用户手动编辑代码）**

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

**方式 3：使用 DeepSeek 模型（需要用户手动编辑代码）**

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

#### 注意事项

- 教程中的默认代码使用 OpenAI 模型
- 您可以自由修改代码切换到其他模型
- 系统会自动将您配置的 API Key 注入到代码中
- 不同模型的 API 调用费用请参考各平台的定价说明

---

## 🚀 快速开始

选择感兴趣的书籍，立即开始学习之旅：

- **想学习 AI 智能体开发？** → [《智能体搭建 & LangGraph 飞速上手》](/module-1/1.1-LangGraph-上手案例)
- **想掌握 Python 编程？** → [《AI 时代学 Python》](/python-book)（筹备中）
- **想学习 LangChain？** → [《LangChain 飞速上手》](/langchain-book)（规划中）
- **想入门 AI 和大模型？** → [《AI 与大模型飞速上手》](/ai-llm-book)（规划中）

---

## 💡 学习理念

**AI 时代，理解为王**

我们相信，在 AI 辅助的时代，理解核心概念比记忆技术细节更重要。LearnGraph 致力于：

- ✅ **摒弃非重要细节**，直达思想内核
- ✅ **通俗化解读**，让专业知识变得易懂
- ✅ **实战为导向**，从演示代码到生产级实现
- ✅ **系统化学习**，构建完整的知识图谱

---

## 🗓️ 更新 Roadmap

### 项目简介

《LangGraph 飞速上手》是一本持续更新的公开教程，致力于为中文开发者提供最通俗易懂的 LangGraph 学习资源。

### 版本规划

#### v0.1: 前半本书的撰写与整合（2024.6.1 - 2025.10.31）
1. 建立完整的基础学习路径，融合 LangChain Academy 目前已有的4门官方课程，并进行通俗解读和大幅拓展
2. 将知乎的草稿整合过来，完成第 0/1/2/3/4/5/6 章内容的撰写（**已完成**）
3. 部署到 Vercel + 专用域名，方便国内访问（**已完成**： [learngraph.online](https://www.learngraph.online)）

#### v0.2: 2025.11.1 - 2025.11.30
1. 继续补充第 7/8/9/10 的撰写，在官方课程之外，提供更多工业级的真实案例
2. 完成后端+前端的部署，提供 Python 环境，方便读者直接编辑并运行代码

#### v1.0 : 2025.12.1 - 2025.12.31
1. 整理早期读者的回馈，完成全书的打磨，检查代码并完成最新
2. 正式发布整书的电子版
3. 通过纸质版发行的立项审核
4. 网站上增加 AI 辅助学习功能：帮助解释概念、解释报错、生成或修正代码

**当前版本**：v0.1 | **下一个里程碑**：全书初稿（预计 2025年11月底）

### 反馈与建议

你可以通过以下方式参与：

1. **GitHub Issues**：报告错误或提出建议：[项目 Issues](https://github.com/brycewang-stanford/learngraph.online/issues)
2. **问题反馈按钮**：网站右下角浮动按钮
3. **Email 联系**：直接联系作者：brycew6m@gmail.com
4. **Pull Request**：直接贡献代码或文档，欢迎任何形式的改进！

---

## 🤝 关于作者

**王几行XING (Bryce Wang)**

- 📖 知乎：[@王几行XING](https://www.zhihu.com/people/brycewang1898)
- 📧 邮箱：brycew6m@gmail.com
- 💻 GitHub：[@brycewang-stanford](https://github.com/brycewang-stanford)

---

## 💌 致谢

感谢所有支持本项目的朋友们！

- **Star 支持**：GitHub 上的每一个 Star 都是动力
- **反馈建议**：每一条反馈都会认真对待
- **社区贡献**：欢迎加入共建

---

**让我们一起，在 AI 时代，通过理解而非技术细节，快速掌握 AI Agent 开发！** 🚀

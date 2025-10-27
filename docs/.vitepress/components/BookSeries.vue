<template>
  <div class="book-series">
    <div class="series-header">
      <h2>📚 系列书籍</h2>
      <p>
        从 Python 基础到 AI Agent 开发，从 LangChain 到 LangGraph，从基础概念到生产部署。
        每本书都注重案例驱动、通俗易懂，帮助你在 AI 时代快速掌握智能体开发技能。
      </p>
    </div>

    <div class="books-grid">
      <div class="book-card available">
        <div class="book-icon">🤖</div>
        <div class="book-title">智能体搭建 & LangGraph 飞速上手</div>
        <span class="book-status status-available">✅ 已发布</span>
        <p class="book-description">
          深入学习 LangGraph 和 Multi-Agent 系统开发。从基础概念到生产部署，
          通过 7 大章节、40+ 篇详细解读，掌握智能体构建的完整技能。
        </p>
        <a href="/module-1/1.1-LangGraph-上手案例" class="book-link">立即学习</a>
      </div>

      <div class="book-card">
        <div class="book-icon">🐍</div>
        <div class="book-title">AI 时代学 Python</div>
        <span class="book-status status-coming">📝 筹备中</span>
        <p class="book-description">
          零基础入门 Python，学会使用 AI 工具辅助编程。
          通过实战项目快速上手，专为 AI 时代设计的学习路径。
        </p>
        <a href="/python-book" class="book-link coming-soon">查看详情</a>
      </div>

      <div class="book-card">
        <div class="book-icon">🔗</div>
        <div class="book-title">LangChain 飞速上手</div>
        <span class="book-status status-planning">💭 规划中</span>
        <p class="book-description">
          掌握 LangChain 核心组件和设计模式。学习 Chain、Agent、Memory 等关键概念，
          快速构建 LLM 应用，为 LangGraph 学习打下坚实基础。
        </p>
        <a href="/langchain-book" class="book-link coming-soon">查看详情</a>
      </div>

      <div class="book-card">
        <div class="book-icon">🧠</div>
        <div class="book-title">AI 与大模型飞速上手</div>
        <span class="book-status status-planning">💭 规划中</span>
        <p class="book-description">
          理解大语言模型的工作原理，学习 Prompt Engineering、Function Calling、RAG 等核心技术。
          从零开始构建你的第一个 AI 应用。
        </p>
        <a href="/ai-llm-book" class="book-link coming-soon">查看详情</a>
      </div>
    </div>

    <div class="platform-intro">
      <h3>🎯 为什么选择 LearnGraph.online？</h3>
      <div class="intro-grid">
        <div class="intro-item">
          <span class="emoji">📚</span>
          <h4>系统化学习路径</h4>
          <p>从 Python 基础到 AI Agent 开发，循序渐进</p>
        </div>
        <div class="intro-item">
          <span class="emoji">💻</span>
          <h4>在线代码运行</h4>
          <p>网页内置 Python 环境，边学边练无需配置</p>
        </div>
        <div class="intro-item">
          <span class="emoji">🎨</span>
          <h4>案例驱动教学</h4>
          <p>每个概念配有实战案例，理论联系实际</p>
        </div>
        <div class="intro-item">
          <span class="emoji">🌟</span>
          <h4>通俗易懂</h4>
          <p>大白话解读专业术语，零基础也能快速上手</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book-series {
  max-width: 1200px;
  margin: 80px auto;
  padding: 0 24px;
}

.series-header {
  text-align: center;
  margin-bottom: 60px;
}

.series-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 16px;
}

.series-header p {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin-bottom: 60px;
}

.book-card {
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  border-color: var(--vp-c-brand);
}

.book-card.available {
  border-color: var(--vp-c-brand);
  background: linear-gradient(135deg, var(--vp-c-bg-soft) 0%, var(--vp-c-brand-softer) 100%);
}

.book-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.book-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 12px;
}

.book-status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 16px;
}

.status-available {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  border: 1px solid var(--vp-c-brand);
}

.status-coming {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.status-planning {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-divider-light);
}

.book-description {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 20px;
  flex-grow: 1;
}

.book-link {
  display: inline-block;
  padding: 10px 24px;
  background: var(--vp-c-brand);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  text-align: center;
}

.book-link:hover {
  background: var(--vp-c-brand-dark);
  transform: scale(1.05);
}

.book-link.coming-soon {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  border: 2px solid var(--vp-c-divider);
}

.book-link.coming-soon:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.platform-intro {
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  padding: 48px;
  margin-top: 60px;
}

.platform-intro h3 {
  font-size: 2rem;
  color: var(--vp-c-text-1);
  margin-bottom: 24px;
  text-align: center;
}

.intro-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

.intro-item {
  text-align: center;
  padding: 24px;
}

.intro-item .emoji {
  font-size: 2.5rem;
  margin-bottom: 12px;
  display: block;
}

.intro-item h4 {
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
}

.intro-item p {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .series-header h2 {
    font-size: 2rem;
  }

  .books-grid {
    grid-template-columns: 1fr;
  }

  .platform-intro {
    padding: 32px 24px;
  }
}
</style>

---
layout: page
title: Python与统计计量
---

<style scoped>
.coming-soon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 40px 24px;
}

.coming-soon-card {
  max-width: 600px;
  width: 100%;
  text-align: center;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 48px 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.icon-wrapper {
  margin-bottom: 24px;
}

.book-icon {
  width: 80px;
  height: 80px;
  color: var(--vp-c-brand);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.coming-soon-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 20px;
  line-height: 1.2;
}

.status-badge {
  display: inline-block;
  margin-bottom: 24px;
}

.badge-text {
  display: inline-block;
  padding: 8px 20px;
  background: linear-gradient(135deg, var(--vp-c-brand-soft), var(--vp-c-brand-softer));
  color: var(--vp-c-brand);
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid var(--vp-c-brand);
}

.coming-soon-message {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
  margin-bottom: 40px;
  line-height: 1.6;
}

.book-intro {
  background: var(--vp-c-bg);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  text-align: left;
}

.book-intro h2 {
  font-size: 1.3rem;
  margin-bottom: 16px;
  color: var(--vp-c-text-1);
  border: none;
  padding: 0;
}

.book-intro ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.book-intro li {
  padding: 10px 0;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.6;
}

.book-intro strong {
  color: var(--vp-c-text-1);
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.back-button,
.notify-button {
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.back-button {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 2px solid var(--vp-c-divider);
}

.back-button:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.notify-button {
  background: var(--vp-c-brand);
  color: white;
  border: 2px solid var(--vp-c-brand);
}

.notify-button:hover {
  background: var(--vp-c-brand-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.timeline {
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}

.timeline-text {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin: 0;
}

.timeline strong {
  color: var(--vp-c-brand);
  font-weight: 600;
}

@media (max-width: 768px) {
  .coming-soon-card {
    padding: 32px 24px;
  }

  .coming-soon-title {
    font-size: 2rem;
  }

  .book-icon {
    width: 60px;
    height: 60px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .back-button,
  .notify-button {
    width: 100%;
  }
}
</style>

<div class="coming-soon-container">
  <div class="coming-soon-card">
    <div class="icon-wrapper">
      <svg class="book-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
        <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
        <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    </div>
    <h1 class="coming-soon-title">《Python与统计计量》</h1>
    <div class="status-badge">
      <span class="badge-text">📝 筹备中</span>
    </div>
    <p class="coming-soon-message">本书还在筹备中，敬请期待！</p>
    <div class="book-intro">
      <h2>📊 内容规划</h2>
      <ul>
        <li>📈 <strong>描述性统计</strong>：数据探索与可视化技巧</li>
        <li>🎲 <strong>概率论基础</strong>：从概率分布到假设检验</li>
        <li>📉 <strong>回归分析</strong>：线性回归到广义线性模型</li>
        <li>🔬 <strong>计量经济学</strong>：面板数据与时间序列分析</li>
        <li>💻 <strong>Python实战</strong>：使用 pandas、statsmodels、scipy</li>
      </ul>
    </div>
    <div class="action-buttons">
      <a href="/" class="back-button">返回首页</a>
      <a href="mailto:brycew6m@gmail.com" class="notify-button">邮件通知我</a>
    </div>
    <div class="timeline">
      <p class="timeline-text">预计发布时间：<strong>2026 年上半年</strong></p>
    </div>
  </div>
</div>

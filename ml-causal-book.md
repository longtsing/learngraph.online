---
layout: page
title: 机器学习与因果推断
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
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    </div>
    <h1 class="coming-soon-title">《机器学习 & 因果推断》</h1>
    <div class="status-badge">
      <span class="badge-text">📝 筹备中</span>
    </div>
    <p class="coming-soon-message">本书还在筹备中，敬请期待！</p>
    <div class="book-intro">
      <h2>🧠 内容规划</h2>
      <ul>
        <li>🤖 <strong>机器学习基础</strong>：监督学习、无监督学习、深度学习</li>
        <li>🔗 <strong>因果推断理论</strong>：因果图、反事实推理、潜在结果框架</li>
        <li>⚡ <strong>实验设计</strong>：A/B测试、随机对照试验、准实验方法</li>
        <li>🎯 <strong>因果发现</strong>：从观测数据中识别因果关系</li>
        <li>🚀 <strong>工业应用</strong>：推荐系统、广告优化、策略评估</li>
      </ul>
    </div>
    <div class="action-buttons">
      <a href="/" class="back-button">返回首页</a>
      <a href="mailto:brycew6m@gmail.com" class="notify-button">邮件通知我</a>
    </div>
    <div class="timeline">
      <p class="timeline-text">预计发布时间：<strong>2026 年下半年</strong></p>
    </div>
  </div>
</div>

<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>管理员控制面板</h1>
      <p class="subtitle">欢迎回来，{{ adminName }}</p>
    </div>

    <div class="dashboard-grid">
      <!-- 反馈审核 -->
      <div class="dashboard-card">
        <div class="card-icon">💬</div>
        <h2>反馈审核</h2>
        <p>查看和管理用户反馈评论</p>
        <a
          href="https://cusdis.com/dashboard/project/9a1060ba-ab12-4429-a517-44a5b140e2d6"
          target="_blank"
          class="card-button"
        >
          打开 Cusdis 控制台
          <svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>

      <!-- 网站访问数据 -->
      <div class="dashboard-card">
        <div class="card-icon">📈</div>
        <h2>网站访问数据</h2>
        <p>查看 Google Analytics 统计数据</p>
        <a
          href="https://analytics.google.com/analytics/web/?authuser=4#/a371083495p508309497/reports/intelligenthome"
          target="_blank"
          class="card-button"
        >
          打开 Google Analytics
          <svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>

      <!-- 内容管理 -->
      <div class="dashboard-card">
        <div class="card-icon">📝</div>
        <h2>内容管理</h2>
        <p>编辑和管理网站内容</p>
        <a href="/" class="card-button">
          返回首页
        </a>
      </div>

      <!-- GitHub 仓库 -->
      <div class="dashboard-card">
        <div class="card-icon">
          <svg viewBox="0 0 16 16" fill="currentColor" style="width: 32px; height: 32px;">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </div>
        <h2>GitHub 仓库</h2>
        <p>查看和管理源代码仓库</p>
        <a
          href="https://github.com/brycewang-stanford/learngraph.online"
          target="_blank"
          class="card-button"
        >
          打开 GitHub
          <svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>
    </div>

    <div class="dashboard-footer">
      <p>当前环境: <strong>{{ isProduction ? '生产环境' : '本地开发' }}</strong></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getCurrentUser } from '../utils/github-api'

const user = ref(getCurrentUser())
const isProduction = window.location.hostname === 'learngraph.online' || window.location.hostname === 'www.learngraph.online'

const adminName = computed(() => {
  if (user.value) {
    return user.value.name || user.value.login
  }
  return '管理员'
})
</script>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 48px;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 12px;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.dashboard-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 28px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.dashboard-card h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
}

.dashboard-card p {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  margin-bottom: 20px;
  flex-grow: 1;
}

.card-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--vp-c-brand);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.card-button:hover {
  background: var(--vp-c-brand-dark);
  transform: scale(1.05);
}

.external-icon {
  width: 16px;
  height: 16px;
}

.dashboard-footer {
  text-align: center;
  padding: 24px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  margin-top: 40px;
}

.dashboard-footer p {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.dashboard-footer strong {
  color: var(--vp-c-brand);
  font-weight: 600;
}

@media (max-width: 768px) {
  .dashboard-header h1 {
    font-size: 2rem;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>

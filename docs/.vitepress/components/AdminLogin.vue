<template>
  <div class="admin-login">
    <!-- 生产环境：真实登录 -->
    <template v-if="isProduction">
      <button v-if="!isAdminLoggedIn" @click="loginWithGitHub" class="login-button" title="管理员登录">
        <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
      </button>

      <div v-else class="admin-info">
        <img :src="user?.avatar_url" :alt="user?.name" class="avatar" />
        <span class="username">{{ user?.name || user?.login }}</span>
        <a href="/admin" class="admin-link">管理面板</a>
        <button @click="logout" class="logout-button">登出</button>
      </div>
    </template>

    <!-- 本地环境：直接显示管理员按钮 -->
    <template v-else>
      <a href="/admin" class="login-button local-admin">
        <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
  
      </a>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authenticateWithGitHub, saveAuthState, clearAuthState, isAdmin, getCurrentUser } from '../utils/github-api'

const isAdminLoggedIn = ref(false)
const user = ref<any>(null)

// GitHub OAuth 配置
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || 'YOUR_CLIENT_ID'

// 只在生产环境显示登录按钮 (SSR-safe)
const isProduction = typeof window !== 'undefined' && (window.location.hostname === 'learngraph.online' || window.location.hostname === 'www.learngraph.online')
const REDIRECT_URI = 'https://learngraph.online'

onMounted(() => {
  // 检查是否已登录
  isAdminLoggedIn.value = isAdmin()
  user.value = getCurrentUser()

  // 检查 URL 中是否有授权码（OAuth 回调）
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')

  if (code) {
    handleOAuthCallback(code)
  }
})

function loginWithGitHub() {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=repo,user:email`
  window.location.href = githubAuthUrl
}

async function handleOAuthCallback(code: string) {
  try {
    const response = await authenticateWithGitHub(code)

    if (response.is_admin) {
      saveAuthState(response.access_token, response.user, response.is_admin)
      isAdminLoggedIn.value = true
      user.value = response.user

      // 清除 URL 中的 code 参数并刷新页面以显示编辑按钮
      window.history.replaceState({}, document.title, window.location.pathname)
      window.location.reload()
    } else {
      alert('您不是管理员，无法登录。')
    }
  } catch (error: any) {
    console.error('GitHub 登录失败:', error)
    alert(`登录失败: ${error.message}`)
  }
}

function logout() {
  clearAuthState()
  isAdminLoggedIn.value = false
  user.value = null
}
</script>

<style scoped>
.admin-login {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-left: 15px;
}

.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  width: 36px;
  height: 36px;
}

.login-button:hover {
  background: var(--vp-c-brand-dark);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.login-button.local-admin {
  background: var(--vp-c-brand);
}

.login-button.local-admin:hover {
  background: var(--vp-c-brand-dark);
}

.admin-icon {
  width: 20px;
  height: 20px;
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-brand);
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.admin-link {
  padding: 4px 12px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  border: 1px solid var(--vp-c-brand);
  border-radius: 4px;
  font-size: 12px;
  text-decoration: none;
  transition: all 0.2s;
}

.admin-link:hover {
  background: var(--vp-c-brand);
  color: white;
}

.logout-button {
  padding: 4px 12px;
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger);
  border: 1px solid var(--vp-c-danger);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-button:hover {
  background: var(--vp-c-danger);
  color: white;
}
</style>

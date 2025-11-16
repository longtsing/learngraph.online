import { defineConfig } from 'vitepress'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

// 为每本书生成侧边栏（简化版，移除缓存避免HMR冲突）
function getBookSidebar(bookDir: string, bookName: string) {
  try {
    const rootDir = path.resolve(fileURLToPath(new URL('../..', import.meta.url)))
    const bookPath = path.join(rootDir, bookDir)

    if (!fs.existsSync(bookPath)) {
      console.warn(`[VitePress] Book directory not found: ${bookPath}`)
      return []
    }

    let moduleDirs: string[] = []
    try {
      moduleDirs = fs.readdirSync(bookPath)
        .filter(dir => {
          try {
            const dirPath = path.join(bookPath, dir)
            return dir.startsWith('module-') && fs.statSync(dirPath).isDirectory()
          } catch (e) {
            // 忽略无法访问的目录（可能正在被写入）
            return false
          }
        })
        .sort()
    } catch (e) {
      console.warn(`[VitePress] Error reading book directory: ${bookPath}`, e)
      return []
    }

    const sidebar = []

    for (const moduleDir of moduleDirs) {
      const modulePath = path.join(bookPath, moduleDir)
      let files: string[] = []

      try {
        files = fs.readdirSync(modulePath)
          .filter(file => file.endsWith('.md'))
          .sort()
      } catch (e) {
        // 忽略无法读取的模块目录
        console.warn(`[VitePress] Error reading module directory: ${modulePath}`, e)
        continue
      }

      if (files.length === 0) continue

      const moduleNumber = moduleDir.replace(/module-(\d+).*/, '$1')
      const moduleName = moduleDir.replace(/module-\d+-?/, '').replace(/-/g, ' ')

      const items = files.map(file => {
        const fileName = file.replace('.md', '')
        return {
          text: fileName,
          link: `/${bookDir}/${moduleDir}/${file}`
        }
      })

      // 根据不同的书设置不同的章节标题
      let moduleText = `Module ${moduleNumber}`

      if (bookDir === 'learngraph') {
        const titles: {[key: string]: string} = {
          '0': 'Module 0: Python 基础',
          '1': 'Module 1: 基础概念',
          '2': 'Module 2: 核心组件',
          '3': 'Module 3: 核心机制',
          '4': 'Module 4: 人机协作',
          '5': 'Module 5: 高级模式',
          '6': 'Module 6: 记忆系统',
          '7': 'Module 7: 生产部署',
          '8': 'Module 8: 经典案例'
        }
        moduleText = titles[moduleNumber] || `Module ${moduleNumber}`
      } else if (moduleName) {
        moduleText = `Module ${moduleNumber}: ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`
      }

      sidebar.push({
        text: moduleText,
        collapsed: false,
        items: items
      })
    }

    return sidebar
  } catch (error) {
    console.error(`[VitePress] Fatal error in getBookSidebar for ${bookDir}:`, error)
    return []
  }
}

// 生成完整的侧边栏配置（移除缓存，让VitePress自己管理）
function generateSidebar() {
  return {
    '/learngraph/': getBookSidebar('learngraph', '智能体搭建 & LangGraph 飞速上手'),
    '/python-fundamentals/': getBookSidebar('python-fundamentals', 'AI 时代学 Python'),
    '/python-llms/': getBookSidebar('python-llms', '大模型飞速上手'),
    '/vibe-coding/': getBookSidebar('vibe-coding', 'Vibe Coding 氛围编程'),
  }
}

export default defineConfig({
  title: 'LearnGraph.online',
  description: '从 Python 基础到大模型应用，从 LangGraph 到智能体开发 - 系统化 AI 学习平台',
  lang: 'zh-CN',
  base: '/',
  ignoreDeadLinks: true,

  // 优化 Vite 配置，改善 HMR 稳定性
  vite: {
    server: {
      fs: {
        // 允许访问项目根目录
        allow: ['..']
      },
      watch: {
        // 使用轮询方式监听文件变化，更稳定但稍慢
        usePolling: false,
        // 忽略 node_modules
        ignored: ['**/node_modules/**', '**/.git/**']
      }
    },
    // 优化依赖预构建
    optimizeDeps: {
      exclude: ['vitepress']
    }
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'keywords', content: 'LearnGraph,AI,Python,LangGraph,LangChain,智能体,Agent,AI Agent,大模型,LLM' }],
    ['meta', { name: 'author', content: 'Bryce Wang' }],
    // 引入经典编程字体
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=JetBrains+Mono:wght@400;500&family=Source+Code+Pro:wght@400;500&display=swap', rel: 'stylesheet' }],
    // Google Analytics
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-W0FG0ENWH4' }],
    ['script', {}, `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-W0FG0ENWH4');`]
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '智能体 & LangGraph 飞速上手', link: '/learngraph/README' },
      { text: 'AI 时代学 Python', link: '/python-fundamentals/README' },
      { text: '大模型飞速上手', link: '/python-llms/README' },
      { text: 'Vibe Coding 氛围编程', link: '/vibe-coding/README' },
      { text: '🔑 API Key 配置', link: '/python-run' },
      { text: '关于作者', link: 'https://statspai.com' }
    ],

    sidebar: generateSidebar(),

    outline: {
      level: 'deep',
      label: '本页目录'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/brycewang-stanford/learngraph.online' }
    ],

    footer: {
      message: '基于 MIT 许可证发布。内容版权归作者所有。',
      copyright: 'Copyright © 2025-present 王几行XING（Bryce Wang）'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },

    editLink: {
      pattern: 'https://github.com/brycewang-stanford/learngraph.online/edit/main/:path',
      text: '在 GitHub 上编辑此页'
    }
  },

  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },

  // 设置文档根目录为项目根目录，这样可以直接访问各个书的目录
  srcDir: '..'
})

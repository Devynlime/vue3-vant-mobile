<script setup>
import { ref } from 'vue'
import {
  Bell,
  Cable,
  Grid,
  Map,
  Moon,
  Sun,
  Video,
} from 'lucide-vue-next'

const isDark = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

const menuItems = [
  {
    title: '电缆设备概览',
    route: '/smartCable/dev-overview',
    icon: Cable,
  },
  {
    title: '在线监测-告警',
    route: '/smartCable/cable-alarm',
    icon: Bell,
  },
  {
    title: '电缆井运行态势总览',
    route: 'smartCable',
    icon: Grid,
  },
  {
    title: '电缆井运维监控平台',
    route: '/smartCable/video-surveillance',
    icon: Video,
  },
  {
    title: '通道一张图',
    route: '/smartCable/channel-detect',
    icon: Map,
  },
]
</script>

<template>
  <div class="page-container">
    <!-- 头部区域 -->
    <header v-show="false" class="header">
      <h1 class="title">
        主页
      </h1>
      <div class="theme-switch">
        <Sun class="sun-icon" />
        <el-switch
          v-model="isDark"
          inline-prompt
          @change="toggleTheme"
        />
        <Moon class="moon-icon" />
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="menu-container">
        <h2 class="menu-title">
          应用
        </h2>
        <div class="menu-list">
          <router-link
            v-for="item in menuItems"
            :key="item.route"
            :to="item.route"
            class="menu-item"
          >
            <component
              :is="item.icon"
              class="menu-icon"
              size="24"
            />
            <span class="menu-text">{{ item.title }}</span>
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--el-fill-color-light);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--el-text-color-primary);
}

.theme-switch {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sun-icon {
  color: #f59e0b;
  width: 20px;
  height: 20px;
}

.moon-icon {
  color: #3b82f6;
  width: 20px;
  height: 20px;
}

.main-content {
  margin-top: 1rem;
}

.menu-container {
  background-color: var(--el-bg-color);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: var(--el-box-shadow-light);
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  text-decoration: none;
  color: var(--el-text-color-primary);
  border-radius: 6px;
  transition: background-color 0.3s;
}

.menu-item:hover {
  background-color: var(--el-fill-color-light);
}

.menu-icon {
  color: var(--el-color-primary);
}
</style>

<route lang="json">
{
  "name": "home",
  "meta": {
    "title": "主页",
    "i18n": "menus.home"
  }
}
</route>

# 智能电缆监控系统开发手册

## 1. 项目概述

这是一个基于 Vue 3 生态系统的移动端电缆监控管理系统。主要用于电缆井、变电站等设备的监控和管理。

### 1.1 技术栈

- Vue 3 + Vite 5
- Vant UI (移动端组件库)
- Element Plus (部分PC端组件)
- TypeScript
- Pinia (状态管理)
- UnoCSS (原子化CSS)

### 1.2 项目特性

- 基于文件的路由系统
- 组件自动导入
- PWA支持
- 国际化支持
- 暗黑模式
- TypeScript 类型检查
- 微应用架构支持

## 2. 项目结构

```
src/
├── api/                # API 接口定义
├── components/         # 公共组件
├── pages/             # 页面文件(基于文件的路由)
├── stores/            # Pinia 状态管理
├── styles/            # 全局样式
├── utils/             # 工具函数
└── locales/           # 国际化文件
```

## 3. 核心功能模块

### 3.1 电缆井运行态势总览

位置: `src/pages/smartCable/index.vue`

主要功能:

- 地图监控
- 电缆线路/段/接头管理
- 电缆井/通道/管孔管理

### 3.2 设备概况

位置: `src/pages/smartCable/dev-overview/index.vue`

包含:

- 地图监控
- 变电站/电缆线路概况
- 中间设备状态

### 3.3 告警管理

位置: `src/pages/smartCable/cable-alarm/index.vue`

功能:

- 告警概览
- 工单管理
- 设备状态监控
- 历史告警查询
- 告警配置

## 4. 开发指南

### 4.1 环境准备

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

### 4.2 新增页面

1. 在 `src/pages` 目录下创建对应的 Vue 文件
2. 使用 `<route>` 自定义块定义路由信息:

```vue
<route lang="json">
{
    "name": "pageName",
    "meta": {
        "title": "页面标题"
    }
}
</route>
```

### 4.3 状态管理

使用 Pinia 进行状态管理,支持持久化:

```typescript
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    count: 0
  }),
  persist: true // 启用状态持久化
})
```

### 4.4 样式开发

- 支持 Less 预处理器
- 使用 UnoCSS 进行原子化 CSS 开发
- 支持暗黑模式适配:

```css
/* 暗黑模式样式 */
@media (prefers-color-scheme: dark) {
  .container {
    background-color: #1c1c1e;
    color: #f5f5f5;
  }
}
```

### 4.5 组件开发

组件位于 `src/components` 目录,支持自动导入:

```vue
<script setup>
// 无需手动导入,直接使用
</script>

<template>
  <van-button>按钮</van-button>
</template>
```

## 5. 调试功能

### 5.1 VConsole 调试工具

- 在设置页面中开启/关闭
- 用于移动端查看控制台日志、网络请求等
- 所有环境可用

### 5.2 开发环境配置

```bash
# 启动带 Mock 的开发服务器
pnpm dev

# 启动特定模式
pnpm build:dev        # 开发环境构建
pnpm build:iguowang  # 特定环境构建
```

## 6. 部署说明

### 6.1 构建命令

```bash
# 标准构建
pnpm build

# 指定基础路径构建
pnpm build:smart-cable-h5

# 特定环境构建
pnpm build:iguowang
```

### 6.2 微应用部署

项目支持作为微应用集成到主应用中:

1. 配置微应用信息
2. 使用 SDK 进行通信
3. 共享用户状态

## 7. 注意事项

1. 代码提交前会自动运行 ESLint 检查
2. 使用 TypeScript 编写代码以获得更好的类型提示
3. 注意适配移动端和桌面端的显示效果
4. 合理使用状态持久化功能
5. 遵循项目的编码规范和提交规范

## 8. 常见问题

1. 组件未自动导入

   - 检查组件名称是否符合规范
   - 检查组件目录是否正确
2. 路由未生效

   - 检查文件名是否正确
   - 检查 `<route>` 块配置
3. 样式问题

   - 检查是否正确使用了 UnoCSS
   - 检查暗黑模式适配
   - 检查移动端适配
4. 类型错误

   - 确保正确定义了 TypeScript 类型
   - 使用 IDE 提供的类型提示
5. 提交检测

   - 若提交遇到检测问题，可以通过： pnpm lint:fix 来解决部分问题；

## 9. 更新日志

请参考项目根目录的 CHANGELOG.md 文件了解详细的更新历史。

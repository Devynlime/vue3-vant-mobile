# Changelog

## [Unreleased]

### Changed
- 优化 `EchartMap.vue` 组件的地图渲染逻辑，使用 `nextTick` 确保 DOM 更新后再初始化图表
- 改进地图数据加载机制，使用 `Promise.all` 并行加载数据，提升加载效率
- 完善错误处理机制，添加完整的错误捕获和提示

### Fixed
- 修复地图无法填满容器的问题，通过正确设置容器尺寸和使用 `nextTick` 解决
- 优化了地图组件的响应式布局表现

## [1.1.12] - 2024-12-06

### Added
- 添加 ESLint 配置，使用 @antfu/eslint-config 作为基础配置。

[以下内容保持不变...]

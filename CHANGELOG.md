# Changelog

## [Unreleased]

## [1.1.12] - 2024-12-06

### Added

- 添加 ESLint 配置，使用 @antfu/eslint-config 作为基础配置。

### Changed

- 更新 VS Code 编辑器配置，将默认格式化工具改为 ESLint。
- 统一代码风格，使用 antfu 的 ESLint 规则进行代码格式化。

### Fixed

- 解决了多个格式化工具冲突的问题，统一使用 ESLint 进行代码格式化。

## [1.0.1] - 2024-12-06

### Changed

- 优化 `EchartMap.vue` 组件，使用静态导入方式加载 JSON 数据，减少运行时的网络请求，提高页面加载速度。

### Fixed

- 修复了由于多次网络请求导致的页面加载延迟问题。

## [1.0.0] - 2023-10-15

### Added

- 创建 `EchartMap.vue` 组件，实现地图数据的动态加载。
- 使用 `fetch` 方法从服务器获取地图数据。
- 实现基本的地图显示功能，包括标题、提示框和视觉映射。

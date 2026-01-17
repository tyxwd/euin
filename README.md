# LipoSERS - 生物医学数据分析平台

[![uni-app](https://img.shields.io/badge/uni--app-3.0.0-007aff.svg)](https://uniapp.dcloud.net.cn/)
[![Vue](https://img.shields.io/badge/Vue-3.4.21-4FC08D.svg)](https://vuejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

LipoSERS 是一个基于 uni-app 开发的跨平台生物医学数据分析应用，支持多种机器学习算法进行数据分析和可视化展示。

## ✨ 功能特性

### 🔬 多种分析方法
- **SVM算法**: 支持向量机算法进行分类预测
- **定量计算**: 化合物浓度定量分析
- **决策树模型**: 基于决策树的分类分析

### 🤖 丰富的模型选择
- **SVM模型**: 默认模型、BRCA模型、BRCA混合模型、P模型、P混合模型、HPV模型
- **定量计算**: 视黄醇、维生素K、维生素D、胡萝卜素等多种化合物分析
- **决策树**: 多种营养素混合分析模型

### 📊 数据可视化
- 饼图和条形图切换显示概率分布
- 实时数据分析结果展示
- 质量控制信息显示
- 支持 ECharts 和 uCharts 双图表库

### 🌍 国际化支持
- 支持中文（简体）和英文
- 动态语言切换

### 📱 跨平台支持
- H5网页端
- 微信小程序
- 支付宝小程序
- 百度小程序
- 字节跳动小程序
- QQ小程序
- 快手小程序
- 飞书小程序
- 小红书小程序
- 京东小程序
- App Plus
- 快应用

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm 或 yarn 或 pnpm

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
# H5平台
npm run dev:h5

# 微信小程序
npm run dev:mp-weixin

# 支付宝小程序
npm run dev:mp-alipay

# 百度小程序
npm run dev:mp-baidu

# QQ小程序
npm run dev:mp-qq

# 字节跳动小程序
npm run dev:mp-toutiao

# 快手小程序
npm run dev:mp-kuaishou

# 飞书小程序
npm run dev:mp-lark

# 小红书小程序
npm run dev:mp-xhs

# 京东小程序
npm run dev:mp-jd

# 鸿蒙应用
npm run dev:mp-harmony

# App Plus
npm run dev:custom

# 快应用
npm run dev:quickapp-webview
```

### 构建生产版本

```bash
# H5平台
npm run build:h5

# 微信小程序
npm run build:mp-weixin

# 支付宝小程序
npm run build:mp-alipay

# 百度小程序
npm run build:mp-baidu

# QQ小程序
npm run build:mp-qq

# 字节跳动小程序
npm run build:mp-toutiao

# 快手小程序
npm run build:mp-kuaishou

# 飞书小程序
npm run build:mp-lark

# 小红书小程序
npm run build:mp-xhs

# 京东小程序
npm run build:mp-jd

# 鸿蒙应用
npm run build:mp-harmony

# App Plus
npm run build:custom

# 快应用
npm run build:quickapp-webview
```

## ⚙️ 项目配置

### 应用配置 (manifest.json)
- **应用名称**: LipoSERS
- **版本**: 1.0.0
- **支持平台**: H5、小程序、App Plus、快应用等
- **权限配置**: 包含相机、存储、网络等必要权限

### 页面配置 (pages.json)
- **首页**: `pages/index/index` - 主分析界面
- **导航栏**: 标题为 "LipoSERS"
- **全局样式**: 统一的导航栏和背景色配置

### 构建配置 (vite.config.js)
- **插件**: 使用 `@dcloudio/vite-plugin-uni` 进行 uni-app 构建
- **别名**: `@` 指向 `src` 目录
- **路径解析**: 支持绝对路径导入

```
src/
├── components/          # 组件目录
│   ├── ResultDisplay.vue       # 结果展示组件
│   ├── ProbabilityDisplay.vue  # 概率分布显示组件
│   ├── FileInfoDisplay.vue     # 文件信息显示组件
│   ├── TeamGuide.vue          # 团队引导组件
│   ├── TeamIntro.vue          # 团队介绍组件
│   └── TeamLogoDisplay.vue    # 团队标识组件
├── config/             # 配置文件
│   ├── models.js       # 模型配置
│   ├── settings.js     # 应用设置
│   └── fileTypes.js    # 文件类型配置
├── composables/        # 组合式函数
│   └── useFileHandler.js # 文件处理逻辑
├── icons/              # 图标组件
│   ├── icon-pie.vue    # 饼图图标
│   └── icon-bar.vue    # 条形图图标
├── lang/               # 国际化文件
│   ├── zh-CN.js        # 中文语言包
│   ├── en.js           # 英文语言包
│   └── index.js        # 语言配置入口
├── mixins/             # 混入
│   └── index.js        # 语言和模型混入
├── pages/              # 页面
│   └── index/          # 首页
│       └── index.vue
├── static/             # 静态资源
│   └── logo/           # 团队标识图片
├── utils/              # 工具函数
│   └── index.js        # 通用工具
├── App.vue             # 应用入口
├── main.js             # 主入口文件
├── manifest.json       # 应用配置
├── pages.json          # 页面配置
└── uni.scss            # 全局样式
```

## � API 接口

项目通过以下接口与后端服务交互：

### 文件上传接口
```
POST /upload
```
- 上传分析文件到服务器
- 支持多种文件格式（根据 `fileTypes.js` 配置）
- 返回文件处理状态和唯一标识

### 预测接口
```
POST /predict
```
- 执行机器学习预测分析
- 根据选择的模型类型返回分析结果
- 支持 SVM、定量计算、决策树等多种算法
- 返回预测结果、置信度和可视化数据

### 接口配置
在 `src/config/settings.js` 中配置后端服务地址：
```javascript
export const API_BASE_URL = 'https://your-api-domain.com/api'
```

## 🌐 国际化

项目支持多语言切换，语言文件位于 `src/lang/` 目录：

- `zh-CN.js` - 中文（简体）
- `en.js` - English

## 📊 API 接口

项目依赖的后端 API 接口：

- `POST /upload` - 文件上传
- `POST /predict_custom` - 数据分析预测

## 🛠️ 技术栈

- **框架**: uni-app 3.0 + Vue 3
- **构建工具**: Vite 5.2.8
- **UI组件**: uni-app 内置组件
- **图表库**: ECharts 6.0.0
- **国际化**: vue-i18n 9.14.5
- **样式**: SCSS

## 📝 开发指南

### 添加新的分析模型

1. 在 `src/config/models.js` 中添加模型配置
2. 更新相应的语言文件
3. 在组件中添加相应的处理逻辑

### 添加新的语言支持

1. 在 `src/lang/` 目录下创建新的语言文件
2. 在 `src/config/models.js` 中添加语言配置
3. 在 `src/lang/index.js` 中注册新语言

### 组件开发

项目采用组件化开发，每个功能模块都有独立的组件：

- 使用 Vue 3 Composition API
- 支持 TypeScript（可选）
- 遵循 uni-app 开发规范

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## � 部署指南

### H5 部署
1. 构建 H5 版本：
```bash
npm run build:h5
```
2. 将 `dist/build/h5` 目录部署到 Web 服务器

### 小程序部署
1. 构建对应平台版本：
```bash
npm run build:mp-weixin    # 微信小程序
npm run build:mp-alipay    # 支付宝小程序
```
2. 使用对应平台的开发者工具导入构建出的项目

### App 部署
1. 构建 App Plus 版本：
```bash
npm run build:custom
```
2. 使用 HBuilderX 或相关工具进行 App 打包

## 🤝 贡献指南

### 开发规范
1. **代码风格**: 遵循 Vue 3 Composition API 最佳实践
2. **组件命名**: 使用 PascalCase 命名组件文件
3. **提交信息**: 使用清晰的提交信息描述变更

### 添加新功能
1. **分析模型**: 在 `src/config/models.js` 中添加新模型配置
2. **语言支持**: 在 `src/lang/` 目录下添加新的语言文件
3. **组件开发**: 在 `src/components/` 下创建可复用组件

### 测试流程
1. 本地开发测试：`npm run dev:h5`
2. 跨平台兼容性测试
3. 构建测试：`npm run build:h5`

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系我们

如有问题或建议，请通过以下方式联系：
- 项目维护者：开发团队
- 技术支持：issues 或 pull requests

## 👥 团队介绍

本项目由以下团队和合作伙伴开发：

- **科学实验室**: 开放科学研究与技术创新支持
- **分析团队**: 数据可视化与智能分析

## 📞 联系我们

如有问题或建议，请通过以下方式联系：

- 项目地址: [GitHub Repository]
- 邮箱: [your-email@example.com]

---

**LipoSERS** - 让生物医学数据分析变得简单而强大！ 🚀</content>
<parameter name="filePath">d:\WebstormProjects\euin01\README.md
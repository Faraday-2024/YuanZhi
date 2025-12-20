# 元知 YuanZhi - 可视化教育平台

元知是一个集成式可视化教育应用平台，提供三种不同的学习模式，帮助学生通过多样化的方式学习和理解知识。

## ✨ 功能特性

### 📚 备考模式 (Exam Prep Mode)
- 上传题目图片，AI自动分析并生成详细解题步骤
- 智能生成可视化辅助图像
- 支持SVG、3D动画等多种可视化形式
- 时间线式的步骤展示

### 🎯 专题模式 (Topic Mode)
- 结构化的知识专题学习
- 方法详解和本地练习
- 进度跟踪和成绩分析
- 个性化学习路径

### 🌌 探索模式 (Exploration Mode)
- 沉浸式的科学历史互动体验
- 游戏化的学习场景
- AI驱动的动态对话
- 观测游戏和轨道计算

## 🚀 快速开始

### 前置要求

- Node.js 18+ 
- npm 或 yarn

### 安装步骤

1. **克隆项目**
   ```bash
   cd yuanzhi-app
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   
   复制 `.env.local` 文件并填入你的 Gemini API 密钥：
   ```bash
   # .env.local
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   
   获取API密钥：https://aistudio.google.com/app/apikey

4. **启动开发服务器**
   ```bash
   npm run dev
   ```
   
   应用将在 http://localhost:3000 打开

5. **构建生产版本**
   ```bash
   npm run build
   ```

## 📁 项目结构

```
yuanzhi-app/
├── src/
│   ├── layouts/              # 布局组件
│   ├── pages/                # 页面组件
│   ├── features/             # 功能模块
│   │   ├── exam-prep/        # 备考模式
│   │   ├── topic/            # 专题模式
│   │   └── exploration/      # 探索模式
│   ├── shared/               # 共享资源
│   │   ├── components/       # 通用组件
│   │   ├── services/         # 共享服务
│   │   ├── hooks/            # 自定义Hooks
│   │   ├── utils/            # 工具函数
│   │   └── types/            # 类型定义
│   ├── config/               # 配置文件
│   └── test/                 # 测试配置
├── public/                   # 静态资源
└── ...配置文件
```

## 🛠️ 技术栈

- **前端框架**: React 19.2+
- **构建工具**: Vite 6.2
- **语言**: TypeScript 5.8
- **路由**: React Router v6
- **样式**: Tailwind CSS
- **AI服务**: Google Gemini API
- **图标**: Lucide React
- **数学渲染**: KaTeX
- **图表**: Recharts
- **3D可视化**: D3.js

## 🧪 测试

```bash
# 运行测试
npm run test

# 运行测试UI
npm run test:ui

# 生成覆盖率报告
npm run test:coverage
```

## 📝 开发指南

### 添加新功能模块

1. 在 `src/features/` 下创建新的功能目录
2. 定义类型在 `types.ts`
3. 创建组件在 `components/` 目录
4. 在 `src/pages/` 创建对应的页面组件
5. 在 `App.tsx` 中添加路由

### 使用共享服务

```typescript
import { analyzeProblemImage } from '@shared/services/geminiService';

const result = await analyzeProblemImage(imageData, mimeType);
```

### 样式规范

- 使用 Tailwind CSS 工具类
- 遵循响应式设计原则
- 保持三个模式的视觉一致性

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证

## 🙏 致谢

- Google Gemini API 提供AI能力支持
- React 和 Vite 社区
- 所有贡献者

---

**元知 YuanZhi** - 让学习更直观，让知识更生动 ✨

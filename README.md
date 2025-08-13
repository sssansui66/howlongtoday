# HowLongToday / 今日时光

一个简洁、实时展示今天已经过去时间的网站，以秒为单位精确到毫秒级别。

## ✨ 最新更新 (2025-01-13)

- 🎨 **极简现代设计** - 采用 Apple 设计语言，清爽简洁
- 🎯 **品牌图标系统** - 完整的多平台图标支持
- 📱 **PWA 支持** - 可安装为独立应用
- 🌈 **智能主题切换** - Logo 图标随主题自动适配

## 功能特性

- 🕐 **实时更新** - 毫秒级精确显示已过去的秒数
- 🌍 **多时区支持** - 支持全球主要城市时区切换
- 🌐 **多语言** - 支持中文和英文界面
- 🌓 **主题切换** - 日间/夜间模式自适应
- 📱 **响应式设计** - 完美适配桌面、平板和手机
- ⚡ **高性能** - 可调节刷新率，低CPU占用
- 💾 **本地存储** - 记住用户偏好设置
- 🎯 **PWA 支持** - 可安装为桌面/移动应用
- 🖼️ **品牌图标** - 完整的 favicon 和社交媒体预览支持

## 技术栈

- 原生 HTML5 + CSS3 + JavaScript
- 无框架依赖，轻量快速
- 使用 Web API 实现时区和国际化
- LocalStorage 存储用户设置

## 快速开始

1. 直接在浏览器中打开 `index.html` 文件
2. 或部署到任何静态网站托管服务

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 项目结构

```
howlongtoday/
├── index.html          # 主页面
├── styles.css          # 样式文件（极简现代风格）
├── js/
│   ├── main.js        # 核心逻辑
│   ├── i18n.js        # 国际化
│   ├── theme.js       # 主题管理（含图标切换）
│   └── timezone.js    # 时区管理
├── hlt_brand_kit/     # 品牌资源
│   ├── favicon.ico    # 通用图标
│   ├── favicon-32.png # 32x32 图标
│   ├── apple-touch-icon-180.png  # Apple 设备图标
│   ├── android-chrome-*.png      # Android 图标
│   ├── hlt_icon_dark_*.png      # 深色主题图标
│   ├── hlt_icon_light_*.png     # 浅色主题图标
│   ├── og-image-1200x630.jpg    # 社交媒体预览图
│   └── safari-pinned-tab.svg    # Safari 固定标签图标
├── site.webmanifest   # PWA 配置文件
├── CHANGELOG.md       # 更新日志
├── favicon.ico        # 网站图标（兼容旧版）
└── README.md          # 项目说明
```

## 设计主题

项目包含多个设计主题分支：

- `main` - 极简现代风格（当前主题）
- `digital-futuristic-theme` - 数字未来感（霓虹科技风）
- `minimal-modern-theme` - 极简现代（备用分支）

切换主题：
```bash
git checkout [branch-name]
```

## 性能指标

- 首屏加载时间 < 2秒
- CPU占用 < 5%
- 内存占用 < 50MB
- Lighthouse分数 > 90

## 开发者

Created with ❤️ by qingzai with Claude

## 许可证

MIT License
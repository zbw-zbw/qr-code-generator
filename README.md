# qr-code-generator - 二维码生成浏览器插件

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-red.svg)

【二维码生成】Chrome 浏览器插件，根据链接智能生成二维码，支持参数编辑、编辑内容自动缓存、图片解码等特色功能

[插件链接](https://chromewebstore.google.com/detail/qr-code-generator-scanner/jklnokpkcmlbchlhegebjbhdhdamnmpg)

## ✨ 功能特性

### 🎯 核心功能
- 🚀 **智能二维码生成** - 自动获取当前页面，实时生成高清二维码
- 🔍 **多方式二维码解码** - 上传图片、粘贴截图、网络链接三种解码方式
- ✏️ **可视化URL编辑** - 实时编辑链接，智能参数管理
- 🔄 **无缝模式切换** - 生成与解码模式自由切换，保持工作流连续性
- 📋 **一键式操作** - 复制链接、下载二维码、结果处理等快捷功能

### 🔍 解码功能亮点
- 📂 **本地文件解码** - 支持 PNG、JPG、JPEG、GIF、WebP、SVG 格式
- 📋 **剪贴板解码** - Ctrl+V 直接粘贴截图或复制的图片
- 🌐 **网络图片解码** - 输入图片 URL 进行远程解码
- 🎨 **SVG特殊支持** - 智能处理矢量格式二维码
- 🔗 **智能结果处理** - 自动识别URL/文本，提供对应操作选项

### 🎨 用户体验
- ⚡ **即时响应** - 所有操作实时反馈，零延迟体验
- ⌨️ **键盘友好** - 完整快捷键支持，无冲突设计
- 🔐 **本地处理** - 所有数据本地处理，保护隐私安全
- 🎪 **现代界面** - 简洁美观的设计，优化的空间布局
- 📱 **响应式设计** - 适配不同屏幕尺寸的扩展弹窗

## 🚀 快速开始

### 安装扩展

#### 方法一：构建安装（推荐）
```bash
# 克隆仓库
git clone https://github.com/zbw-zbw/qr-code-generator.git
cd qr-code-generator

# 安装依赖
npm install

# 构建生产版本
npm run build
```

然后在 Chrome 中：
1. 访问 `chrome://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目的 `dist` 目录

#### 方法二：开发模式
```bash
# 启动开发服务器
npm run dev
```
在 Chrome 扩展页面加载项目根目录。

### 使用指南

#### 生成模式
1. **打开扩展**：点击 Chrome 工具栏中的扩展图标
2. **自动生成**：当前页面二维码自动显示
3. **编辑URL**：点击输入框修改链接，二维码实时更新
4. **管理参数**：
   - 在参数列表中直接编辑键值对
   - 按 `Enter` 保存，`Esc` 取消
   - 点击 `+ 添加参数` 新增参数
5. **导出分享**：使用底部按钮复制链接或下载二维码

#### 解码模式 🆕
1. **切换模式**：点击顶部"解码"标签
2. **选择输入方式**：
   - 📂 **上传图片**：点击上传按钮选择本地图片文件
   - 📋 **粘贴图片**：按 `Ctrl+V` 粘贴剪贴板中的图片
   - 🌐 **网络图片**：输入图片URL地址
3. **查看结果**：解码成功后显示内容和类型
4. **后续操作**：
   - 复制解码结果到剪贴板
   - 直接打开链接（如果是URL）
   - 切换到编辑模式继续处理参数

### 键盘快捷键
- **生成模式**：直接开始编辑URL，实时生成二维码
- **参数编辑**：`Enter` 保存，`Esc` 取消，`Tab` 切换字段
- **解码模式**：`Ctrl+V` 快速粘贴图片解码

## 🛠 技术栈

- **前端框架**: React 18 + TypeScript
- **样式系统**: Tailwind CSS  
- **构建工具**: Vite + crxjs/vite-plugin
- **二维码生成**: qrcode + qrcode.react
- **二维码解码**: jsQR 库
- **图像处理**: Canvas API + File API
- **扩展标准**: Chrome Manifest V3

## 📱 功能测试

安装后建议测试以下功能：

### 生成功能
- [ ] 打开扩展查看当前页面二维码（240px高清显示）
- [ ] 编辑 URL 地址，观察二维码实时更新
- [ ] 添加/修改/删除 URL 参数
- [ ] 复制链接和二维码到剪贴板
- [ ] 下载二维码图片
- [ ] 使用重置功能恢复原始 URL

### 解码功能 🆕
- [ ] 上传包含二维码的图片文件
- [ ] 截图后粘贴解码（Ctrl+V）
- [ ] 输入网络图片URL进行解码
- [ ] 测试SVG格式二维码解码
- [ ] 解码后复制结果、打开链接
- [ ] 从解码结果无缝切换到编辑模式

## 🔧 开发指南

### 开发环境

```bash
# 安装依赖
npm install

# 开发模式（支持热重载）
npm run dev

# 构建生产版本  
npm run build

# TypeScript类型检查
npm run type-check
```

### 项目结构

```
qr-code-generator/
├── docs/                        # 项目文档
│   ├── PRD.md                       # 产品需求文档
│   ├── CHROME_STORE_GUIDE.md        # Chrome 商店发布指南
│   ├── STORE_DESCRIPTION.md         # 商店描述文案
│   └── CHANGELOG_TEMPLATE.md        # 更新日志模板
├── src/
│   ├── popup/
│   │   ├── components/          # React 组件
│   │   │   ├── QRCodeDisplay.tsx    # 二维码显示
│   │   │   ├── URLInput.tsx         # URL输入框
│   │   │   ├── URLParamsEditor.tsx  # 参数编辑器
│   │   │   ├── ActionButtons.tsx    # 操作按钮
│   │   │   ├── ModeSwitch.tsx       # 模式切换
│   │   │   ├── QRCodeDecoder.tsx    # 二维码解码
│   │   │   └── DecodeResult.tsx     # 解码结果
│   │   ├── hooks/               # 自定义 React Hooks
│   │   ├── App.tsx              # 主应用组件
│   │   ├── index.tsx            # 入口文件
│   │   └── index.html           # HTML 模板
│   ├── types/                   # 共享类型定义
│   │   └── index.ts
│   ├── utils/                   # 工具函数
│   │   ├── chrome.ts                # Chrome API 封装
│   │   └── url.ts                   # URL 验证工具
│   ├── styles/
│   │   └── globals.css          # 全局样式
│   └── manifest.json            # 扩展配置文件（Manifest V3）
├── CHANGELOG.md                 # 版本更新日志
├── LICENSE                      # MIT 许可证
├── README.md
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## 🔒 权限说明

此扩展仅请求最小必要权限：

- `activeTab`: 读取当前激活标签页的 URL
- `clipboardRead`: 处理剪贴板图片

**隐私承诺**：
- ✅ 所有二维码生成/解码操作均在本地完成
- ✅ 不涉及任何网络请求和数据上传
- ✅ 图片处理完全在浏览器内存中进行
- ✅ 保护您的隐私和数据安全

## 🐛 故障排除

### 常见问题

**Q: 扩展图标显示为字母"S"**
- A: 需要重新加载扩展。在 `chrome://extensions/` 中找到本扩展，点击刷新按钮

**Q: 解码功能无法识别二维码**
- A: 确保图片清晰度足够，二维码完整可见。支持格式：PNG、JPG、JPEG、GIF、WebP、SVG

**Q: SVG格式二维码解码失败**  
- A: SVG解码需要额外处理时间，请稍等。确保SVG文件包含有效的二维码图形

**Q: 粘贴功能不工作**
- A: 确保剪贴板中有图片内容，然后在解码模式下按 `Ctrl+V`

**Q: 参数编辑时按ESC关闭了整个插件**
- A: 已在v1.0.1中修复此问题，ESC现在只会取消当前编辑

### 开发相关

**Q: TypeScript 编译错误**
- A: 运行 `npm run type-check` 检查语法错误

**Q: 热重载不工作**
- A: 重启开发服务器 `npm run dev`，在扩展页面重新加载

## 🔮 版本规划

### v1.0.3 ✅ 当前版本
- [x] ✅ 二维码解码功能（多种输入方式）
- [x] ✅ 模式切换系统
- [x] ✅ SVG格式支持
- [x] ✅ 界面优化（去除冗余标题，增大二维码）
- [x] ✅ 统一样式系统
- [x] ✅ 专业图标设计

### v1.1.0 🔄 计划中
- [ ] 解码历史记录功能
- [ ] 批量图片解码
- [ ] 更多二维码样式选项
- [ ] 设置页面和偏好配置

### v1.2.0 🔮 未来版本
- [ ] 条形码识别支持
- [ ] 云端同步功能
- [ ] 国际化支持(i18n)
- [ ] 更多导出格式

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发贡献指南
1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

**qr-code-generator v1.1.0** - 让二维码处理更智能、更高效！ 🎉 

# Chrome Web Store 发布完整指南

## 📋 发布前检查清单

### ✅ 必需文件
- [x] manifest.json（已优化SEO）
- [x] 图标文件（16x16, 32x32, 48x48, 128x128）
- [ ] 宣传图片（440x280 像素）- **需要准备**
- [ ] 截图（1280x800 或 640x400）- **需要准备至少1张，建议5张**
- [ ] 小型宣传图块（440x280）- 可选但推荐

---

## 🎨 需要准备的图片素材

### 1. 截图（Screenshots）- **必需**
**尺寸要求：**
- 推荐：1280x800 像素
- 最小：640x400 像素
- 格式：PNG 或 JPG
- 数量：至少1张，最多5张

**建议截图内容：**
1. **主界面 - 生成模式**（展示二维码生成）
2. **URL参数编辑器**（展示独特功能）
3. **解码模式**（展示扫描功能）
4. **智能缓存提示**（展示智能功能）
5. **功能总览**（列出所有功能）

**截图制作技巧：**
- 使用浏览器开发者工具截图
- 添加标题和说明文字
- 使用箭头或高亮突出重点
- 保持界面整洁美观

### 2. 宣传图片（Promotional Images）- **推荐**
**小型宣传图块（Small Promo Tile）：**
- 尺寸：440x280 像素
- 格式：PNG 或 JPG
- 用途：在Chrome Web Store搜索结果中显示

**大型宣传图块（Large Promo Tile）：**
- 尺寸：920x680 像素
- 格式：PNG 或 JPG
- 用途：在Chrome Web Store精选区域显示（可选）

**宣传图片设计建议：**
- 包含插件名称
- 展示核心功能图标
- 使用品牌颜色（紫色渐变）
- 简洁明了的文字说明

---

## 📝 Chrome Web Store 表单填写指南

### 1. 商品信息（Item Details）

#### **商品名称（Item Name）**
```
QR Code Generator & Scanner - URL Editor
```
✅ 已在 manifest.json 中设置，自动读取

#### **摘要（Summary）**
```
Free QR code generator & scanner. Create QR codes from URLs, scan/decode QR images (PNG/JPG/WebP/SVG), edit URL parameters visually. 100% offline, no ads.
```
✅ 已在 manifest.json 中设置，自动读取
⚠️ 限制：132个字符

#### **详细说明（Detailed Description）**
📄 **直接复制粘贴 CHROME_STORE_DESCRIPTION.txt 的全部内容**

⚠️ 注意事项：
- 最多16,000个字符
- 支持纯文本，不支持HTML
- 可以使用 Unicode 字符（如表情符号）
- 可以使用特殊符号（如 ━、✓、•）

#### **类别（Category）**
```
主类别：工具（Tools）
```
如果有子类别选项，可以选择：
```
子类别：开发者工具（Developer Tools）
```

#### **语言（Language）**
```
英语（English）
```
⚠️ 如果要支持中文用户，可以添加中文本地化

---

### 2. 图形资源（Graphic Assets）

#### **图标（Icon）**
✅ 已在 manifest.json 中设置
- 16x16, 32x32, 48x48, 128x128

#### **截图（Screenshots）** - **必需**
- 上传 1-5 张截图
- 建议上传 5 张
- 每张截图可以添加标题（可选）

#### **宣传图片（Promotional Images）** - **推荐**
- 小型宣传图块：440x280（推荐上传）
- 大型宣传图块：920x680（可选）

---

### 3. 隐私政策（Privacy）

#### **隐私实践（Privacy Practices）**
需要回答以下问题：

**Q: 您的扩展程序是否会收集或使用用户数据？**
```
选择：否（No）
```

**Q: 您的扩展程序是否使用远程代码？**
```
选择：否（No）
```

**隐私政策URL（可选）：**
如果没有独立网站，可以不填。或者创建一个简单的隐私政策：

```
Privacy Policy for QR Code Generator & Scanner

Data Collection:
We do NOT collect, store, or transmit any user data. All processing happens locally in your browser.

Permissions:
- activeTab: To read current page URL for QR code generation
- clipboardRead: To paste QR code images for decoding
- storage: To save your work locally (cache)

Third-party Services:
We do NOT use any third-party services or analytics.

Contact:
For questions, please contact us through the Chrome Web Store support tab.

Last updated: [当前日期]
```

---

### 4. 分发（Distribution）

#### **可见性（Visibility）**
```
选择：公开（Public）
```

#### **地区（Regions）**
```
选择：所有地区（All regions）
```

---

### 5. 更新日志（Version History）

**首次发布时填写：**
```
📄 直接复制 CHANGELOG_TEMPLATE.md 中的 Version 1.0.2 部分
```

**示例：**
```
Version 1.0.2

🎉 New Features
• Smart cache system: Auto-save your work and restore when needed
• Intelligent URL detection: Automatically use current page or restore previous edit
• Visual URL parameter editor with real-time preview

🐛 Bug Fixes
• Fixed parameter editing bug
• Improved URL input styling
• Fixed cache functionality

🎨 UI Improvements
• Optimized input box layout
• Enhanced QR code display
• Improved restore hint UI

🚀 Performance
• Added storage permission for reliable caching
• Optimized URL parsing
• Improved error handling
```

---

## 🚀 发布流程

### Step 1: 准备文件
1. ✅ 构建项目：`npm run build`
2. ✅ 检查 dist 文件夹
3. ✅ 压缩为 ZIP 文件

### Step 2: 上传到 Chrome Web Store
1. 访问：https://chrome.google.com/webstore/devconsole
2. 点击"新增项目"
3. 上传 ZIP 文件
4. 等待自动检查完成

### Step 3: 填写商品信息
1. **商品名称**：自动读取（无需填写）
2. **摘要**：自动读取（无需填写）
3. **详细说明**：复制粘贴 CHROME_STORE_DESCRIPTION.txt
4. **类别**：选择"工具"
5. **语言**：选择"英语"

### Step 4: 上传图形资源
1. **截图**：上传 1-5 张（必需）
2. **小型宣传图块**：上传 440x280（推荐）
3. **大型宣传图块**：上传 920x680（可选）

### Step 5: 设置隐私
1. **数据收集**：选择"否"
2. **远程代码**：选择"否"
3. **隐私政策**：可选（如果有网站）

### Step 6: 设置分发
1. **可见性**：选择"公开"
2. **地区**：选择"所有地区"

### Step 7: 提交审核
1. 点击"提交审核"
2. 等待审核（通常1-3个工作日）
3. 审核通过后自动发布

---

## ⚠️ 常见问题

### Q1: 截图必须是什么尺寸？
A: 推荐 1280x800，最小 640x400

### Q2: 可以使用中文描述吗？
A: 可以，但建议主要使用英文，因为Chrome Web Store是全球市场

### Q3: 更新日志在哪里填写？
A: 在上传新版本ZIP文件后，会有一个"更新日志"字段

### Q4: 审核需要多久？
A: 通常1-3个工作日，首次发布可能需要更长时间

### Q5: 如何添加中文支持？
A: 在 manifest.json 中添加 default_locale，并创建 _locales 文件夹

---

## 📊 发布后优化

### 1. 监控数据
- 每周检查 Chrome Web Store Developer Dashboard
- 关注安装量、评分、评论

### 2. 回复评论
- 及时回复用户评论
- 感谢正面评价
- 解决负面反馈

### 3. 定期更新
- 每月至少更新一次
- 在更新日志中使用关键词
- 修复bug，添加新功能

### 4. 推广
- 在社交媒体分享
- 在Product Hunt发布
- 在Reddit相关社区分享

---

## 🎯 SEO优化检查

- [x] 标题包含核心关键词
- [x] 摘要前132字符包含关键词
- [x] 详细说明包含30+关键词
- [x] FAQ部分增加关键词密度
- [ ] 截图添加描述性标题
- [ ] 定期更新版本
- [ ] 积极回复用户评论

---

## 📞 需要帮助？

如果在发布过程中遇到问题：
1. 查看 Chrome Web Store 开发者文档
2. 访问 Chrome Web Store 开发者论坛
3. 联系 Chrome Web Store 支持团队

---

祝发布顺利！🎉

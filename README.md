# @zerorigin-studio/dsh-deepseek-chat

> DeepSeek Harness 网页对话入口插件 —— 在侧边栏"新对话"按钮正下方显示一个"网页对话"按钮，点击打开 [chat.deepseek.com](https://chat.deepseek.com/)。

![dsh](https://img.shields.io/badge/dsh-plugin-web-4D6BFE) ![version](https://img.shields.io/badge/version-0.3.3-4D6BFE) ![license](https://img.shields.io/badge/license-MIT-green)

## ✨ 特性

- **位置自然**：按钮位于侧边栏**新对话按钮正下方**，宽度/高度/悬停动效与 harness 原生控件完全一致，展开态显示「网页对话」，收起态为 36px 图标（响应即时，无轮询延迟）
- **桌面独立窗口**：在 [dsh-desktop](https://gitee.com/coldcgh/dsh-desktop)（Wails v3 启动器）下运行时，点击按钮通过本地桥接 API（`127.0.0.1` 随机端口 + 每实例随机 token）让启动器打开**独立聊天子窗口**——主窗口（harness 页面）不再被导航霸占，可同时多任务
- **Web 环境降级**：纯浏览器 / 第三方桌面壳（无 `window.__DSH_DESKTOP_API__` 桥接）时自动降级为原行为（当前 webview 内跳转），插件功能永不失效
- **持久化开关**：设置页可开关入口（`dsh-deepseek-chat.showEntry`，默认开）

## 📦 安装

```bash
# 方式一：npm 官方安装（推荐）
dsh plugin --profile web add @zerorigin-studio/dsh-deepseek-chat

# 方式二：Gitee Release tgz（无 npm registry 时）
# https://gitee.com/coldcgh/dsh-deepseek-chat/releases/download/0.3.3/zerorigin-studio-dsh-deepseek-chat-0.3.3.tgz
curl -L -o dsh-deepseek-chat.tgz https://gitee.com/coldcgh/dsh-deepseek-chat/releases/download/0.3.3/zerorigin-studio-dsh-deepseek-chat-0.3.3.tgz
dsh plugin --profile web add ./dsh-deepseek-chat.tgz

# 方式三：从源码构建安装（开发测试）
cd dsh-deepseek-chat && npm pack
dsh plugin --profile web add ./zerorigin-studio-dsh-deepseek-chat-0.3.3.tgz
```

重启 harness 后，侧边栏"新对话"按钮正下方出现「网页对话」按钮。

## 🖥️ 桌面多窗口（标准 SDK，可选增强）

dsh-desktop-shell 客户端（≥0.2.9）向托管页面注入**标准桌面 SDK** `window.dsh.desktop`：

```js
await window.dsh.desktop.openWindow({ url: CHAT_URL, title: "DeepSeek 网页对话" });
```

- 底层走 WebView2 宿主消息（`window.chrome.webview.postMessage` → `{ type: "dsh.desktop.openWindow", ... }`），无跨端口 fetch/CORS；
- 无宿主（纯 web / 第三方壳）：自动降级为当前 webview 内导航，插件永不失效；
- 兼容旧桥接：宿主仍注入 `window.__DSH_DESKTOP_API__`（HTTP 桥接，loopback + token），老协议路径继续可用。

## 📁 结构

```
lib/index.js     server 端：settings 注册（showEntry 开关，ctx 由宿主注入）
lib/client.js    client 端：侧边栏入口按钮 + 布局/降级逻辑（编译产物）
cordis.patch.yml bundle patch：把插件加入 web roster
```

> 当前分发编译产物；源文件（tsx）与构建脚本在后续版本补齐（tsdown 构建）。

## 🔧 开发

```bash
npm pack          # 构建本地 tgz
dsh plugin --profile web add ./zerorigin-studio-dsh-deepseek-chat-0.3.3.tgz
```

## 📝 License

MIT © caoganghui

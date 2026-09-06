# Changelog

## 0.3.4 (2026-09-07)

- **纯 web / 官方浏览器模式改为新标签页**：网页对话入口锚点增加 `target="_blank"` + `rel="noopener noreferrer"`。在无桌面桥接的官方浏览器模式下，点击按钮打开 chat.deepseek.com 的**新标签页**（不再把当前 harness 页面整页跳转走）。桌面多窗口（`window.dsh.desktop.openWindow`）路径不变；无宿主时永不失效的硬约束保持不变。

## 0.3.3 (2026-09-03)

- **接入标准桌面 SDK**：网页对话入口改为调用桌面客户端注入的「window.dsh.desktop.openWindow({ url, title })」标准入口（底层走 WebView2 宿主消息，无跨端口 fetch/CORS）。无宿主时回退为纯 webview 内导航，不失效。
  - 升级到 dsh-desktop-shell 客户端（配合其标准多窗口接入入口使用）。

## 0.3.2 (2026-09-02)

- **npm 探测支持**：补齐 `package.json` 的 `repository` 字段指向 `zerorigin-studio/dsh-deepseek-chat`，使 awesome-dsh-plugin / dsh-market 的 npm-probe 能正确映射为 registry 安装（`dsh plugin add @zerorigin-studio/dsh-deepseek-chat`），而非 GitHub 安装。code/行为不变。

## 0.3.1 (2026-09-02)

- **scope 迁移**：包名 `@coldcgh/dsh-deepseek-chat` → `@zerorigin-studio/dsh-deepseek-chat`（发布至 zerorigin-studio org）；内部 module id / bundle patch 同步更新。code/行为不变。

## 0.3.0 (2026-08-19)

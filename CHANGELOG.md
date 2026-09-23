# Changelog

## 0.3.5 (2026-09-22)

- **适配 dsh 0.1.7：修复插件在新运行树上整个客户端半不激活**（插件 → 0.3.5）。
  - 现象：升级到 dsh 0.1.7-alpha.1 后 web 启动报 `Failed to load plugins / web boot: 1 entry did not activate`，
    并指明 `@zerorigin-studio/dsh-deepseek-chat: pending (waiting for service: settingsScope)`。
  - 根因：0.1.7 把浏览器侧设置服务从 `settingsScope` 换成 `configForms`
    （官方 `dsh-client-ui-settings` 删掉了 `SettingsScopeBinder`，改注册 `configForms`，
    底层走 `remote.settings`）。插件顶层 `inject` 写着 `settingsScope`，依赖永不满足 →
    cordis 把整个客户端半挂成 pending。**受影响的不只是「显示入口」设置项，侧边栏的「网页对话」按钮本身也会消失**。
  - 修法：顶层 `inject` 只保留两版都有的 `slots`，两个设置服务各起一个 `ctx.inject([...])` 子插件
    做「二选一」等待——依赖就绪的那个分支才启动，另一个保持 pending 且不影响插件激活。
    两代控制器 API（`getSnapshot/subscribe/set`）本就同构，`ChatEntryPolicy` 无需改动。
- **适配 dsh 0.1.7：host 侧 `settings.register()` 已被移除**（插件 → 0.3.5）。
  - 0.1.7 的 `SettingsForms` 删掉了 `register()`（类名也从 `SettingsProvider` 换掉），
    改为插件顶层 `export const Config` 由框架投影成设置表单。
  - 修法：新增顶层 `Config` 导出（`showEntry` 字段），并按能力探测分流——
    有 `settings.register` 走 0.1.6 老路（命名空间 `dsh-chat-entry` 不变，**用户已存数据不受影响**），
    没有则交由 `Config` 投影，不再手工登记。
- **注意：本插件的 `Schema` 是 vendored 副本，没有 `volatile()` 方法**（插件 → 0.3.5）。
  - 0.1.7 要求设置字段带 volatile 标记才会进设置页。官方 schemastery 3.18.3+ 提供 `volatile()`，
    而本插件内置的 `Schema` 只有更底层的 `extra()`——`volatile()` 本身就是 `extra("volatile", true)` 的封装。
  - 修法：两级能力回退——优先 `field.volatile()`，缺失则 `field.extra("volatile", true)`，
    都没有就原样返回（不致命）。实测两版运行树下 `meta.volatile` 均为 `true`。
- **验证**（插件 → 0.3.5）：
  - 客户端半 mock：顶层 `inject` 不含 `settingsScope`/`configForms`；0.1.7 场景只启动 `configForms` 分支、
    0.1.6 场景只启动 `settingsScope` 分支，两边都正确注册 `sidebar.footer.action` 与 `settings.general.item` 两个槽位。
  - host 半 mock：0.1.6 场景走 `register()`、0.1.7 场景跳过登记且不抛错；`Config.dict.showEntry.meta.volatile === true`。
  - 端到端：真实 profile 分别在 0.1.6-alpha.2 与 0.1.7-alpha.1 运行树下启动，两版都就绪、无 pending 告警、无 import 失败。
- 兼容性：**0.1.6 与 0.1.7 双版本同时可用**，无需按版本分发两份插件。

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

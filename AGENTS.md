# AGENTS.md — dsh-deepseek-chat

`@coldcgh/dsh-deepseek-chat`：DeepSeek Harness（dsh）的 **web 平台对话入口插件**。在侧边栏「新对话」按钮正下方渲染一个「网页对话」按钮，点击后在 **dsh 插件生态**约定的形态里打开 chat.deepseek.com。

## 是什么 / 不是什么

- **是**：一个标准 dsh 插件（client platform `web`），只做「入口 + 路由」两件事。
- **不是**：chat.deepseek.com 的替代品、不是下载器、不内嵌业务逻辑。改动不得把业务逻辑塞进本插件。

## 工程结构

```
lib/index.js      server 端：注册持久化设置（settings 命名空间 dsh-chat-entry——持久化键，showEntry 默认 true）
lib/client.js     client 端：侧边栏入口按钮 + 展开/收起动画 + 桌面桥接降级逻辑（编译产物）
cordis.patch.yml  bundle patch：把插件 id 放入 web roster
```

- 当前**分发编译产物**（lib/*.js），无 src 与构建脚本；源码（tsx）与 tsdown 构建在后续版本补齐。
- 面向 dsh 生态：`dsh plugin --profile web add <pkg|tgz>` 安装，重启 harness 生效。

## 设置

- 命名空间 `dsh-chat-entry`，字段 `showEntry`（`Schema.boolean().default(true)`，`applies: "live"` 即时生效）。
- 命名空间 `dsh-chat-entry` 是**持久化设置键**（用户已存数据），与目录名 dsh-deepseek-chat 不同——**不要**随目录改名而改键。
- server 端 `apply(ctx)` 仅做 `ctx.inject(["settings"])` 注册设置；入口策略/UI 全在 client 端。
- 无宿主（纯 web 进程内）时设置保持进程内局部，默认可见。

## 桌面桥接协议（可选增强，勿破坏降级）

dsh-desktop / 桌面壳注入 `window.__DSH_DESKTOP_API__ = "http://127.0.0.1:<port>/<token>"`：

1. 点击按钮 → `fetch(api + "/window/chat", { method: "POST", keepalive: true })`，让启动器打开**独立聊天子窗口**；
2. **无桥接**（纯 web）：保持当前 webview 内导航（降级）；
3. **桥接失败**（启动器已退出）：回退到同一导航。

任何改动必须保证 2、3 降级路径一直可用——插件在纯浏览器环境**永不失效**是硬约束。

## 交互规则

- 按钮外观/动效与 harness 原生侧边栏控件一致（宽度/高度/悬停、展开淡入、收起 rail 同步滑入，与「新对话」按钮逐帧同步）。
- 展开态显示「网页对话」，收起态为 36px 图标；响应即时，**禁止轮询**。
- 改动前先在真实 harness 实测动画时序；历史教训见 CHANGELOG.md（0.2.x 系列均为动画/闪烁/位置修复）。

## 构建 / 安装 / 测试

```bash
npm pack                                    # 产出 coldcgh-dsh-deepseek-chat-<v>.tgz
dsh plugin --profile web add ./coldcgh-dsh-deepseek-chat-<v>.tgz   # 安装后重启 harness
```

- 改完 bump `package.json` version 并更新 CHANGELOG.md。
- 手动快速迭代：直接替换 `~/.dsh/profiles/web/node_modules/@coldcgh/dsh-deepseek-chat/lib/*` 后重启 harness。
- **提交纪律**：不向 deepseek-harness/ 官方仓库提交任何东西（见根 AGENTS.md 铁律）。

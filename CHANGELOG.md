# Changelog

## 0.3.2 (2026-09-02)

- **npm 探测支持**：补齐 `package.json` 的 `repository` 字段指向 `zerorigin-studio/dsh-deepseek-chat`，使 awesome-dsh-plugin / dsh-market 的 npm-probe 能正确映射为 registry 安装（`dsh plugin add @zerorigin-studio/dsh-deepseek-chat`），而非 GitHub 安装。code/行为不变。

## 0.3.1 (2026-09-02)

- **scope 迁移**：包名 `@coldcgh/dsh-deepseek-chat` → `@zerorigin-studio/dsh-deepseek-chat`（发布至 zerorigin-studio org）；内部 module id / bundle patch 同步更新。code/行为不变。

## 0.3.0 (2026-08-19)

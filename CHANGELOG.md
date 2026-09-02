# Changelog

## 0.3.1 (2026-09-02)

- **scope 迁移**：包名 `@coldcgh/dsh-deepseek-chat` → `@zerorigin-studio/dsh-deepseek-chat`（发布至 zerorigin-studio org）；内部 module id / bundle patch 同步更新。code/行为不变。

## 0.3.0 (2026-08-19)

- **Fix（真实 harness 实测）**：**展开时网页对话与「新对话」按钮行为完全一致**——不再有 wide-in 淡入（那个淡入看起来像「PPT 从上方加载出来」）；展开时入口**就位即现、全程 opacity=1**，随侧边栏布局下移，与新对话按钮完全同步
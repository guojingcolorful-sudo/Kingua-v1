# Lingua AIOS

极具未来科技感的脉冲式无痛沉浸英语学习破译中枢（赛博版）——基于 Google AI Studio 构建的 AI 英语学习应用：麦克风输入 + Gemini 服务端能力 + 脉冲式沉浸交互。

在 AI Studio 中查看/编辑：[ai.studio/apps/0b80d204-baa8-4f74-9a36-dea4da8dede8](https://ai.studio/apps/0b80d204-baa8-4f74-9a36-dea4da8dede8)

## 能力

- 麦克风实时输入（需要浏览器授予麦克风权限）
- Gemini 服务端 API 驱动（`MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`）
- 脉冲式沉浸交互视觉

## 快速开始

```bash
npm install
npm run dev
```

## 配置

在 AI Studio 的 Secrets 面板中配置 `GEMINI_API_KEY`（运行时自动注入，见 `.env.example` 字段说明）。部署后应用通过 Cloud Run 服务地址访问。

## 结构

```
src/            前端源码
server.ts       服务端（Gemini API 调用）
assets/         静态资源
metadata.json   AI Studio 应用元数据
```

## 隐私

- 服务端持有 Gemini API 密钥，客户端不接触密钥
- 麦克风内容仅用于当次 AI 交互，不做本地留存

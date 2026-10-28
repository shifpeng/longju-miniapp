# 西引力.陇聚 · 微信小程序

原生微信小程序 + TypeScript，独立依赖与构建。接口前缀 `/api/v1/app`，成员资格、权限、人数与签到状态以服务端为准。开发与交接入口：[docs/START-HERE.md](docs/START-HERE.md)。

```sh
npm ci
npm run dev
```

在微信开发者工具导入本仓库目录，`project.config.json` 指向构建产物 `dist/`。当前已配置正式 AppID；真实登录仍需后端使用同一 AppID，AppSecret 只配置在后端。

- `npm run check`：类型检查、构建和行为测试。
- `npm run check:native`：调用本机微信开发者工具 WXML/WXSS 编译器。
- `npm run smoke:api`：对本机后端执行匿名只读冒烟检查。
- `npm run build`：生成可导入开发者工具的代码包，不发布、不上传。
- `npm run build:release`：提审构建，锁定正式API地址并检查本地发布配置与包体；不上传。提审检查记录见 [docs/RELEASE-CHECK-2026-10-28.md](docs/RELEASE-CHECK-2026-10-28.md)。

服务地址与加入须知配置在 `src/config/runtime.ts`。默认连接 `https://admin.datrixtech.com`；本机开发可用 `LONGJU_API_ORIGIN=http://127.0.0.1:8081 npm run dev` 覆盖地址，提审构建拒绝该覆盖。加入须知未发布时可提交申请；已发布的个人信息保护指引仍须单独阅读确认，版本与API保持一致，不把设计示例当作真实协议。

[已确认的 Figma 设计](https://www.figma.com/design/dXJ5cqGqcDS4AozgWve5qv) · [UI与素材入口](docs/UI-REFERENCE.md)

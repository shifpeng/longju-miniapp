# 西引力.陇聚 · 微信小程序

原生微信小程序 + TypeScript，独立依赖与构建。接口前缀 `/api/v1/app`，成员资格、权限、人数与签到状态以服务端为准。开发与交接入口：[docs/START-HERE.md](docs/START-HERE.md)。

```sh
npm ci
npm run dev
```

在微信开发者工具导入本仓库目录，`project.config.json` 指向构建产物 `dist/`。当前 AppID 为游客模式；真实登录需使用与后端一致的小程序 AppID，AppSecret 只配置在后端。

- `npm run check`：类型检查、构建和行为测试。
- `npm run check:native`：调用本机微信开发者工具 WXML/WXSS 编译器。
- `npm run smoke:api`：对本机后端执行匿名只读冒烟检查。
- `npm run build`：生成可导入开发者工具的代码包，不发布、不上传。

服务地址与正式协议配置在 `src/config/runtime.ts`。默认连接 `http://127.0.0.1:8080`，只供开发；生产环境拒绝 HTTP。正式协议尚未提供时禁止提交申请，不把设计示例当作真实协议。

[已确认的 Figma 设计](https://www.figma.com/design/dXJ5cqGqcDS4AozgWve5qv) · [UI与素材入口](docs/UI-REFERENCE.md)

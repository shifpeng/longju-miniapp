# 微信小程序 · 开发协作约定

原生微信小程序 + TypeScript，成员端接口前缀 `/api/v1/app`。

## 当前项目与约束

- 品牌「西引力.陇聚」，对外称「老乡社群」，一期不做商城、商品、支付或退款，不加占位入口。
- 当前三个独立仓库为 longju-miniapp / longju-admin / longju-api，父目录只负责组织。保持独立依赖与构建，不改成 workspace/monorepo，不通过跨仓库相对路径导入源码。
- 先读本仓库 `docs/START-HERE.md`、`docs/UI-REFERENCE.md`，再读相应需求/契约。不要要求用户重新解释已保存的产品或技术方案。
- 本次交接时没有应用实现。收到用户新的“开始开发/继续开发”任务后直接执行该任务；文档中历史的“等待决定”不能变成反复请求批准的理由。只要求保存资料时不自行启动业务编码。
- 其他仓库允许读取契约；默认只修改当前仓库，尊重其他会话的未提交改动。跨仓修改应属于用户当前明确授权的任务范围。
- 技术规范唯一维护源为 longju-api/docs，未来机器可读契约为 longju-api/contracts/openapi.yaml。前端 docs/baseline 是本次交接快照，发现接口差异先对照后端当前契约，明确记录变更，不自行创造另一套协议。
- 新需求以用户最新明确指令为准；本次已确认的 community-phase-one/admin-requirements/activity-recap 优于早期视觉提案。最新 UI 入口由 UI-REFERENCE 指明，历史 PDF、生成脚本的旧说明和旧 .fig 备份不能覆盖新稿。
- 设计原型中的成员、电话、统计、上传/扫码/导出、登录都是演示；不将原型 HTML/场景对象当生产应用，不把设计检查当真实接口或微信联调通过。
- 密钥不进入 Git、日志或前端包。保持服务端鉴权、字段裁剪、草稿隔离、并发版本和幂等约束；具体规则按架构，不简化为前端隐藏按钮。
- 原 Figma 已有设计与连线。一般编码任务按稿实现，不自动运行生成脚本重建/覆盖 Figma，不自动发布、创建云资源、配置远程或推送代码。
- 修改完成后执行与变更相关的真实检查，准确区分已验证与未验证，并更新 docs/START-HERE.md 的交接进度、启动命令、接口版本和剩余工作。

## 本仓库重点

重点读取 baseline/community-phase-one.md、baseline/ui-design-brief.md、baseline/api-contracts.md 的成员端接口，以及 baseline/activity-recap.md。保持微信导航安全区、底部安全区和320/390/430px可读性。

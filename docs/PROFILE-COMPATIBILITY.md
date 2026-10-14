# 本人资料编辑的微信兼容性

当前 OpenAPI 0.1.57 仅提供 PATCH /api/v1/app/me/profile；已安装的官方 miniprogram-api-typings 中 wx.request 的 method 不含 PATCH。小程序不强制类型转换、不使用未经后端支持的 X-HTTP-Method-Override。

建议后端兼容补丁（待跨仓授权，尚未应用）：

1. AppMeController.updateProfile 保留原逻辑，将 @PatchMapping("/profile") 改为 @RequestMapping(value = "/profile", method = {RequestMethod.PATCH, RequestMethod.PUT})。
2. SecurityConfiguration 为 PUT /api/v1/app/me/profile 增加与 PATCH 相同的 authenticated 规则。
3. OpenAPI 增加 PUT 同路径，复用 UpdateMyProfileInput、If-Match、原响应及授权约束；原 PATCH 保留兼容。
4. 增加 PUT 匿名拒绝、本人更新、版本缺失/冲突测试，按后端本仓要求完成验证。
5. 前端同步新版契约，改用 PUT。提交字段仍为完整表单，不允许更新电话或资格。

当前小程序资料页可读取本人资料和隐私状态；保存明确返回兼容性提示，不能记为真实联调通过。

依据：[微信官方 API TypeScript 定义仓库](https://github.com/wechat-miniprogram/api-typings)。本机安装版本为 5.2.3；兼容结论目前基于官方方法枚举，未在真机尝试非官方 PATCH 扩展。

# 一期关键接口契约

2026-10-28增量（当前机器可读契约0.1.72）：申请姓名/简介、成员资料修改及反馈正文须通过服务端微信文本安全检测。检测不通过返回400 FIELD_VALIDATION_FAILED，检测不可用返回503且不写入；成功同键同内容请求保留幂等重放。图片检测接入前仅允许保留/移除当前头像，禁止关联新头像。无请求字段改名，详细行为见longju-api/docs/CONTENT-SECURITY.md；src/api/schema.d.ts及来源哈希已同步。

版本：2026-09-22，语言无关的开发契约。本文已确定跨端字段、状态、并发及错误行为；用户授权编码后将其转为后端独立仓库中的 `longju-api/contracts/openapi.yaml` 并由构建校验，当前不建立应用工程。两个前端仓库按明确的契约发布版本使用和验证接口，后端为契约唯一维护源。

## 1. 通用协议

路径缩写：`A = /api/v1/app`，`M = /api/v1/admin`，`G = /api/v1/media`。表中 `A/...`、`M/...` 表示对应完整前缀，路径 ID 均为字符串。请求 JSON 使用 camelCase、UTF-8；响应绝不使用 Java 实体直接序列化。

成功：`{data, requestId, serverTime}`，其中 serverTime 是 UTC RFC 3339 时间。错误：`{error:{code,message,retryable,fieldErrors?,currentVersion?},requestId,serverTime}`。字段错误是 `{field,code,message}` 数组。冲突不附带越权的当前对象内容，前端重新 GET 当前资源。

列表统一 `page` 从 1 起、`pageSize` 默认 20、仅允许 20/50，返回 `{items,page,pageSize,total}`；排序字段白名单并增加 id 作为稳定并列排序。名录最大 20 条/页。请求查询长度上限 100，日期为明确边界，起点含、终点不含。大量导出不通过列表分页接口拼接。

普通 GET 返回 ETag，例如 `"7"`；修改现有资源使用 `If-Match: "7"`，对应资源或草稿当前 version。没有该头的受保护变更返回 428；不匹配返回 409 VERSION_CONFLICT。列表筛选参数、ID、owner、人数、角色均不能由前端自行转化成最终授权。

关键创建/提交接口使用 `Idempotency-Key`（UUID），具体见各组。重放时 `Idempotency-Replayed: true`，成功数据中带 `replayed:true`；客户端重读受影响资源，不以重放结果覆盖较新的本地状态。同键异参返回 IDEMPOTENCY_MISMATCH。登录、获取短时凭据等不缓存秘密响应，失败可用新凭据重试。

### 基本 HTTP 状态

| HTTP | code 示例 | 客户端行为 |
| --- | --- | --- |
| 400 | INVALID_ARGUMENT、INVALID_IDEMPOTENCY_KEY | 修正参数；不自动无限重试 |
| 401 | AUTH_REQUIRED、SESSION_EXPIRED、SESSION_REVOKED | 重新登录，保留可安全恢复的当前输入 |
| 403 | ACTION_FORBIDDEN、MEMBERSHIP_REQUIRED、REAUTH_REQUIRED | 显示对应资格/权限或重新验证提示 |
| 404 | RESOURCE_UNAVAILABLE | 对象不存在、已撤下或超出对象范围统一处理 |
| 409 | VERSION_CONFLICT、STATE_CONFLICT、ALREADY_REGISTERED、CAPACITY_EXCEEDED、IDEMPOTENCY_MISMATCH | 按错误重新获取数据；保留输入 |
| 410 | TOKEN_EXPIRED、EXPORT_EXPIRED | 刷新短时码或重新生成文件 |
| 422 | FIELD_VALIDATION_FAILED、SIGNUP_NOT_OPEN、SIGNUP_CLOSED、CANCEL_CLOSED、WRONG_ACTIVITY、CHECKIN_NOT_OPEN、CHECKIN_CLOSED、REGISTRATION_CANCELLED、MEDIA_NOT_READY | 展示具体业务原因；禁止只显示“系统错误” |
| 428 | VERSION_REQUIRED | 获取资源版本后重新确认 |
| 429 | RATE_LIMITED | 遵循 Retry-After，保留当前表单 |
| 503 | TEMPORARILY_UNAVAILABLE、TRANSACTION_RETRY | 有限退避重试写操作时沿用幂等键 |

合法但已重复签到的请求返回 200 和 ALREADY_CHECKED_IN 的业务结果；不以 500 表示重复。网络错误、存储错误和内部异常不向客户端返回堆栈或 SQL。

## 2. 登录与个人状态

| 接口 | 请求 | 主要响应/规则 |
| --- | --- | --- |
| POST `A/auth/wechat` | `{code}` | `{accessToken,expiresAt,user,qualification}`；后端换取微信身份，不能提交 openid 充当登录 |
| POST `A/auth/logout` | 空 | 撤销当前令牌；重复退出可成功 |
| GET `A/me` | Bearer | `{userId,accountStatus,qualification,applicationSummary,profile,allowedActions}`；本人资料可读，内部备注不可读 |
| PUT `A/me/profile` | ProfileInput、If-Match | 当前资料与 version；资格不能由此修改；仅已审核并有档案用户编辑 |
| PUT `A/me/profile` | `{name,hometownCode,residenceCode,industryCode,introduction,avatarAssetId,directoryVisible}`、If-Match | 更新本人资料和名录资料展示设置；联系电话不接受公开设置，名录接口不返回电话 |
| POST `A/me/membership-exit` | `{confirmed:true}`、If-Match、幂等键 | LEFT；展示既有报名保留的结果与后续操作 |
| POST `A/me/closure` | `{confirmationCode,confirmed:true}`、幂等键 | 202 `{state:"CLOSING"}`；confirmationCode 为新获取的微信 code，换取身份必须与当前账号相同 |
| GET `A/home` | 可匿名 | 有效公告、近期活动、资格/申请摘要；匿名无私有字段 |
| GET `A/members`、GET `A/members/{id}` | 已通过且 ACTIVE 资格 | 分页名录/成员详情，按目标公开设置裁剪 |

`ProfileInput`：name（1–40 字）、phone（大陆手机号，规范化 +86，手填）、hometownCode、residenceCode、industryCode、introduction（≤300）、helpText（≤500）、avatarAssetId（可空且必须为本人 READY 头像）。`phoneSource`、`phoneVerifiedAt`、资格与管理员字段均不可写。修改本人资料不改历史申请或报名快照。

## 3. 加入申请与后台审核

| 接口 | 请求 | 主要响应/规则 |
| --- | --- | --- |
| GET `A/me/application` | 本人 | `{id,status,attemptNo,revisionNo,version,submittedProfile,publicReview,allowedActions}`；无申请返回 data=null |
| POST `A/me/application/submissions` | `ApplicationInput`、幂等键；重提时 If-Match | 首次 201，重提 200；新修订进入 PENDING，返回最新聚合 |
| GET `M/applications` | 状态、姓名关键词、家乡/区域、时间、分页 | 对当前提交修订做范围过滤，phoneMasked |
| GET `M/applications/{id}` | 授权管理员 | 当前修订、资料补充历史、审核历史、内部备注与 version；不默认返回完整电话 |
| POST `M/applications/{id}/reviews` | `{revisionId,decision,publicReason?}`、If-Match、幂等键 | decision 为 APPROVE / RETURN / REJECT；后两种必填原因；返回申请与资格状态 |
| POST `M/applications/{id}/phone-access` | `{purpose}` | 完整电话、审计编号；另需成员电话权限与申请读取权限 |
| PUT `M/applications/{id}/internal-note` | `{text}`、备注 If-Match | 独立备注版本，不改申请资料/审核状态 |
| GET `M/members`、GET `M/members/{id}` | 授权范围 | 成员档案、资格历史、标签、内部备注；脱敏电话 |
| PUT `M/members/{id}/management-note` | `{text,tagIds}`、备注 If-Match | 管理数据更新，不改成员公开资料 |
| POST `M/members/{id}/qualification` | `{action:"DISABLE"或"RESTORE",reason}`、If-Match、幂等键 | 返回新资格；不自动取消报名 |
| POST `M/members/{id}/phone-access` | `{purpose}` | 另需成员电话权限；在范围内且有审核/成员管理业务用途 |

`ApplicationInput`：`{profile:{name,phone,hometownCode,residenceCode,industryCode,introduction?},agreementVersion,accepted:true}`。协议版本必须为当前服务端发布版本，变更时提示重新阅读。退回重提保存新快照；版本过期不能覆盖其他提交。审核原因上限 500 字，内部备注上限 2,000 字。

`ApplicationSummary.status`：PENDING / NEEDS_INFO / APPROVED / REJECTED。成员资格：NONE / ACTIVE / DISABLED / LEFT。前端首页不得只凭 APPROVED 就认定现在仍有资格；以 qualification 为准。

## 4. 活动发布与报名

| 接口 | 请求 | 主要响应/规则 |
| --- | --- | --- |
| GET `A/activities`、GET `A/activities/{id}` | 可匿名，按可见范围返回 | `ActivityView`；本人有效报名摘要按会话附加 |
| GET `M/activities`、GET `M/activities/{id}` | 授权管理员 | 线上字段、计数、草稿摘要、版本；范围内查询 |
| POST `M/activities` | 初始草稿字段、幂等键 | 201 `{id,version,draftVersion}`；新建不发布，同事务自分配活动 |
| GET/PUT `M/activities/{id}/draft` | PUT 为 ActivityDraftInput、草稿 If-Match | 返回 `{draft,version,baseActivityVersion}`；允许不完整草稿，已填值仍须类型合法 |
| POST `M/activities/{id}/publish-preview` | `{draftVersion}` | 验证完整草稿，返回变更摘要与 `changeHash`；无线上副作用 |
| POST `M/activities/{id}/publish` | `{draftVersion,changeHash}`、线上 If-Match、幂等键 | 重验草稿、报名约束及摘要后发布；预览不锁定名额 |
| POST `M/activities/{id}/cancel` | `{reason,confirmed:true}`、If-Match、幂等键 | 活动取消、有效报名 EVENT_CANCELLED；返回当前统计 |
| POST `A/activities/{id}/registrations` | `{companionCount,contact:{name,phone},expectedGeneration}`、幂等键 | 首次 201；重报返回 200 与新 generation；expect 首次为 0，重报为刚读取的上一代值 |
| GET `A/me/registrations`、GET `A/me/registrations/{id}` | 本人 | 本人报名、活动、签到状态与允许操作 |
| POST `A/me/registrations/{id}/cancel` | `{confirmed:true}`、If-Match、幂等键 | CANCELLED；返回最新统计与报名版本 |
| GET `M/activities/{id}/registrations` | 状态、姓名关键词、分页 | 所选活动报名摘要，独立返回 totalRegistrations/totalParticipants/checkedInParticipants |
| GET `M/activities/{id}/registrations/{registrationId}` | 授权管理员 | 当前报名、generation、version、联系人脱敏、历史和签到 |
| POST `M/activities/{id}/registrations/{registrationId}/cancel` | `{reason,confirmed:true}`、报名 If-Match、幂等键 | 与普通取消同样截止规则；不提供隐藏的强制取消开关 |
| POST `M/activities/{id}/registrations/{registrationId}/phone-access` | `{purpose}` | 完整电话，要求该活动报名摘要权限与电话权限 |

`ActivityDraftInput`：title（1–60）、summary（≤120）、coverAssetId、intro（受限富文本，纯文本≤20,000字）、place（1–200）、ownerAdminId、visibility（PUBLIC / MEMBERS）、startAt/endAt、signupOpenAt/signupCloseAt、cancelCloseAt、capacity（正整数）、companionLimit（0–2）。基线报名资格固定 ACTIVE_MEMBER，不接受前端传入更宽资格。checkinOpenAt/checkinCloseAt 由既定规则计算，只读返回。

`ActivityView`：上述已发布字段 + publicationState、lifecycle、signupWindow、isFull、capacity、occupiedCount、remainingCount、validRegistrationCount、checkedInParticipants、serverTime、version、myRegistration（可空）、allowedActions。所有人数来自服务端；未登录时不虚构 myRegistration。

`RegistrationView`：id、activityId、generation、status、companionCount、participantCount、registeredAt、checkin（可空）、version、allowedActions。手机号仅本人详情和独立授权接口可见。`expectedGeneration` 防止旧业务意图在幂等记录到期后误重报；参与人数永远由服务端算 1 + companionCount。

## 5. 签到

| 接口 | 请求 | 主要响应/规则 |
| --- | --- | --- |
| POST `A/me/registrations/{id}/checkin-token` | 本人有效报名 | `{token,expiresAt,refreshAfter,activityId,registrationId,generation}`；生成 120 秒随机码，60 秒后可刷新；不缓存完整凭证 |
| POST `M/activities/{id}/checkin-preview` | `{token}` | `{registrationId,generation,registrationVersion,name,participantCount,phoneMasked,result}`；只核验，不写签到 |
| POST `M/activities/{id}/checkins` | `{token,registrationId,generation,confirmed:true}`、报名 If-Match、幂等键 | `{result:"CHECKED_IN"或"ALREADY_CHECKED_IN",checkin:{id,participantCount,checkedAt,operatorDisplayName}}` |
| POST `M/activities/{id}/manual-checkins` | `{registrationId,generation,verificationMethod,reason,confirmed:true}`、报名 If-Match、幂等键 | 相同签到结果；要求 `checkin.manual`；姓名不能代替唯一报名ID |

每次刷新立即撤销尚未使用的旧码，二维码只放固定协议标识与随机 token，不放姓名、电话或可推算的身份凭据。预览结果过期或报名版本变化时提示重扫，不能继续确认旧截图。

错误优先保证不泄露越权对象：先检查当前管理员对选定活动的权限，再解析凭证并比较所属活动。已知凭证在正确活动、同一 generation 且已经签到时返回已有结果；未签到时检查撤销/有效期/报名与活动状态/窗口。活动已取消后不再接受新签到，可向有权人员显示已有历史结果。匿名或越权用户不能用错误差异查询他人报名。

扫码枪输入和摄像头解码调用同一 preview/confirm 接口。摄像头请求只发生在用户主动打开扫码后；失败保留按权限人工补签入口。

## 6. 公告、回顾与媒体

| 接口 | 请求 | 主要响应/规则 |
| --- | --- | --- |
| GET `A/announcements`、GET `A/announcements/{id}` | 可匿名，分别按首页/详情规则过滤 | 仅当前已发布快照；到期与撤下区别见数据模型 |
| GET/POST `M/announcements` | GET 查询；POST 新建空草稿+幂等键 | 列表或新聚合 ID，空草稿不对成员公开 |
| GET/PUT `M/announcements/{id}/draft` | PUT：AnnouncementDraftInput、草稿 If-Match | 草稿、draftVersion、baseVersion，保存不改线上 |
| POST `M/announcements/{id}/preview` | `{draftVersion}` | 同一草稿的首页标题与详情预览，仅当前授权管理员可见 |
| POST `M/announcements/{id}/publish` | `{draftVersion}`、聚合 If-Match、幂等键 | 新 publishedVersionId 与 version |
| POST `M/announcements/{id}/withdraw` | `{confirmed:true}`、If-Match、幂等键 | 撤下结果，内容和历史仍保留 |
| GET `A/activities/{id}/recap` | 与活动可见范围一致 | `{state:"PREPARING"}` 或 `{state:"PUBLISHED",version,title,body,cover,photos,photoCount}` |
| GET `M/recaps` | 活动范围、回顾状态、分页 | 跨活动回顾待办列表；包含未整理的已结束活动 |
| GET/PUT `M/activities/{id}/recap/draft` | PUT：RecapDraftInput、草稿 If-Match | 首次 GET 可返回 version=0；首次 PUT 用 If-Match 0 创建唯一草稿 |
| POST `M/activities/{id}/recap/preview` | `{draftVersion}` | 草稿详情与图片顺序，仅管理员可见 |
| POST `M/activities/{id}/recap/publish` | `{draftVersion}`、聚合 If-Match、幂等键 | 必须已结束、未取消，所有引用 READY；切换整个版本 |
| POST `M/activities/{id}/recap/withdraw` | `{confirmed:true}`、If-Match、幂等键 | 成员端回到 PREPARING，保留报名和签到 |
| POST `M/media/uploads` | `{purpose,contextType,contextId,fileName,sizeBytes,contentType}`、幂等键 | `{assetId,status}`；再调用 credential 获取上传指令，创建响应不包含短时秘密 |
| POST `M/media/{id}/upload-credential` | 所属草稿与权限校验 | 未完成资产的短期上传凭据；不允许替换 READY 文件 |
| POST `M/media/{id}/complete`、POST `M/media/{id}/retry` | 幂等键 | 202，进入校验/处理；不直接置 READY |
| GET `M/media/{id}` | 当前管理员有相应上下文权限 | 状态、进度阶段、可重试错误码、尺寸；不暴露存储密钥 |
| POST `A/media/access-tickets`、POST `M/media/access-tickets` | `{contextType,contextId,version,items:[{assetId,variant}]}` | 有权图片的网关链接与 expiresAt，最多 30 项 |
| GET `G/assets/{id}/{variant}?ticket=...` | 短时票据 | 图片字节，逐次检查当前主体和上下文，不跳转到桶 |

头像上传使用 A 前缀的相同 uploads/credential/complete/status 接口，用途固定 AVATAR、所有者取会话，不能借此上传到活动上下文；其大小限制与权限按文件方案。草稿移除照片通过保存新的完整有序 photos 列表完成，不提供能直接删线上图片的通用 DELETE。

`AnnouncementDraftInput`：title（1–40）、body（纯文本≤20,000字且非空）、visibility、displayStart、displayEnd（可空，非空必须晚于开始）、sortOrder（0–9999）。

`RecapDraftInput`：title（≤60，可空）、body（纯文本≤20,000字，可空）、visibility、coverAssetId（可空）、photos（有序数组，最多30，元素 `{assetId,caption}`，caption≤200）。无标题时显示原活动名称；至少正文或有效照片之一非空才可发布。无照片必须 coverAssetId=null；有照片未选封面时取第一张。服务器检查重复照片 ID、范围不可扩大、媒体所有权及处理状态。

## 7. 反馈、权限与导出

| 接口 | 请求 | 主要响应/规则 |
| --- | --- | --- |
| POST `A/feedback` | `{type,body,relatedType?,relatedId?,contactConsent}`、幂等键 | 201；类型 SUGGESTION / ISSUE / REPORT，正文1–2000字，关联对象先校验可访问 |
| GET `A/me/feedback`、GET `A/me/feedback/{id}` | 本人 | 公开回复与状态，不含内部备注和举报处理细节 |
| GET `M/feedback`、GET `M/feedback/{id}` | 当前数据范围 | 反馈及内部处理记录；活动反馈按活动范围，其他反馈按提交人的当前成员区域，无法归属区域的只给 GLOBAL 反馈管理者 |
| POST `M/feedback/{id}/phone-access` | `{purpose}` | 需反馈处理权、对应联系人电话权及 contactConsent；无联系授权不返回电话 |
| POST `M/feedback/{id}/claim` | If-Match、幂等键 | PROCESSING，记录认领者 |
| POST `M/feedback/{id}/resolve` | `{status,publicReply,internalNote,confirmed:true}`、If-Match、幂等键 | RESOLVED / CLOSED，公共回复与内部说明分开 |
| GET `M/dashboard` | 当前管理员 | 授权范围内指标与待办；部分失败明示状态，不把失败写为0 |
| GET/POST `M/admins` | POST `{loginName,roleBindings,extraGrants}`、幂等键、近期验证 | 新账号 INVITED，返回一次性激活交接材料；不自动替本人激活 |
| GET `M/admins/{id}` | 管理权限 | 角色、范围、状态、version；不返回 TOTP 密钥或密码摘要 |
| PUT `M/admins/{id}/authorization` | `{roleBindings,extraGrants}`、If-Match、幂等键、近期验证 | 校验授权边界/最后超级管理员，更新 auth_epoch 与撤销会话 |
| POST `M/admins/{id}/disable` | `{reason,confirmed:true}`、If-Match、幂等键 | 停用，不删除历史 |
| POST `M/exports/preview` | `{type,activityId?,filters,fields,includeFullPhone,purpose?}` | 允许字段、范围说明、预计条数；不创建任务 |
| POST `M/exports` | 同预览参数、幂等键 | 202 `{id,status:"QUEUED"}`；完整电话需近期验证 |
| GET `M/exports`、GET `M/exports/{id}` | 本人的有权任务 | 状态、实际条数、snapshotAt、expiresAt、失败码，无存储键 |
| POST `M/exports/{id}/retry` | 幂等键 | 202，重验权限后同任务新 attempt |
| GET `M/exports/{id}/file` | Cookie；逐次当前授权 | XLSX 字节流；响应不使用 JSON 信封 |
| GET `M/audit-logs` | 操作者/对象/时间/动作/结果、分页 | 脱敏审计结果 |

角色绑定结构为 `{roleCode,scopes:[{domain,type,rules?或activityIds?}]}`；附加授权为 `{permissionCode,scope}`。服务端只接受白名单业务域/动作与规范化范围，不允许任意表达式。反馈 claim/resolve 也检查对象范围与版本，多个管理员不能互相覆盖公开回复。

## 8. 后台认证接口

| 接口 | 请求/主要响应 |
| --- | --- |
| GET `M/auth/csrf` | 建立匿名预会话，返回 csrfToken；所有 Cookie 写接口校验头 `X-CSRF-Token` 和同源 Origin |
| POST `M/auth/login` | `{loginName,password}`；需第二因素时只建立待验证挑战并返回 `nextStep:TOTP`，否则签发完整会话 |
| POST `M/auth/totp` | `{code}`；校验当前挑战，成功替换会话，返回当前权限摘要 |
| POST `M/auth/activate` | `{activationToken,password}`；激活过程中根据权限要求绑定并验证 TOTP，完成前不得 ACTIVE |
| POST `M/auth/totp/enrollment`、POST `M/auth/totp/enrollment-confirm` | 当前激活/重新验证状态下生成一次性绑定材料并确认动态码；绑定成功提供一次性恢复码 |
| POST `M/auth/recovery` | `{loginName,password,recoveryCode}`；成功仅允许重绑第二因素并撤销旧会话，新绑定确认后原子替换旧密钥，不能直接访问管理数据 |
| POST `M/auth/reauthenticate` | 当前会话 + 密码，已启用 TOTP 时还需动态码；更新近期验证时间 |
| GET `M/auth/me` | 管理员、角色、范围、需第二因素状态、会话到期时间；服务端事实来源 |
| POST `M/auth/logout` | 撤销 Cookie 对应会话并清 Cookie |

有权超级管理员可通过 `POST M/admins/{id}/credential-reset` 创建单次恢复激活流程，要求本人近期第二因素、目标 If-Match、原因和幂等键；不能读取或指定目标原密码。最后一位超级管理员不能通过该普通入口被重置为无有效管理员状态，需走 [部署恢复流程](identity-and-delivery.md)。

## 9. 契约验收

实现阶段由 OpenAPI Schema 校验类型/枚举/必填与实际响应；用两套范围账号验证同一接口，加入并发版本、同键重试/异参、请求超时后重试、任意 ID 替换和富文本清洗场景。页面契约映射已覆盖工作台、申请、名录、活动、报名、签到、公告、回顾、反馈、权限、导出与日志，静态帮助和组织介绍先随应用配置发布。

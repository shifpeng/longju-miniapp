export interface paths {
  '/api/v1/admin/activities/{id}/recap/draft/photos/{assetId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 管理员读取已保存草稿照片
     * @description 仅管理员Cookie会话可读；每次校验当前账号、会话绝对及空闲有效期、recap.read活动范围、草稿版本、照片归属与READY状态。不要求回顾已发布或未撤下，不返回COS地址，不供成员端访问。响应禁止缓存。
     */
    get: operations['getAdminRecapDraftPhoto'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/home/summary': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 首页成员与相聚摘要
     * @description 一次请求返回本人资料、资格状态；仅当前ACTIVE成员读取最近有效报名及（无近期报名时）已发布首页照片名单。媒体票据仍单独签发，返回不缓存。
     */
    get: operations['getAppHomeSummary'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/home/next-gathering': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 当前成员最近一场有效报名
     * @description 只查询当前主体的ACTIVE报名及已发布、未取消、尚未结束活动，按开始时间和报名ID升序取一条；无结果data为null。
     */
    get: operations['getAppNextGathering'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/home/carousel': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 读取成员首页往期活动轮播
     * @description 仅ACTIVE账号及成员可读。返回当前已发布、未撤下、已结束且未取消活动回顾中标记homeFeatured的READY照片；按活动结束时间倒序、活动ID倒序、相册顺序排列，最多30张。沿用活动与回顾可见范围交集。使用ACTIVITY_RECAP及recapVersion申请DISPLAY票据，不直接暴露存储地址。
     */
    get: operations['getHomeCarousel'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/auth/wechat': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 微信身份换取系统会话
     * @description 仅接收wx.login code；服务端交换openid并签发7天随机会话。来源地址默认每15分钟最多30次登录尝试，429携带Retry-After。超时需重新获取code。携带失效Authorization时返回401，不降级匿名；重新登录前应清除旧令牌。登录不授予成员资格。
     */
    post: operations['wechatLogin'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/auth/logout': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 撤销当前小程序会话
     * @description 只撤销指定USER令牌摘要。重复退出、已过期/撤销/不存在的规范令牌均成功；无令牌也成功。格式错误或重复Authorization头仍返回401。
     */
    post: operations['appLogout'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/dictionaries/regions': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 查询省级或指定上级区划
     * @description 不传parentCode时返回省级选项；传入区划编码时返回其直接下级。只读字典无需登录。
     */
    get: operations['listRegions'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/dictionaries/industries': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 查询启用的行业门类
     * @description 只返回启用项；只读字典无需登录。
     */
    get: operations['listIndustries'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/me': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 当前身份、资格和申请摘要
     * @description 读取会话本人的当前资格、档案和申请摘要。无档案/申请返回对应null字段；qualification不从历史审核结论推断。此聚合无单一ETag，profile.version与applicationSummary.version各自独立。
     */
    get: operations['getMe'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/me/application': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 读取本人当前申请
     * @description 只读取本人当前轮次的提交快照和该修订的公开审核结论。无申请返回data=null且无ETag；有申请时ETag为申请聚合version。错误修订归属或电话解密不可用返回503，不返回部分个人资料。
     */
    get: operations['getMyApplication'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/me/profile': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    /**
     * 更新本人公开资料与名录隐私
     * @description 仅当前ACTIVE成员可编辑姓名、区划、行业、介绍和可见设置。电话不能通过此接口修改；公开电话需同时开启名录可见。If-Match必须为GET /me返回的profile.version。
     */
    patch: operations['updateMyProfile'];
    trace?: never;
  };
  '/api/v1/app/me/membership-exit': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 本人退出老乡社群
     * @description 以当前成员资料版本及幂等键将资格转为LEFT；账号、报名及签到历史保留，退出后可按规则重新申请。
     */
    post: operations['leaveMembership'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/me/closure': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 申请注销本人账号
     * @description 需新获取的微信登录code确认当前身份并明确确认。先将AES-GCM加密的注销tombstone写入数据库备份边界之外的COS；密文绑定账号ID、原始创建时间与受理时间，避免恢复后自增ID复用影响新账号。随后在事务中立即冻结账号、递增认证与隐私代次、撤销全部会话及签到码并创建持久任务；COS不可用时失败关闭，数据库事务中断时启动重放和周期对账会恢复任务。同一幂等键重试回放已接受的结果，冲突键返回409。worker按活动锁顺序每批最多取消50个未结束且未签到的报名，释放名额；之后擦除申请快照、电话/身份/档案、反馈自由文本并保留脱敏活动历史，最后置CLOSED。需先应用V16以允许历史电话快照清空。任务租约60秒，失败以退避方式持续重试。
     */
    post: operations['requestAccountClosure'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/me/application/submissions': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 首次申请、补充资料或退出后重新申请
     * @description 首次申请、NEEDS_INFO补充资料或LEFT后重新申请。首次返回201；后两者需当前If-Match并返回200。服务端校验协议版本、电话重复及区划/行业字典。
     */
    post: operations['submitApplication'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/applications': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 按当前提交快照范围查询待审核申请
     * @description 按当前提交快照服务端范围查询待审核申请，返回掩码电话；支持姓名关键词与20/50分页。
     */
    get: operations['listApplications'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/applications/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 按当前授权范围读取申请提交快照
     * @description 返回当前修订的申请资料与公开审核结果，电话始终脱敏；资料修订及审核记录通过history子资源读取。
     */
    get: operations['getAdminApplication'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/applications/{id}/history': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 查询申请资料修订和审核历史
     * @description 需要当前application.read范围；按最新修订优先分页返回不可变申请快照及公开审核结论，电话始终脱敏。
     */
    get: operations['getAdminApplicationHistory'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/applications/{id}/internal-note': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 查询申请内部备注
     * @description 需要application.read与application.review当前范围交集；仅后台可见，独立加密和版本控制，响应不缓存。
     */
    get: operations['getAdminApplicationInternalNote'];
    /**
     * 更新申请内部备注
     * @description 需要application.read与application.review当前范围交集。使用独立If-Match版本加密保存；审计不记录备注正文。
     */
    put: operations['updateAdminApplicationInternalNote'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/applications/{id}/phone-access': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 逐次读取申请当前修订电话
     * @description 需当前application.read数据范围，填写用途并记录审计；不缓存完整号码。
     */
    post: operations['revealApplicationPhone'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/applications/{id}/reviews': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 审核当前申请修订
     * @description 锁定security_guard、用户/资格和申请后重验权限、范围及版本。审核、资格、历史、审计同事务。
     */
    post: operations['reviewApplication'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/members': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 查询当前管理员成员读取范围内的成员档案
     * @description 需要member.read；数据库在计数和分页前应用当前权限的GLOBAL或MEMBER_REGION范围。支持姓名关键词和资格筛选，电话始终脱敏。
     */
    get: operations['listAdminMembers'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/members/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 读取当前管理员成员范围内的档案详情
     * @description 需要member.read；资格和本人区域按当前档案读取，越权对象与不存在统一返回404。电话只返回phoneMasked。
     */
    get: operations['getAdminMember'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/members/{id}/phone-access': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 逐次读取成员档案电话
     * @description 需当前member.read数据范围，填写用途并记录审计；不缓存完整号码。
     */
    post: operations['revealMemberPhone'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/members/{id}/qualification': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 调整成员资格状态
     * @description 需要member.read与member.manage_qualification范围交集。LEFT为终态；变更要求原因、If-Match档案版本和幂等键，并写入成员历史及审计。
     */
    post: operations['changeAdminMemberQualification'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/members/{id}/qualification-history': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 查询成员资格变更历史
     * @description 需要member.read当前范围；返回资格前后状态、原因和操作主体，已注销或越权成员统一视为不存在。
     */
    get: operations['getAdminMemberQualificationHistory'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/members/{id}/management-note': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 读取成员内部备注和标签
     * @description 要求member.read与member.update_note当前范围交集。备注仅后台可见，服务端解密后返回；响应不缓存。
     */
    get: operations['getMemberManagementNote'];
    /**
     * 更新成员内部备注和标签
     * @description 要求member.read与member.update_note当前范围交集。备注以独立版本加密存储；标签集合整体替换，审计不记录备注内容。
     */
    put: operations['updateMemberManagementNote'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/feedback': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 提交建议、问题或举报
     * @description 需要有效小程序会话。关联对象必须在当前主体范围内可访问；响应和审计不包含内部处理备注。
     */
    post: operations['submitAppFeedback'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/feedback': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 按当前反馈授权范围查询反馈
     * @description 活动反馈按FEEDBACK活动范围过滤；其他反馈按提交人的当前成员区域过滤；无法归属区域的仅GLOBAL范围可读。先过滤后统计和分页。
     */
    get: operations['listAdminFeedback'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/feedback/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 读取授权范围内的反馈详情 */
    get: operations['getAdminFeedback'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/feedback/{id}/claim': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 认领待处理反馈
     * @description 需要feedback.read与feedback.process范围交集；仅OPEN反馈可认领，认领后固定当前处理人。
     */
    post: operations['claimAdminFeedback'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/feedback/{id}/resolve': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 保存反馈结论
     * @description 仅当前认领人可处理；内部备注独立加密，对外回复与处理历史不包含内部备注。
     */
    post: operations['resolveAdminFeedback'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/feedback/{id}/phone-access': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 逐次读取反馈提交人电话
     * @description 需feedback.read与feedback.process范围交集、member.read与member.phone.reveal范围交集、提交时contactConsent=true，并填写用途。完整号码不缓存且每次记审计。
     */
    post: operations['revealFeedbackContactPhone'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/me/feedback': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 查询本人反馈记录 */
    get: operations['listMyFeedback'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/me/feedback/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 查询本人反馈详情 */
    get: operations['getMyFeedback'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/announcements': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 查询首页当前有效公告
     * @description 匿名用户可见PUBLIC公告；ACTIVE成员可见PUBLIC及MEMBERS公告。列表只包含已开始且未到期的当前发布快照，按sortOrder和开始时间排序。
     */
    get: operations['listAppAnnouncements'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/announcements/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 读取当前公告详情
     * @description 返回当前发布快照。公告到期后退出首页，但详情仍可读；撤下或成员无权访问时统一返回404。
     */
    get: operations['getAppAnnouncement'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/activities': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 查询当前可见的已发布活动
     * @description 匿名用户可见PUBLIC活动；ACTIVE成员可见PUBLIC及MEMBERS活动；其他资格的登录用户仍可见其本人历史报名所关联的活动。返回报名人数和签到人数均由服务端计算，可选按活动生命周期筛选。
     */
    get: operations['listAppActivities'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/activities/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 读取活动详情与本人报名状态
     * @description 可匿名读取PUBLIC活动；MEMBERS活动需要ACTIVE资格，但本人已报名的历史活动在其资格变化后仍可查看。过期会话不会降级匿名。
     */
    get: operations['getAppActivity'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/activities/{id}/recap': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 读取当前可见活动的已发布回顾
     * @description 先按活动当前可见范围校验，再读取未撤下的发布快照；无可见发布版本时返回PREPARING。回顾快照的可见范围不能扩大活动范围。
     */
    get: operations['getAppActivityRecap'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/media/access-tickets': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 为已发布活动封面或回顾照片申请短时访问链接
     * @description 需要小程序Bearer会话。ACTIVITY_RECAP项必须属于请求指定的当前已发布回顾版本；ACTIVITY项必须是当前已发布活动封面。链接有效5分钟，下载时重新检查会话、账号、会员资格和发布状态。
     */
    post: operations['createAppMediaAccessTickets'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/media/access-tickets': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 为授权活动封面或回顾照片申请短时访问链接
     * @description 回顾照片需要当前管理员recap.read活动范围；活动封面需要activity.read活动范围。链接有效5分钟，下载时重新检查管理员会话、范围、活动发布状态及版本。
     */
    post: operations['createAdminMediaAccessTickets'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/media/assets/{id}/{variant}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 读取上下文授权的预处理图片
     * @description 通过短时票据校验会话、账号、当前发布版本、数据范围与媒体关联后返回图片，不重定向或共享HTTP缓存。THUMBNAIL对可处理的大JPEG/PNG按需生成最长边800px、至多180KiB的JPEG，服务端限量缓存字节但每次读取仍鉴权；小图、WebP或处理失败回退原图。DISPLAY保持原图读取，适用于相册大图。票据查询参数必须从代理访问日志中脱敏。
     */
    get: operations['readPrivateMediaAsset'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/activities/{id}/registrations': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 报名活动
     * @description 需要当前有效的小程序会话和ACTIVE_MEMBER资格。锁定活动后校验发布状态、报名窗口、同行上限和名额；本人及同行人数在同一事务占位，联系人电话按报名generation加密保存，重复请求使用幂等键安全重放。
     */
    post: operations['createAppActivityRegistration'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/me/registrations': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 查询本人活动报名
     * @description 需要当前小程序会话。仅返回当前主体的报名及签到摘要，状态筛选可选；联系人电话不在此接口返回。
     */
    get: operations['listMyActivityRegistrations'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/me/registrations/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 查询本人活动报名详情
     * @description 仅按报名ID和当前主体读取，其他主体的ID统一返回未找到；包含当前generation签到摘要，不返回联系人电话。
     */
    get: operations['getMyActivityRegistration'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/me/registrations/{id}/cancel': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 取消本人活动报名
     * @description 需要当前小程序会话。活动取消截止时间前，按报名If-Match版本释放本人及同行名额；已签到或活动已取消时不能个人取消。幂等记录与报名历史在同一事务写入。
     */
    post: operations['cancelMyActivityRegistration'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/me/registrations/{id}/checkin-token': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 签发本人报名签到码
     * @description 仅本人有效报名可在活动开始前30分钟至结束前申请；每次签发撤销该轮次旧码。数据库仅保存SHA-256摘要，原始随机码有效120秒并禁止缓存。
     */
    post: operations['createMyRegistrationCheckinToken'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/members': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 仅ACTIVE成员访问可见名录
     * @description 仅当前ACTIVE成员访问名录；数据库先过滤资格ACTIVE、账号ACTIVE和directoryVisible=true的成员，再计数和分页。电话字段仅在目标成员phoneVisible=true时返回。
     */
    get: operations['listMembers'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/members/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 实时资格、可见性和电话字段裁剪
     * @description 仅当前ACTIVE成员可读取仍然ACTIVE且directoryVisible=true的目标成员。不可见或不存在统一返回404；电话仅在目标成员phoneVisible=true时返回。
     */
    get: operations['getMember'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/auth/csrf': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 创建匿名预会话并取得CSRF Token
     * @description 创建绑定数据库的预会话并返回CSRF Token。登录后保留现有正式会话绑定；再次调用会更换预会话，因此进行中的挑战需要重新发起。响应禁止缓存。
     */
    get: operations['getCsrf'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/auth/login': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 管理员密码验证
     * @description 管理员密码通过后直接签发后台会话。正式Cookie使用__Host-longju_admin，Secure/HttpOnly/SameSite=Lax/Path=/。
     */
    post: operations['adminLogin'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/auth/activate': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 设置强密码并激活管理员
     * @description 激活凭证由POST提交；仅支持INITIAL/INVITATION。成功后激活账号并直接签发后台会话。
     */
    post: operations['activateAdmin'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/auth/recover': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 使用一次性凭证重设管理员密码
     * @description 凭证由另一位具备全局管理员管理权限的超级管理员签发，30分钟有效且只能使用一次。成功后撤销目标账号全部会话，不自动登录；请求必须通过配置的HTTPS Origin及浏览器CSRF校验。
     */
    post: operations['recoverAdminPassword'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/admins': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 分页查询管理员账号目录
     * @description 需要实时有效的全局admin.manage权限；返回账号状态、预置角色、权限范围摘要和最近成功登录时间。响应不缓存。角色和范围明细仍需后续管理接口实现。
     */
    get: operations['listAdminAccounts'];
    put?: never;
    /**
     * 创建待激活管理员账号
     * @description 需要实时有效的全局admin.manage权限。只接受三个预置角色和该角色权限域的一组已存在范围集；SUPER_ADMIN必须所有域均为GLOBAL，MEMBERSHIP/FEEDBACK可使用有有效规则的MEMBER_REGION，当前其他非GLOBAL范围尚不支持。邀请凭证仅在此响应返回一次，有效24小时，由管理员线下交接给受邀者。
     */
    post: operations['inviteAdminAccount'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/admins/{id}/disable': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 停用管理员账号
     * @description 需要实时有效的全局admin.manage权限及CSRF/同源校验。必须携带账号列表中的If-Match版本；不能停用自己或最后一位有效超级管理员。更新状态、递增auth_epoch、撤销所有会话并写审计在同一事务完成。
     */
    post: operations['disableAdminAccount'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/admins/{id}/access': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    /**
     * 调整管理员预置角色和数据范围
     * @description 需要实时有效的全局admin.manage权限及CSRF/同源校验。If-Match必须匹配账号列表版本。不能修改自己的权限，也不能移除最后一位有效超级管理员；权限绑定、auth_epoch/version、会话撤销、审计和安全栅栏在同一事务提交。只允许已存在且属于指定业务域的范围集。MEMBERSHIP/FEEDBACK支持带有效区域规则的MEMBER_REGION；当前其他域只支持GLOBAL。
     */
    put: operations['updateAdminAccess'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/recaps': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 查询跨活动回顾待办
     * @description 需要recap.read活动范围；仅列已发布、已结束且未取消的活动，范围在数据库分页前过滤。
     */
    get: operations['listAdminRecapTasks'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/audit-logs': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 查询全局脱敏操作日志
     * @description 需要当前有效管理员的全局audit.read范围。时间范围左闭右开；只返回ADMIN操作记录与预先脱敏的safeSummary。
     */
    get: operations['listAdminAuditLogs'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/dashboard': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 查询授权范围内工作台
     * @description 各指标分别使用成员、申请、活动、反馈和回顾服务的当前授权范围。sections的status区分AVAILABLE、FORBIDDEN和UNAVAILABLE；失败数据不伪装为零。
     */
    get: operations['getAdminDashboard'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/announcements': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 查询公告管理目录
     * @description 需要announcement.read全局权限，返回草稿与当前发布版本摘要。
     */
    get: operations['listAdminAnnouncements'];
    put?: never;
    /**
     * 创建空公告草稿
     * @description 需要announcement.edit全局权限。要求Idempotency-Key，重试返回同一公告ID。
     */
    post: operations['createAdminAnnouncement'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/announcements/{id}/draft': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 读取公告服务器草稿 */
    get: operations['getAdminAnnouncementDraft'];
    /** 完整替换公告草稿 */
    put: operations['updateAdminAnnouncementDraft'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/announcements/{id}/preview': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 预览指定公告草稿 */
    post: operations['previewAdminAnnouncement'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/announcements/{id}/publish': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 发布指定公告草稿版本 */
    post: operations['publishAdminAnnouncement'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/announcements/{id}/withdraw': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 撤下当前公告 */
    post: operations['withdrawAdminAnnouncement'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/activities': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 按范围查询管理活动
     * @description 需要当前有效的activity.read权限；数据库先按GLOBAL或ACTIVITY_SET范围过滤，再分页返回线上状态、占用人数和草稿摘要。
     */
    get: operations['listAdminActivities'];
    put?: never;
    /**
     * 创建活动草稿
     * @description 需要当前管理员的activity.create权限和CSRF/同源校验。创建草稿、创建仅包含该活动的ACTIVITY_SET范围、授予创建者该活动的读取/编辑/发布/取消权限及审计在一个事务内完成；新增权限会撤销创建者旧会话，客户端需重新登录。创建支持Idempotency-Key。
     */
    post: operations['createAdminActivityDraft'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/activities/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 读取管理活动详情
     * @description 需要当前有效的activity.read权限和活动范围；返回线上活动、名额和草稿摘要，完整草稿由独立端点读取。
     */
    get: operations['getAdminActivity'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/activities/{id}/recap/preview': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 预览回顾文字草稿
     * @description 需要recap.publish当前活动范围；仅已结束且未取消活动可预览，响应不写入线上版本。
     */
    post: operations['previewAdminActivityRecap'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/activities/{id}/recap/publish': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 发布活动回顾
     * @description 需要recap.publish当前范围、If-Match聚合版本、草稿版本和幂等键。须已结束且未取消；图片须是当前管理员上传到该活动且已处理为READY的媒体。事务内建立不可变文字/照片快照、切换指针并记录审计。
     */
    post: operations['publishAdminActivityRecap'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/activities/{id}/recap/withdraw': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 撤下活动回顾
     * @description 需要recap.publish当前范围、If-Match聚合版本、确认和幂等键；保留所有历史发布版本和草稿。
     */
    post: operations['withdrawAdminActivityRecap'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/activities/{id}/recap/draft': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 读取活动回顾草稿
     * @description 需要recap.read当前活动范围；活动必须已结束且未取消。没有草稿时返回draftVersion 0。
     */
    get: operations['getAdminActivityRecapDraft'];
    /**
     * 创建或保存活动回顾草稿
     * @description 需要recap.edit当前活动范围及If-Match草稿版本；首次保存使用版本0。活动必须已结束且未取消。照片列表整体替换，最多30项，只能引用当前管理员上传到该活动的资产。COS PUT成功后前端即可保存草稿；保存草稿时服务端校验对象元数据并登记资产，无需客户端逐张调用complete或轮询处理状态。
     */
    put: operations['updateAdminActivityRecapDraft'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/activities/{id}/draft': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 读取活动草稿
     * @description 需要当前有效的activity.read权限和该活动GLOBAL或ACTIVITY_SET范围；草稿响应不缓存。
     */
    get: operations['getAdminActivityDraft'];
    /**
     * 完整替换活动草稿
     * @description 需要当前有效的activity.edit权限和该活动范围；If-Match为草稿版本，保存不影响已发布内容。
     */
    put: operations['updateAdminActivityDraft'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/activities/{id}/publish': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 发布活动草稿
     * @description 需要当前有效的activity.publish权限和活动范围。事务内重验活动/草稿版本与changeHash、人数上限及时间规则，更新线上字段、变更记录、审计和幂等结果；相同幂等键重放原响应。
     */
    post: operations['publishAdminActivity'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/activities/{id}/cancel': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 取消已发布活动
     * @description 需要当前有效的activity.cancel活动范围。按活动If-Match版本锁定并校验后，同一事务记录取消原因、将ACTIVE报名转为EVENT_CANCELLED、归还全部名额、保存报名历史、审计与幂等响应；已取消或未发布活动不能重复取消。
     */
    post: operations['cancelAdminActivity'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/activities/{id}/publish-preview': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 预览活动发布校验
     * @description 需要当前有效的activity.publish权限和活动范围。检查草稿必填字段与时间顺序，不修改线上内容；响应changeHash绑定活动版本、草稿版本及全部草稿字段，草稿变化后必须重新预览。
     */
    post: operations['previewAdminActivityPublish'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/activities/{id}/checkin-preview': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 扫码后预览报名签到信息
     * @description 需要当前checkin.scan活动范围。先校验管理员权限再解析活动绑定的签到码；只读返回脱敏报名摘要和READY、ALREADY_CHECKED_IN、TOKEN_EXPIRED或REGISTRATION_CLOSED结果，不写入签到。
     */
    post: operations['previewActivityCheckin'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/activities/{id}/checkins': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 确认核销活动报名签到
     * @description 需要当前checkin.scan活动范围；重新核验活动和报名、generation、If-Match版本及签到码状态。事务内消费凭证、唯一写入整份报名签到、成功审计及幂等响应；重放不重复计数。
     */
    post: operations['confirmActivityCheckin'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/activities/{id}/manual-checkins': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 授权人工补签活动报名
     * @description 需要独立的checkin.manual活动范围。按报名ID、generation和If-Match版本识别唯一报名；填写核对方式及原因后确认。允许签到开放后（含活动结束后）补记，不接受活动整体取消或无效报名。事务内写入签到、审计及幂等结果。
     */
    post: operations['manuallyCheckinActivityRegistration'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/activities/{activityId}/registrations': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 查询活动报名名单
     * @description 需要当前有效的registration.read活动范围。先验证活动权限，再按状态/联系人姓名筛选及分页；统计仅使用当前ACTIVE报名，电话只返回脱敏摘要。
     */
    get: operations['listAdminActivityRegistrations'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/activities/{activityId}/registrations/{registrationId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 查询活动报名详情和历史
     * @description 需要当前有效的registration.read活动范围。联系人电话默认脱敏；完整电话通过独立端点按当前读取范围逐次审计。
     */
    get: operations['getAdminActivityRegistration'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/activities/{activityId}/registrations/{registrationId}/phone-access': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 逐次读取当前活动报名电话
     * @description 需当前registration.read活动范围且报名仍有效，填写用途并记录审计。
     */
    post: operations['revealRegistrationPhone'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/activities/{activityId}/registrations/{registrationId}/cancel': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 管理员取消单条活动报名
     * @description 需要当前有效的registration.cancel活动范围。按报名If-Match版本检查报名状态、签到和活动取消截止时间；同一事务释放该报名及同行名额、写取消历史、审计与幂等结果，不提供绕过截止时间的强制取消选项。
     */
    post: operations['cancelAdminActivityRegistration'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/scopes': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 查询成员或反馈范围集
     * @description 需要实时有效的全局admin.manage权限。当前仅返回MEMBERSHIP和FEEDBACK域的GLOBAL与MEMBER_REGION范围，区域规则含服务端区划名称；范围集包含status和version，停用项仍可查询。
     */
    get: operations['listAdminScopes'];
    put?: never;
    /**
     * 创建成员区域范围集
     * @description 需要实时有效的全局admin.manage权限和CSRF/同源校验。只允许MEMBERSHIP或FEEDBACK；每条规则至少指定家乡或现居区划，同一规则内两维取交集，多规则取并集。所有区划代码必须存在于服务端字典。
     */
    post: operations['createAdminScope'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/scopes/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    /**
     * 替换成员区域范围集规则
     * @description 需要实时有效的全局admin.manage权限和CSRF/同源校验。If-Match为查询结果中的version；仅可修改MEMBERSHIP或FEEDBACK域的MEMBER_REGION范围。修改会递增版本并撤销所有分配此范围的管理员会话，管理员需重新登录。
     */
    put: operations['updateAdminScope'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/scopes/{id}/disable': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 停用未分配的范围集
     * @description 需要实时有效的全局admin.manage权限和CSRF/同源校验。If-Match为查询结果中的version；仍被任一管理员角色或附加权限引用的范围集不能停用。
     */
    post: operations['disableAdminScope'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/admins/{id}/password-reset': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 签发管理员一次性密码重置凭证
     * @description 仅另一位有效的SUPER_ADMIN且具备ADMINISTRATION全局admin.manage权限可签发。凭证只返回一次，禁止缓存；不能重置自己。
     */
    post: operations['issueAdminPasswordReset'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/actuator/health/liveness': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 存活探针 */
    get: operations['livenessProbe'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/actuator/health/readiness': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 就绪探针（含数据库） */
    get: operations['readinessProbe'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/auth/logout': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 退出后台并撤销当前会话
     * @description 校验同源及绑定当前Cookie的CSRF，撤销服务端会话并清理三个认证Cookie。
     */
    post: operations['adminLogout'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/me': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 查询当前管理员及实时权限范围
     * @description 实时校验账号状态、auth_epoch、8小时绝对期限和30分钟空闲期限。返回按权限动作绑定的范围标识，具体业务仍须服务端范围校验。
     */
    get: operations['getAdminMe'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/media/uploads': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 为当前成员预留头像图片
     * @description 仅允许本人MEMBER_PROFILE头像上下文，单张最大5MiB。仅支持JPEG/PNG/WebP；幂等创建资产但不返回存储凭证。
     */
    post: operations['createAppMediaUpload'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/media/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 读取媒体上传与处理状态
     * @description 仅读取本人上传的头像处理状态。响应不包含COS对象键、桶名和存储地址。
     */
    get: operations['getAppMediaStatus'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/media/{id}/upload-credential': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 获取单对象短时COS上传指令
     * @description 需要当前成员仍有有效资格且资产属于本人。PUT签名有效5分钟，并绑定服务端对象键、Content-Type、精确Content-Length及x-cos-forbid-overwrite=true。桶未启用版本控制且状态可确认时，上传后可立即确认；其他情况保留凭证过期保护。不得缓存或记录URL。
     */
    post: operations['createAppMediaUploadCredential'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/app/media/{id}/complete': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 确认COS上传对象并排队处理
     * @description 需要当前成员仍有有效资格且资产属于本人。桶未启用版本控制且已确认禁止覆盖的凭证可立即确认；其他凭证必须等到过期。服务端读取实际大小和对象Content-Type，校验匹配预约后转UPLOADED并在同一事务创建MEDIA_PROCESS任务。内容不匹配的资产置FAILED。
     */
    post: operations['completeAppMediaUpload'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/media/uploads': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 为活动封面或活动回顾预留一张图片
     * @description 活动封面需要activity.edit当前活动范围且最大5MiB；回顾照片需要recap.edit且最大10MiB。仅支持JPEG/PNG/WebP；幂等创建资产但不返回存储凭证。
     */
    post: operations['createAdminMediaUpload'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/media/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 读取媒体上传与处理状态
     * @description 需要当前管理员持有该回顾活动的recap.read或recap.edit范围。响应不包含COS对象键、桶名和存储地址。
     */
    get: operations['getAdminMediaStatus'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/media/{id}/upload-credential': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 获取单对象短时COS上传指令
     * @description 需要资产创建者仍有当前活动编辑范围。PUT签名有效5分钟，并绑定服务端对象键、Content-Type、精确Content-Length及x-cos-forbid-overwrite=true。桶未启用版本控制且状态可确认时，上传后可立即确认；其他情况保留凭证过期保护。不得缓存或记录URL。
     */
    post: operations['createAdminMediaUploadCredential'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/media/{id}/complete': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 确认COS上传对象并直接可用
     * @description 需要资产创建者仍有当前活动编辑范围。桶未启用版本控制且已确认禁止覆盖的凭证可立即确认；其他凭证必须等到过期。服务端确认对象已存储且大小和Content-Type匹配预约后，在同一事务登记ORIGINAL并直接转READY；不下载解码、不创建MEDIA_PROCESS任务，不记录图片尺寸。对象信息不匹配时置FAILED。
     */
    post: operations['completeAdminMediaUpload'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/exports/preview': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 按当前授权范围预览导出数量与字段 */
    post: operations['previewAdminExport'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/exports': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 分页读取本人创建的导出任务 */
    get: operations['listAdminExports'];
    put?: never;
    /**
     * 幂等创建异步导出任务
     * @description 匹配上限5万行；按读取与导出权限范围交集过滤。完整电话另需独立的电话读取与完整电话导出授权，并记录用途审计。生成文件存于私有COS，有效24小时。
     */
    post: operations['createAdminExport'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/exports/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 读取本人导出任务状态 */
    get: operations['getAdminExport'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/exports/{id}/retry': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 重试失败的导出任务 */
    post: operations['retryAdminExport'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/admin/exports/{id}/file': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 逐块重新授权后下载私有XLSX
     * @description 每次下载及每个流块都检查会话代次、当前权限范围与导出资源隐私代次；不发放可转发COS链接。
     */
    get: operations['downloadAdminExport'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    AppHomeSummaryResponse: {
      data: {
        me: components['schemas']['Me'];
        nextGathering: components['schemas']['NextGatheringView'] | null;
        carousel: components['schemas']['HomeCarouselPhoto'][];
      };
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    NextGatheringView: {
      id: components['schemas']['Id'];
      title: string;
      place: string;
      /** Format: date-time */
      startAt: string;
    };
    MediaAccessTicketInput: {
      /** @enum {string} */
      contextType: 'ACTIVITY_RECAP' | 'ACTIVITY' | 'MEMBER_PROFILE';
      contextId: components['schemas']['Id'];
      /** Format: int64 */
      version: number;
      items: {
        assetId: components['schemas']['Id'];
        /** @enum {string} */
        variant: 'THUMBNAIL' | 'DISPLAY';
      }[];
    };
    AdminMediaAccessTicketInput: {
      /** @enum {string} */
      contextType: 'ACTIVITY_RECAP' | 'ACTIVITY';
      contextId: components['schemas']['Id'];
      /** Format: int64 */
      version: number;
      items: {
        assetId: components['schemas']['Id'];
        /** @enum {string} */
        variant: 'THUMBNAIL' | 'DISPLAY';
      }[];
    };
    MediaAccessTicket: {
      assetId: components['schemas']['Id'];
      /** @enum {string} */
      variant: 'THUMBNAIL' | 'DISPLAY';
      /** Format: uri-reference */
      url: string;
    };
    MediaAccessTicketResult: {
      /** Format: date-time */
      expiresAt: string;
      items: components['schemas']['MediaAccessTicket'][];
    };
    MediaAccessTicketResponse: {
      data: components['schemas']['MediaAccessTicketResult'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    DictionaryOption: {
      code: string;
      name: string;
      /** @description 区划层级；行业字典为null。 */
      level?: number | null;
    };
    DictionaryResponse: {
      data: components['schemas']['DictionaryOption'][];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    UpdateMyProfileInput: {
      name: string;
      hometownCode: string;
      residenceCode: string;
      industryCode: string;
      introduction: string;
      avatarAssetId: components['schemas']['Id'] | null;
      directoryVisible: boolean;
      phoneVisible: boolean;
    };
    PrivateProfileResponse: {
      data: components['schemas']['PrivateProfile'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    /** @description 十进制字符串；禁止转换成 JavaScript Number。 */
    Id: string;
    /** Format: int64 */
    Version: number;
    /** @enum {string} */
    Qualification: 'NONE' | 'ACTIVE' | 'DISABLED' | 'LEFT';
    /** @enum {string} */
    ApplicationStatus: 'PENDING' | 'NEEDS_INFO' | 'APPROVED' | 'REJECTED';
    FieldError: {
      field: string;
      code: string;
      message: string;
    };
    ErrorResponse: {
      error: {
        code: string;
        message: string;
        retryable: boolean;
        fieldErrors?: components['schemas']['FieldError'][];
        /** Format: int64 */
        currentVersion?: number | null;
      };
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    ProfileInput: {
      name: string;
      phone: string;
      hometownCode: string;
      residenceCode: string;
      industryCode: string;
      introduction?: string;
    };
    ApplicationInput: {
      profile: components['schemas']['ProfileInput'];
      /** @description 服务端已配置时须传当前版本；未配置时省略或为空字符串。 */
      agreementVersion?: string;
      /** @description 服务端已配置正式协议版本时必须为true；未配置时省略或为false。 */
      accepted?: boolean;
    };
    SubmittedProfile: {
      name: string;
      phone: string;
      /** @enum {string} */
      phoneSource: 'MANUAL';
      phoneVerifiedAt: null;
      hometownCode: string;
      residenceCode: string;
      industryCode: string;
      introduction: string;
    };
    PublicReview: {
      /** @enum {string} */
      decision: 'APPROVE' | 'RETURN' | 'REJECT';
      publicReason: string | null;
      /** Format: date-time */
      reviewedAt: string;
    };
    ApplicationView: {
      id: components['schemas']['Id'];
      status: components['schemas']['ApplicationStatus'];
      attemptNo: number;
      revisionNo: number;
      version: components['schemas']['Version'];
      submittedProfile: components['schemas']['SubmittedProfile'];
      publicReview: components['schemas']['PublicReview'] | null;
      /** @description 已实现且当前可执行的operationId；无申请且qualification=NONE、NEEDS_INFO或LEFT+APPROVED时可submitApplication。 */
      allowedActions: string[];
    };
    ApplicationResult: {
      data: components['schemas']['ApplicationView'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    MyApplicationResponse: {
      data: components['schemas']['ApplicationView'] | null;
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    ApplicationSummary: {
      id: components['schemas']['Id'];
      status: components['schemas']['ApplicationStatus'];
      version: components['schemas']['Version'];
    };
    PrivateProfile: {
      name: string;
      phone: string;
      hometownCode: string;
      residenceCode: string;
      industryCode: string;
      introduction: string;
      avatarAssetId: components['schemas']['Id'] | null;
      helpText: string;
      directoryVisible: boolean;
      phoneVisible: boolean;
      version: components['schemas']['Version'];
    };
    Me: {
      userId: components['schemas']['Id'];
      /** @enum {string} */
      accountStatus: 'ACTIVE' | 'DISABLED' | 'CLOSING' | 'CLOSED';
      qualification: components['schemas']['Qualification'];
      applicationSummary: components['schemas']['ApplicationSummary'] | null;
      profile: components['schemas']['PrivateProfile'] | null;
      /** @description 已实现且当前可执行的operationId；无申请且qualification=NONE时可submitApplication；NEEDS_INFO或LEFT+APPROVED时可getMyApplication和submitApplication。 */
      allowedActions: string[];
    };
    MeResponse: {
      data: components['schemas']['Me'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    WechatLoginInput: {
      code: string;
    };
    LoginUser: {
      id: components['schemas']['Id'];
      /** @enum {string} */
      accountStatus: 'ACTIVE';
    };
    WechatLoginResult: {
      accessToken: string;
      /** Format: date-time */
      expiresAt: string;
      user: components['schemas']['LoginUser'];
      qualification: components['schemas']['Qualification'];
    };
    WechatLoginResponse: {
      data: components['schemas']['WechatLoginResult'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminApplicationItem: {
      id: components['schemas']['Id'];
      revisionId: components['schemas']['Id'];
      name: string;
      phoneMasked: string;
      hometownCode: string;
      residenceCode: string;
      industryCode: string;
      status: components['schemas']['ApplicationStatus'];
      /** Format: date-time */
      submittedAt: string;
      version: components['schemas']['Version'];
    };
    AdminApplicationPage: {
      items: components['schemas']['AdminApplicationItem'][];
      page: number;
      /** @enum {integer} */
      pageSize: 20 | 50;
      /** Format: int64 */
      total: number;
    };
    AdminApplicationPageResponse: {
      data: components['schemas']['AdminApplicationPage'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminApplicationDetail: {
      id: components['schemas']['Id'];
      revisionId: components['schemas']['Id'];
      attemptNo: number;
      revisionNo: number;
      status: components['schemas']['ApplicationStatus'];
      version: components['schemas']['Version'];
      /** Format: date-time */
      submittedAt: string;
      submittedProfile: {
        name: string;
        phoneMasked: string;
        hometownCode: string;
        residenceCode: string;
        industryCode: string;
        introduction: string;
      };
      publicReview?: null | {
        /** @enum {string} */
        decision: 'APPROVED' | 'NEEDS_INFO' | 'REJECTED';
        publicReason: string;
        /** Format: date-time */
        reviewedAt?: string | null;
      };
    };
    AdminApplicationDetailResponse: {
      data: components['schemas']['AdminApplicationDetail'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    ApplicationHistoryItem: {
      revisionId: components['schemas']['Id'];
      attemptNo: number;
      revisionNo: number;
      /** Format: date-time */
      submittedAt: string;
      submittedProfile: {
        name: string;
        phoneMasked: string;
        hometownCode: string;
        residenceCode: string;
        industryCode: string;
        introduction: string;
      };
      publicReview: null | {
        /** @enum {string} */
        decision: 'APPROVE' | 'RETURN' | 'REJECT';
        publicReason: string | null;
        reviewerId: components['schemas']['Id'];
        /** Format: date-time */
        reviewedAt: string;
      };
    };
    ApplicationHistory: {
      applicationId: components['schemas']['Id'];
      items: components['schemas']['ApplicationHistoryItem'][];
      page: number;
      /** @enum {integer} */
      pageSize: 20 | 50;
      /** Format: int64 */
      total: number;
    };
    ApplicationHistoryResponse: {
      data: components['schemas']['ApplicationHistory'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    ApplicationInternalNote: {
      applicationId: components['schemas']['Id'];
      text: string;
      version: components['schemas']['Version'];
    };
    ApplicationInternalNoteResponse: {
      data: components['schemas']['ApplicationInternalNote'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    ReviewInput: {
      revisionId: components['schemas']['Id'];
      /** @enum {string} */
      decision: 'APPROVE' | 'RETURN' | 'REJECT';
      publicReason?: string;
    } & unknown;
    ReviewResult: {
      applicationId: components['schemas']['Id'];
      status: components['schemas']['ApplicationStatus'];
      qualification: components['schemas']['Qualification'];
      version: components['schemas']['Version'];
      replayed?: boolean;
    };
    ReviewResponse: {
      data: components['schemas']['ReviewResult'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    SubmissionResult: {
      id: components['schemas']['Id'];
      status: components['schemas']['ApplicationStatus'];
      attemptNo: number;
      revisionNo: number;
      version: components['schemas']['Version'];
      submittedProfile: components['schemas']['SubmittedProfile'];
      publicReview: components['schemas']['PublicReview'] | null;
      allowedActions: string[];
      replayed: boolean;
    };
    SubmissionResponse: {
      data: components['schemas']['SubmissionResult'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminMemberView: {
      id: components['schemas']['Id'];
      /** @enum {string} */
      accountStatus: 'ACTIVE' | 'DISABLED' | 'CLOSING';
      /** @enum {string} */
      qualification: 'ACTIVE' | 'DISABLED' | 'LEFT';
      name: string;
      phoneMasked: string;
      hometownCode: string;
      residenceCode: string;
      industryCode: string;
      introduction: string;
      helpText: string;
      directoryVisible: boolean;
      phoneVisible: boolean;
      version: components['schemas']['Version'];
    };
    AdminMemberPage: {
      items: components['schemas']['AdminMemberView'][];
      page: number;
      /** @enum {integer} */
      pageSize: 20 | 50;
      /** Format: int64 */
      total: number;
    };
    AdminMemberPageResponse: {
      data: components['schemas']['AdminMemberPage'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminMemberResponse: {
      data: components['schemas']['AdminMemberView'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    MemberManagementTag: {
      /** Format: int64 */
      id: number;
      name: string;
      assigned: boolean;
    };
    MemberQualificationHistoryItem: {
      beforeQualification: components['schemas']['Qualification'];
      afterQualification: components['schemas']['Qualification'];
      reason: string;
      /** @enum {string} */
      actorType: 'USER' | 'ADMIN' | 'SYSTEM';
      actorId?: components['schemas']['Id'] | null;
      applicationRevisionId?: components['schemas']['Id'] | null;
      /** Format: date-time */
      createdAt: string;
    };
    MemberQualificationHistory: {
      memberId: components['schemas']['Id'];
      items: components['schemas']['MemberQualificationHistoryItem'][];
      page: number;
      /** @enum {integer} */
      pageSize: 20 | 50;
      /** Format: int64 */
      total: number;
    };
    MemberQualificationHistoryResponse: {
      data: components['schemas']['MemberQualificationHistory'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    MemberManagementView: {
      memberId: components['schemas']['Id'];
      note: string;
      version: components['schemas']['Version'];
      tags: components['schemas']['MemberManagementTag'][];
    };
    MemberManagementResponse: {
      data: components['schemas']['MemberManagementView'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    MemberView: {
      id: components['schemas']['Id'];
      name: string;
      hometownCode: string;
      residenceCode: string;
      industryCode: string;
      introduction: string;
      avatarAssetId: components['schemas']['Id'] | null;
      helpText: string;
      /** @description 仅目标成员允许公开时出现，否则必须省略。 */
      phone?: string;
      version: components['schemas']['Version'];
    };
    MemberPage: {
      items: components['schemas']['MemberView'][];
      page: number;
      /** @constant */
      pageSize: 20;
      /** Format: int64 */
      total: number;
    };
    MemberPageResponse: {
      data: components['schemas']['MemberPage'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    MemberResponse: {
      data: components['schemas']['MemberView'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    CsrfResult: {
      csrfToken: string;
    };
    CsrfResponse: {
      data: components['schemas']['CsrfResult'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminLoginInput: {
      loginName: string;
      password: string;
    };
    ActivationInput: {
      activationToken: string;
      password: string;
    };
    AdminPasswordRecoveryInput: {
      recoveryToken: string;
      password: string;
    };
    PasswordResetCredential: {
      targetAdminId: components['schemas']['Id'];
      readonly recoveryToken: string;
      /** @enum {integer} */
      expiresInSeconds: 1800;
    };
    PasswordResetCredentialResponse: {
      data: components['schemas']['PasswordResetCredential'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminAuthStep: {
      /** @enum {string} */
      nextStep: 'AUTHENTICATED';
    };
    AdminAuthResponse: {
      data: components['schemas']['AdminAuthStep'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    EmptyResponse: {
      data: null;
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    HealthResponse: {
      /** @enum {string} */
      status: 'UP' | 'DOWN' | 'OUT_OF_SERVICE' | 'UNKNOWN';
    };
    AdminPermissionScope: {
      permissionCode: string;
      domain: string;
      scopeSetId: string;
      /** @enum {string} */
      scopeType: 'GLOBAL' | 'MEMBER_REGION' | 'ACTIVITY_SET';
    };
    AdminMe: {
      adminId: string;
      loginName: string;
      permissions: components['schemas']['AdminPermissionScope'][];
    };
    AdminMeResponse: {
      data: components['schemas']['AdminMe'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminAccountView: {
      /** Format: int64 */
      id: number;
      loginName: string;
      /** @enum {string} */
      status: 'INVITED' | 'ACTIVE' | 'DISABLED';
      roles: string[];
      scopes: string[];
      /** Format: date-time */
      lastLoginAt?: string | null;
      /** Format: int64 */
      version: number;
    };
    AdminAccountPage: {
      items: components['schemas']['AdminAccountView'][];
      page: number;
      /** @enum {integer} */
      pageSize: 20 | 50;
      total: number;
    };
    AdminAccountPageResponse: {
      data: components['schemas']['AdminAccountPage'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminInvitationInput: {
      loginName: string;
      /** @enum {string} */
      roleCode: 'MEMBER_ADMIN' | 'ACTIVITY_OPERATOR' | 'SUPER_ADMIN';
      scopes: {
        [key: string]: number;
      };
    };
    AdminAccessUpdateInput: {
      /** @enum {string} */
      roleCode: 'MEMBER_ADMIN' | 'ACTIVITY_OPERATOR' | 'SUPER_ADMIN';
      scopes: {
        [key: string]: number;
      };
    };
    AdminInvitation: {
      /** Format: int64 */
      adminId: number;
      invitationToken: string;
      /** @constant */
      expiresInSeconds: 86400;
    };
    AdminInvitationResponse: {
      data: components['schemas']['AdminInvitation'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminAccountMutationResult: {
      /** Format: int64 */
      id: number;
      /** @enum {string} */
      status: 'INVITED' | 'ACTIVE' | 'DISABLED';
      /** Format: int64 */
      version: number;
    };
    AdminAccountMutationResponse: {
      data: components['schemas']['AdminAccountMutationResult'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminScopeRuleInput: {
      hometownCodes?: string[];
      residenceCodes?: string[];
    };
    ActivityDraftInput: {
      title?: string;
      summary?: string;
      /** @description 当前仅接受null；媒体上传接口上线后再开放资源ID。 */
      coverAssetId?: components['schemas']['Id'] | null;
      intro?: string | null;
      place?: string;
      ownerAdminId?: components['schemas']['Id'] | null;
      /** @enum {string|null} */
      visibility?: 'PUBLIC' | 'MEMBERS' | null;
      /** Format: date-time */
      startAt?: string | null;
      /** Format: date-time */
      endAt?: string | null;
      /** Format: date-time */
      signupOpenAt?: string | null;
      /** Format: date-time */
      signupCloseAt?: string | null;
      /** Format: date-time */
      cancelCloseAt?: string | null;
      capacity?: number | null;
      companionLimit?: number | null;
    };
    AdminActivityCreated: {
      activityId: components['schemas']['Id'];
      version: components['schemas']['Version'];
      draftVersion: components['schemas']['Version'];
      scopeSetId: components['schemas']['Id'];
    };
    AdminActivityDraft: {
      activityId: components['schemas']['Id'];
      version: components['schemas']['Version'];
      draftVersion: components['schemas']['Version'];
      baseActivityVersion: components['schemas']['Version'];
      title: string | null;
      summary: string | null;
      coverAssetId: components['schemas']['Id'] | null;
      intro: string | null;
      place: string | null;
      ownerAdminId: components['schemas']['Id'];
      /** @enum {string|null} */
      visibility: 'PUBLIC' | 'MEMBERS' | null;
      /** Format: date-time */
      startAt: string | null;
      /** Format: date-time */
      endAt: string | null;
      /** Format: date-time */
      signupOpenAt: string | null;
      /** Format: date-time */
      signupCloseAt: string | null;
      /** Format: date-time */
      cancelCloseAt: string | null;
      capacity: number | null;
      companionLimit: number | null;
    };
    RegistrationContactInput: {
      name: string;
      phone: string;
    };
    ActivityRegistrationInput: {
      companionCount: number;
      contact: components['schemas']['RegistrationContactInput'];
      expectedGeneration: number;
    };
    RegistrationCheckinSummary: {
      /** Format: date-time */
      checkedAt: string;
      participantCount: number;
    };
    RegistrationView: {
      id: components['schemas']['Id'];
      activityId: components['schemas']['Id'];
      generation: components['schemas']['Version'];
      /** @enum {string} */
      status: 'ACTIVE' | 'CANCELLED' | 'EVENT_CANCELLED';
      companionCount: number;
      participantCount: number;
      /** Format: date-time */
      registeredAt: string;
      checkin?: components['schemas']['RegistrationCheckinSummary'] | null;
      version: components['schemas']['Version'];
      allowedActions: ('cancel' | 'refreshCheckinToken')[];
    };
    RegistrationResponse: {
      data: components['schemas']['RegistrationView'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    RegistrationPage: {
      items: components['schemas']['RegistrationView'][];
      page: number;
      pageSize: number;
      /** Format: int64 */
      total: number;
    };
    ActivityView: {
      id: components['schemas']['Id'];
      title: string;
      summary?: string | null;
      coverAssetId?: components['schemas']['Id'] | null;
      intro?: string;
      place: string;
      ownerAdminId: components['schemas']['Id'];
      /** @enum {string} */
      visibility: 'PUBLIC' | 'MEMBERS';
      /** Format: date-time */
      startAt: string;
      /** Format: date-time */
      endAt: string;
      /** Format: date-time */
      signupOpenAt: string;
      /** Format: date-time */
      signupCloseAt: string;
      /** Format: date-time */
      cancelCloseAt: string | null;
      /** @enum {string} */
      publicationState: 'PUBLISHED';
      /** @enum {string} */
      lifecycle: 'UPCOMING' | 'ONGOING' | 'ENDED' | 'CANCELLED';
      /** @enum {string} */
      signupWindow: 'NOT_OPEN' | 'OPEN' | 'CLOSED';
      isFull: boolean;
      capacity: number;
      occupiedCount: number;
      remainingCount: number;
      validRegistrationCount: number;
      checkedInParticipants: number;
      /** Format: date-time */
      serverTime: string;
      version: components['schemas']['Version'];
      myRegistration: components['schemas']['RegistrationView'] | null;
      allowedActions: ('register' | 'cancel' | 'refreshCheckinToken')[];
    };
    AdminRecapTask: {
      activityId: components['schemas']['Id'];
      activityTitle: string;
      /** Format: date-time */
      endedAt: string;
      /** @enum {string} */
      state: 'PREPARING' | 'PUBLISHED' | 'WITHDRAWN';
      version: components['schemas']['Version'];
      /** Format: int64 */
      publishedVersionId: number | null;
      draftVersion: components['schemas']['Version'];
      /** Format: date-time */
      updatedAt: string | null;
    };
    AdminRecapTaskPage: {
      items: components['schemas']['AdminRecapTask'][];
      page: number;
      pageSize: number;
      /** Format: int64 */
      total: number;
    };
    AdminRecapTaskPageResponse: {
      data: components['schemas']['AdminRecapTaskPage'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminAuditLogItem: {
      /** Format: int64 */
      id: number;
      /** @constant */
      actorType: 'ADMIN';
      /** Format: int64 */
      actorId: number | null;
      action: string;
      objectType: string;
      /** Format: int64 */
      objectId: number | null;
      /** @enum {string} */
      result: 'SUCCESS' | 'DENIED' | 'FAILED';
      safeSummary: {
        [key: string]: unknown;
      };
      /** Format: date-time */
      createdAt: string;
    };
    AdminAuditLogPage: {
      items: components['schemas']['AdminAuditLogItem'][];
      page: number;
      pageSize: number;
      /** Format: int64 */
      total: number;
    };
    AdminAuditLogPageResponse: {
      data: components['schemas']['AdminAuditLogPage'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminWorkbenchMetric: {
      /** @enum {string} */
      status: 'AVAILABLE' | 'FORBIDDEN' | 'UNAVAILABLE';
      /** Format: int64 */
      value: number | null;
    };
    AdminWorkbenchTodo: {
      /** @enum {string} */
      code:
        'PENDING_APPLICATIONS' | 'PENDING_FEEDBACK' | 'UPCOMING_ACTIVITIES' | 'UNPUBLISHED_RECAPS';
      /** @enum {string} */
      status: 'AVAILABLE' | 'FORBIDDEN' | 'UNAVAILABLE';
      /** Format: int64 */
      count: number | null;
      href: string | null;
    };
    AdminUpcomingActivity: {
      activityId: components['schemas']['Id'];
      title: string;
      place: string | null;
      /** Format: date-time */
      startAt: string;
      participantCount: number;
      capacity: number | null;
      /** @enum {string} */
      registrationState: 'NOT_OPEN' | 'OPEN' | 'CLOSED';
    };
    AdminWorkbenchView: {
      activeMembers: components['schemas']['AdminWorkbenchMetric'];
      pendingApplications: components['schemas']['AdminWorkbenchMetric'];
      activities: components['schemas']['AdminWorkbenchMetric'];
      pendingFeedback: components['schemas']['AdminWorkbenchMetric'];
      upcomingActivities: components['schemas']['AdminWorkbenchMetric'];
      unpublishedRecaps: components['schemas']['AdminWorkbenchMetric'];
      todos: components['schemas']['AdminWorkbenchTodo'][];
      recentActivities: components['schemas']['AdminUpcomingActivity'][];
      recapTasks: components['schemas']['AdminRecapTask'][];
    };
    AdminWorkbenchViewResponse: {
      data: components['schemas']['AdminWorkbenchView'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    ActivityRecap: {
      /** @enum {string} */
      state: 'PREPARING' | 'PUBLISHED' | 'WITHDRAWN';
      /** Format: int64 */
      version: number | null;
      title: string | null;
      body: string | null;
      coverAssetId: components['schemas']['Id'] | null;
      photoCount: number;
      photos: components['schemas']['ActivityRecapPhoto'][];
    };
    ActivityRecapResponse: {
      data: components['schemas']['ActivityRecap'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    FeedbackSubmitInput: {
      /** @enum {string} */
      type: 'SUGGESTION' | 'ISSUE' | 'REPORT';
      body: string;
      /** @enum {string|null} */
      relatedType?: 'ACTIVITY' | 'MEMBER' | null;
      relatedId?: string | null;
      contactConsent: boolean;
    };
    FeedbackCreated: {
      id: components['schemas']['Id'];
      /** @enum {string} */
      status: 'OPEN';
      version: components['schemas']['Version'];
    };
    FeedbackCreatedResponse: {
      data: components['schemas']['FeedbackCreated'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    FeedbackView: {
      id: components['schemas']['Id'];
      /** @enum {string} */
      type: 'SUGGESTION' | 'ISSUE' | 'REPORT';
      body: string;
      /** @enum {string|null} */
      relatedType: 'ACTIVITY' | 'MEMBER' | null;
      relatedId: string | null;
      /** @enum {string} */
      status: 'OPEN' | 'PROCESSING' | 'RESOLVED' | 'CLOSED';
      publicReply: string | null;
      version: components['schemas']['Version'];
      /** Format: date-time */
      createdAt: string;
      /** Format: date-time */
      updatedAt: string;
    };
    FeedbackPage: {
      items: components['schemas']['FeedbackView'][];
      page: number;
      pageSize: number;
      /** Format: int64 */
      total: number;
    };
    FeedbackPageResponse: {
      data: components['schemas']['FeedbackPage'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    FeedbackViewResponse: {
      data: components['schemas']['FeedbackView'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    FeedbackHistoryItem: {
      /** @enum {string} */
      action: 'SUBMIT' | 'CLAIM' | 'RESOLVE';
      /** @enum {string} */
      actorType: 'USER' | 'ADMIN';
      actorName: string;
      fromStatus: string | null;
      /** @enum {string} */
      toStatus: 'OPEN' | 'PROCESSING' | 'RESOLVED' | 'CLOSED';
      publicReply: string | null;
      /** Format: date-time */
      createdAt: string;
    };
    AdminFeedbackItem: {
      id: components['schemas']['Id'];
      /** @enum {string} */
      type: 'SUGGESTION' | 'ISSUE' | 'REPORT';
      body: string;
      /** @enum {string|null} */
      relatedType: 'ACTIVITY' | 'MEMBER' | null;
      relatedId: string | null;
      submitterUserId: components['schemas']['Id'];
      submitterName: string | null;
      phoneMasked: string | null;
      contactConsent: boolean;
      /** @enum {string} */
      status: 'OPEN' | 'PROCESSING' | 'RESOLVED' | 'CLOSED';
      assigneeAdminId: string | null;
      publicReply: string | null;
      version: components['schemas']['Version'];
      /** Format: date-time */
      createdAt: string;
      /** Format: date-time */
      updatedAt: string;
    };
    AdminFeedbackPage: {
      items: components['schemas']['AdminFeedbackItem'][];
      page: number;
      pageSize: number;
      /** Format: int64 */
      total: number;
    };
    AdminFeedbackPageResponse: {
      data: components['schemas']['AdminFeedbackPage'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminFeedbackDetail: {
      id: components['schemas']['Id'];
      /** @enum {string} */
      type: 'SUGGESTION' | 'ISSUE' | 'REPORT';
      body: string;
      /** @enum {string|null} */
      relatedType: 'ACTIVITY' | 'MEMBER' | null;
      relatedId: string | null;
      submitterUserId: components['schemas']['Id'];
      submitterName: string | null;
      phoneMasked: string | null;
      contactConsent: boolean;
      /** @enum {string} */
      status: 'OPEN' | 'PROCESSING' | 'RESOLVED' | 'CLOSED';
      assigneeAdminId: string | null;
      internalNote: string | null;
      publicReply: string | null;
      history: components['schemas']['FeedbackHistoryItem'][];
      version: components['schemas']['Version'];
      /** Format: date-time */
      createdAt: string;
      /** Format: date-time */
      updatedAt: string;
    };
    AdminFeedbackDetailResponse: {
      data: components['schemas']['AdminFeedbackDetail'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    FeedbackResolveInput: {
      /** @enum {string} */
      status: 'RESOLVED' | 'CLOSED';
      publicReply: string | null;
      internalNote: string | null;
      /** @constant */
      confirmed: true;
    };
    PhoneAccessInput: {
      purpose: string;
    };
    AdminPhoneAccess: {
      resourceId: components['schemas']['Id'];
      phone: string;
    };
    AdminPhoneAccessResponse: {
      data: components['schemas']['AdminPhoneAccess'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    FeedbackPhoneAccessInput: {
      purpose: string;
    };
    FeedbackMutation: {
      id: components['schemas']['Id'];
      /** @enum {string} */
      status: 'PROCESSING' | 'RESOLVED' | 'CLOSED';
      version: components['schemas']['Version'];
    };
    FeedbackMutationResponse: {
      data: components['schemas']['FeedbackMutation'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    FeedbackPhone: {
      feedbackId: components['schemas']['Id'];
      phone: string;
    };
    FeedbackPhoneResponse: {
      data: components['schemas']['FeedbackPhone'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AnnouncementCreated: {
      announcementId: components['schemas']['Id'];
      version: components['schemas']['Version'];
      draftVersion: components['schemas']['Version'];
    };
    AnnouncementCreatedResponse: {
      data: components['schemas']['AnnouncementCreated'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AnnouncementDraftInput: {
      title: string;
      body: string;
      /** @enum {string} */
      visibility: 'PUBLIC' | 'MEMBERS';
      /** Format: date-time */
      displayStart: string;
      /** Format: date-time */
      displayEnd?: string | null;
      sortOrder: number;
    };
    AnnouncementPreviewInput: {
      draftVersion: components['schemas']['Version'];
    };
    AnnouncementPublishInput: {
      draftVersion: components['schemas']['Version'];
    };
    AnnouncementWithdrawInput: {
      /** @constant */
      confirmed: true;
    };
    AnnouncementMutationResult: {
      announcementId: components['schemas']['Id'];
      version: components['schemas']['Version'];
      /** Format: int64 */
      publishedVersion: number | null;
      /** @enum {string} */
      state: 'PUBLISHED' | 'WITHDRAWN';
    };
    AnnouncementMutationResultResponse: {
      data: components['schemas']['AnnouncementMutationResult'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AnnouncementPreview: {
      announcementId: components['schemas']['Id'];
      draftVersion: components['schemas']['Version'];
      title: string;
      body: string;
      /** @enum {string} */
      visibility: 'PUBLIC' | 'MEMBERS';
      /** Format: date-time */
      displayStart: string;
      /** Format: date-time */
      displayEnd: string | null;
      sortOrder: number;
      publishable: boolean;
    };
    AnnouncementPreviewResponse: {
      data: components['schemas']['AnnouncementPreview'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AnnouncementDraftView: {
      announcementId: components['schemas']['Id'];
      version: components['schemas']['Version'];
      baseVersion: components['schemas']['Version'];
      draftVersion: components['schemas']['Version'];
      title: string;
      body: string;
      /** @enum {string} */
      visibility: 'PUBLIC' | 'MEMBERS';
      /** Format: date-time */
      displayStart: string;
      /** Format: date-time */
      displayEnd: string | null;
      sortOrder: number;
    };
    AnnouncementDraftViewResponse: {
      data: components['schemas']['AnnouncementDraftView'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminAnnouncementItem: {
      id: components['schemas']['Id'];
      title: string;
      /** @enum {string} */
      state: 'DRAFT' | 'PUBLISHED' | 'WITHDRAWN';
      /** @enum {string} */
      visibility: 'PUBLIC' | 'MEMBERS';
      version: components['schemas']['Version'];
      draftVersion: components['schemas']['Version'];
      /** Format: date-time */
      displayStart: string;
      /** Format: date-time */
      publishedAt: string | null;
      /** Format: date-time */
      updatedAt: string;
    };
    AdminAnnouncementPage: {
      items: components['schemas']['AdminAnnouncementItem'][];
      page: number;
      pageSize: number;
      /** Format: int64 */
      total: number;
    };
    AdminAnnouncementPageResponse: {
      data: components['schemas']['AdminAnnouncementPage'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AnnouncementView: {
      id: string;
      title: string;
      body: string;
      /** @enum {string} */
      visibility: 'PUBLIC' | 'MEMBERS';
      /** Format: date-time */
      displayStart: string;
      /** Format: date-time */
      displayEnd: string | null;
      /** Format: date-time */
      publishedAt: string;
      /** Format: int64 */
      version: number;
    };
    AnnouncementPage: {
      items: components['schemas']['AnnouncementView'][];
      page: number;
      pageSize: number;
      /** Format: int64 */
      total: number;
    };
    AnnouncementPageResponse: {
      data: components['schemas']['AnnouncementPage'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AnnouncementViewResponse: {
      data: components['schemas']['AnnouncementView'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    ActivityPage: {
      items: components['schemas']['ActivityView'][];
      page: number;
      pageSize: number;
      /** Format: int64 */
      total: number;
    };
    ActivityPageResponse: {
      data: components['schemas']['ActivityPage'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    ActivityViewResponse: {
      data: components['schemas']['ActivityView'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    CheckinTokenInput: {
      token: string;
    };
    CheckinPreview: {
      registrationId: components['schemas']['Id'];
      generation: components['schemas']['Version'];
      registrationVersion: components['schemas']['Version'];
      name: string;
      participantCount: number;
      phoneMasked: string;
      /** @enum {string} */
      result: 'READY' | 'ALREADY_CHECKED_IN' | 'TOKEN_EXPIRED' | 'REGISTRATION_CLOSED';
    };
    CheckinPreviewResponse: {
      data: components['schemas']['CheckinPreview'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    CheckinConfirmationInput: {
      token: string;
      registrationId: components['schemas']['Id'];
      generation: components['schemas']['Version'];
      /** @enum {boolean} */
      confirmed: true;
    };
    ManualCheckinInput: {
      registrationId: components['schemas']['Id'];
      generation: components['schemas']['Version'];
      verificationMethod: string;
      reason: string;
      /** @enum {boolean} */
      confirmed: true;
    };
    CheckinMutation: {
      /** @enum {string} */
      result: 'CHECKED_IN' | 'ALREADY_CHECKED_IN';
      checkin: {
        id: components['schemas']['Id'];
        participantCount: number;
        /** Format: date-time */
        checkedAt: string;
        operatorDisplayName: string;
      };
      replayed: boolean;
    };
    CheckinMutationResponse: {
      data: components['schemas']['CheckinMutation'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    CheckinTokenView: {
      token: string;
      /** Format: date-time */
      expiresAt: string;
      /** Format: date-time */
      refreshAfter: string;
      activityId: components['schemas']['Id'];
      registrationId: components['schemas']['Id'];
      generation: components['schemas']['Version'];
    };
    CheckinTokenResponse: {
      data: components['schemas']['CheckinTokenView'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    RegistrationPageResponse: {
      data: components['schemas']['RegistrationPage'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    RegistrationCancellationInput: {
      /** @enum {boolean} */
      confirmed: true;
    };
    AdminActivityListItem: {
      activityId: components['schemas']['Id'];
      /** @enum {string} */
      publicationState: 'DRAFT' | 'PUBLISHED';
      cancelled: boolean;
      title?: string | null;
      place?: string | null;
      visibility?: string | null;
      /** Format: date-time */
      startAt?: string | null;
      /** Format: date-time */
      endAt?: string | null;
      capacity?: number | null;
      occupiedCount: number;
      version: components['schemas']['Version'];
      draftTitle?: string | null;
      draftVersion: components['schemas']['Version'];
      baseActivityVersion: components['schemas']['Version'];
      ownerAdminId: components['schemas']['Id'];
      /** Format: date-time */
      draftUpdatedAt?: string | null;
    };
    AdminActivityPage: {
      items: components['schemas']['AdminActivityListItem'][];
      publicationState?: string | null;
      page: number;
      pageSize: number;
      /** Format: int64 */
      total: number;
    };
    ActivityDraftSummary: {
      title?: string | null;
      draftVersion: components['schemas']['Version'];
      baseActivityVersion: components['schemas']['Version'];
      /** Format: date-time */
      updatedAt?: string | null;
    };
    AdminActivityView: {
      activityId: components['schemas']['Id'];
      /** @enum {string} */
      publicationState: 'DRAFT' | 'PUBLISHED';
      cancelled: boolean;
      title?: string | null;
      summary?: string | null;
      coverAssetId?: components['schemas']['Id'] | null;
      intro?: string | null;
      place?: string | null;
      ownerAdminId: components['schemas']['Id'];
      visibility?: string | null;
      /** Format: date-time */
      startAt?: string | null;
      /** Format: date-time */
      endAt?: string | null;
      /** Format: date-time */
      signupOpenAt?: string | null;
      /** Format: date-time */
      signupCloseAt?: string | null;
      /** Format: date-time */
      cancelCloseAt?: string | null;
      capacity?: number | null;
      companionLimit?: number | null;
      occupiedCount: number;
      version: components['schemas']['Version'];
      draft: components['schemas']['ActivityDraftSummary'];
    };
    AdminRegistrationListItem: {
      id: components['schemas']['Id'];
      memberId: components['schemas']['Id'];
      generation: components['schemas']['Version'];
      /** @enum {string} */
      status: 'ACTIVE' | 'CANCELLED' | 'EVENT_CANCELLED';
      companionCount: number;
      participantCount: number;
      contactName: string;
      phoneMasked: string;
      /** Format: date-time */
      registeredAt: string;
      /** Format: date-time */
      checkedAt?: string | null;
      checkedInParticipants: number;
      version: components['schemas']['Version'];
    };
    AdminRegistrationPage: {
      items: components['schemas']['AdminRegistrationListItem'][];
      activityId: components['schemas']['Id'];
      /** @enum {string|null} */
      status?: 'ACTIVE' | 'CANCELLED' | 'EVENT_CANCELLED' | null;
      page: number;
      pageSize: number;
      /** Format: int64 */
      total: number;
      /** Format: int64 */
      totalRegistrations: number;
      /** Format: int64 */
      totalParticipants: number;
      /** Format: int64 */
      checkedInParticipants: number;
    };
    AdminRegistrationHistoryItem: {
      generation: components['schemas']['Version'];
      /** @enum {string} */
      action: 'REGISTER' | 'REREGISTER' | 'CANCEL' | 'EVENT_CANCEL';
      beforeStatus?: string | null;
      afterStatus: string;
      beforeCount?: number | null;
      afterCount: number;
      reason?: string | null;
      /** @enum {string} */
      actorType: 'USER' | 'ADMIN' | 'SYSTEM';
      actorId: components['schemas']['Id'];
      contactName: string;
      phoneMasked: string;
      /** Format: date-time */
      createdAt: string;
    };
    AdminRegistrationDetail: {
      registration: components['schemas']['AdminRegistrationListItem'];
      history: components['schemas']['AdminRegistrationHistoryItem'][];
    };
    AdminRegistrationCancellationInput: {
      reason: string;
      /** @enum {boolean} */
      confirmed: true;
    };
    AdminRegistrationCancelled: {
      registrationId: components['schemas']['Id'];
      generation: components['schemas']['Version'];
      /** @enum {string} */
      status: 'CANCELLED';
      version: components['schemas']['Version'];
      releasedParticipants: number;
      /** Format: int64 */
      totalRegistrations: number;
      /** Format: int64 */
      totalParticipants: number;
      /** Format: int64 */
      checkedInParticipants: number;
    };
    AdminRegistrationCancelledResponse: {
      data: components['schemas']['AdminRegistrationCancelled'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminRegistrationPageResponse: {
      data: components['schemas']['AdminRegistrationPage'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminRegistrationDetailResponse: {
      data: components['schemas']['AdminRegistrationDetail'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminActivityPageResponse: {
      data: components['schemas']['AdminActivityPage'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminActivityViewResponse: {
      data: components['schemas']['AdminActivityView'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    ActivityPublishInput: {
      draftVersion: components['schemas']['Version'];
      changeHash: string;
    };
    ActivityCancellationInput: {
      reason: string;
      /** @enum {boolean} */
      confirmed: true;
    };
    ActivityCancelled: {
      activityId: components['schemas']['Id'];
      version: components['schemas']['Version'];
      /** @enum {string} */
      lifecycle: 'CANCELLED';
      /** Format: int64 */
      cancelledRegistrations: number;
    };
    ActivityCancelledResponse: {
      data: components['schemas']['ActivityCancelled'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    ActivityPublished: {
      activityId: components['schemas']['Id'];
      version: components['schemas']['Version'];
      draftVersion: components['schemas']['Version'];
      /** @enum {string} */
      publicationState: 'PUBLISHED';
    };
    ActivityPublishedResponse: {
      data: components['schemas']['ActivityPublished'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    ActivityPublishPreviewInput: {
      draftVersion: components['schemas']['Version'];
    };
    ActivityPublishPreview: {
      activityId: components['schemas']['Id'];
      version: components['schemas']['Version'];
      draftVersion: components['schemas']['Version'];
      title: string;
      changeHash: string;
    };
    ActivityPublishPreviewResponse: {
      data: components['schemas']['ActivityPublishPreview'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminActivityCreatedResponse: {
      data: components['schemas']['AdminActivityCreated'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    ActivityRecapPreviewInput: {
      /** Format: int64 */
      draftVersion: number;
    };
    ActivityRecapPublishInput: {
      /** Format: int64 */
      draftVersion: number;
    };
    ActivityRecapWithdrawInput: {
      /** @constant */
      confirmed: true;
    };
    ActivityRecapPreview: {
      activityId: components['schemas']['Id'];
      /** Format: int64 */
      draftVersion: number;
      title: string;
      body: string | null;
      /** @enum {string} */
      visibility: 'PUBLIC' | 'MEMBERS';
      publishable: boolean;
      coverAssetId: components['schemas']['Id'] | null;
      photos: components['schemas']['ActivityRecapPhoto'][];
    };
    ActivityRecapPreviewResponse: {
      data: components['schemas']['ActivityRecapPreview'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    ActivityRecapMutation: {
      activityId: components['schemas']['Id'];
      version: components['schemas']['Version'];
      publishedVersion: components['schemas']['Id'] | null;
      /** @enum {string} */
      state: 'PUBLISHED' | 'WITHDRAWN';
    };
    ActivityRecapMutationResponse: {
      data: components['schemas']['ActivityRecapMutation'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    ActivityRecapDraftInput: {
      title?: string | null;
      body?: string | null;
      /** @enum {string} */
      visibility: 'PUBLIC' | 'MEMBERS';
      coverAssetId?: components['schemas']['Id'] | null;
      photos: components['schemas']['ActivityRecapPhotoInput'][];
    };
    ActivityRecapDraft: {
      activityId: components['schemas']['Id'];
      activityTitle: string;
      /** @enum {string} */
      state: 'PREPARING' | 'PUBLISHED' | 'WITHDRAWN';
      version: components['schemas']['Version'];
      /** Format: int64 */
      draftVersion: number;
      title: string | null;
      body: string | null;
      /** @enum {string} */
      visibility: 'PUBLIC' | 'MEMBERS';
      coverAssetId: components['schemas']['Id'] | null;
      photos: components['schemas']['ActivityRecapPhoto'][];
    };
    HomeCarouselPhoto: {
      activityId: components['schemas']['Id'];
      activityTitle: string;
      /** Format: int64 */
      recapVersion: number;
      assetId: components['schemas']['Id'];
      caption: string | null;
    };
    ActivityRecapPhoto: {
      /**
       * @description 首页轮播标记，随回顾版本发布；省略为false，保存草稿不改变线上轮播。
       * @default false
       */
      homeFeatured: boolean;
      assetId: components['schemas']['Id'];
      caption: string | null;
    };
    ActivityRecapPhotoInput: {
      /**
       * @description 首页轮播标记，随回顾版本发布；省略为false，保存草稿不改变线上轮播。
       * @default false
       */
      homeFeatured: boolean;
      assetId: components['schemas']['Id'];
      caption: string | null;
    };
    ActivityRecapDraftResponse: {
      data: components['schemas']['ActivityRecapDraft'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminActivityDraftResponse: {
      data: components['schemas']['AdminActivityDraft'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminScopeCreateInput: {
      /** @enum {string} */
      domain: 'MEMBERSHIP' | 'FEEDBACK';
      rules: components['schemas']['AdminScopeRuleInput'][];
    };
    AdminScopeUpdateInput: {
      rules: components['schemas']['AdminScopeRuleInput'][];
    };
    AdminScopeRule: {
      /** Format: int64 */
      ruleId: number;
      hometowns: components['schemas']['DictionaryOption'][];
      residences: components['schemas']['DictionaryOption'][];
    };
    AdminScopeSet: {
      /** Format: int64 */
      scopeSetId: number;
      /** @enum {string} */
      domain: 'MEMBERSHIP' | 'FEEDBACK';
      /** @enum {string} */
      scopeType: 'GLOBAL' | 'MEMBER_REGION';
      /** @enum {string} */
      status: 'ACTIVE' | 'DISABLED';
      version: components['schemas']['Version'];
      rules: components['schemas']['AdminScopeRule'][];
    };
    AdminScopeSetPage: {
      items: components['schemas']['AdminScopeSet'][];
      /** @enum {string} */
      domain: 'MEMBERSHIP' | 'FEEDBACK';
      page: number;
      /** @enum {integer} */
      pageSize: 20 | 50;
      total: number;
    };
    AdminScopeSetPageResponse: {
      data: components['schemas']['AdminScopeSetPage'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminScopeSetResponse: {
      data: components['schemas']['AdminScopeSet'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminMediaUploadInput: {
      /** @enum {string} */
      purpose: 'RECAP_PHOTO' | 'ACTIVITY_COVER';
      /** @enum {string} */
      contextType: 'ACTIVITY_RECAP' | 'ACTIVITY';
      contextId: components['schemas']['Id'];
      fileName: string;
      sizeBytes: number;
      /** @enum {string} */
      contentType: 'image/jpeg' | 'image/png' | 'image/webp';
    };
    AppMediaUploadInput: {
      /** @constant */
      purpose: 'MEMBER_AVATAR';
      /** @constant */
      contextType: 'MEMBER_PROFILE';
      contextId: components['schemas']['Id'];
      fileName: string;
      sizeBytes: number;
      /** @enum {string} */
      contentType: 'image/jpeg' | 'image/png' | 'image/webp';
    };
    AdminMediaUpload: {
      assetId: components['schemas']['Id'];
      /** @constant */
      status: 'PENDING_UPLOAD';
    };
    AdminMediaUploadCredential: {
      /** @constant */
      method: 'PUT';
      /** Format: uri */
      url: string;
      headers: {
        [key: string]: string;
      };
      /** Format: date-time */
      expiresAt: string;
    };
    AdminMediaUploadResponse: {
      data: components['schemas']['AdminMediaUpload'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminMediaUploadCredentialResponse: {
      data: components['schemas']['AdminMediaUploadCredential'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminMediaUploadComplete: {
      assetId: components['schemas']['Id'];
      /** @enum {string} */
      status: 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED';
    };
    AdminMediaUploadCompleteResponse: {
      data: components['schemas']['AdminMediaUploadComplete'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminMediaStatus: {
      assetId: components['schemas']['Id'];
      /** @enum {string} */
      status:
        | 'PENDING_UPLOAD'
        | 'UPLOADED'
        | 'PROCESSING'
        | 'READY'
        | 'FAILED'
        | 'EXPIRED'
        | 'DELETING'
        | 'DELETED';
      failureCode?: string | null;
      sizeBytes?: number | null;
    };
    AdminMediaStatusResponse: {
      data: components['schemas']['AdminMediaStatus'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminExportFilters: {
      query?: string | null;
      /** @enum {string|null} */
      qualification?: 'ACTIVE' | 'DISABLED' | 'LEFT' | null;
      /** @enum {string|null} */
      status?: 'ACTIVE' | 'CANCELLED' | 'EVENT_CANCELLED' | null;
    };
    AdminExportRequest: {
      /** @enum {string} */
      type: 'MEMBERS' | 'REGISTRATIONS';
      activityId?: components['schemas']['Id'] | null;
      filters: components['schemas']['AdminExportFilters'];
      fields: string[];
      includeFullPhone: boolean;
      purpose?: string | null;
    };
    AdminExportPreview: {
      /** @enum {string} */
      type: 'MEMBERS' | 'REGISTRATIONS';
      allowedFields: string[];
      estimatedRows: number;
      /** @constant */
      maximumRows: 50000;
      fullPhoneAllowed: boolean;
    };
    AdminExportTask: {
      id: components['schemas']['Id'];
      /** @enum {string} */
      type: 'MEMBERS' | 'REGISTRATIONS';
      /** @enum {string} */
      status: 'QUEUED' | 'RUNNING' | 'READY' | 'FAILED' | 'EXPIRED' | 'INVALIDATED';
      attempt: number;
      rowCount: number | null;
      /** Format: date-time */
      snapshotAt: string | null;
      /** Format: date-time */
      expiresAt: string | null;
      failureCode: string | null;
    };
    AdminExportTaskPage: {
      items: components['schemas']['AdminExportTask'][];
      page: number;
      /** @enum {integer} */
      pageSize: 20 | 50;
      total: number;
    };
    AdminExportPreviewResponse: {
      data: components['schemas']['AdminExportPreview'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminExportTaskResponse: {
      data: components['schemas']['AdminExportTask'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    AdminExportTaskPageResponse: {
      data: components['schemas']['AdminExportTaskPage'];
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    MembershipExitInput: {
      /** @constant */
      confirmed: true;
    };
    AccountClosureInput: {
      /** @description 新获取的微信wx.login code；仅服务端兑换，绝不持久化或记录日志 */
      confirmationCode: string;
      /** @constant */
      confirmed: true;
    };
    AccountClosureResponse: {
      data: {
        /** @constant */
        state: 'CLOSING';
      };
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
    MembershipExitResponse: {
      data: {
        userId: components['schemas']['Id'];
        /** @constant */
        qualification: 'LEFT';
        version: components['schemas']['Version'];
      };
      /** Format: uuid */
      requestId: string;
      /** Format: date-time */
      serverTime: string;
    };
  };
  responses: {
    /** @description INVALID_ARGUMENT / INVALID_IDEMPOTENCY_KEY / INVALID_WECHAT_CODE */
    Error400: {
      headers: {
        'X-Request-ID': components['headers']['RequestId'];
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['ErrorResponse'];
      };
    };
    /** @description AUTH_REQUIRED / SESSION_EXPIRED / SESSION_REVOKED */
    Error401: {
      headers: {
        'X-Request-ID': components['headers']['RequestId'];
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['ErrorResponse'];
      };
    };
    /** @description ACTION_FORBIDDEN / MEMBERSHIP_REQUIRED / REAUTH_REQUIRED */
    Error403: {
      headers: {
        'X-Request-ID': components['headers']['RequestId'];
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['ErrorResponse'];
      };
    };
    /** @description RESOURCE_UNAVAILABLE；不可见与不存在不作区分 */
    Error404: {
      headers: {
        'X-Request-ID': components['headers']['RequestId'];
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['ErrorResponse'];
      };
    };
    /** @description VERSION_CONFLICT / STATE_CONFLICT / IDEMPOTENCY_MISMATCH */
    Error409: {
      headers: {
        'X-Request-ID': components['headers']['RequestId'];
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['ErrorResponse'];
      };
    };
    /** @description FIELD_VALIDATION_FAILED */
    Error422: {
      headers: {
        'X-Request-ID': components['headers']['RequestId'];
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['ErrorResponse'];
      };
    };
    /** @description VERSION_REQUIRED */
    Error428: {
      headers: {
        'X-Request-ID': components['headers']['RequestId'];
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['ErrorResponse'];
      };
    };
    /** @description RATE_LIMITED */
    Error429: {
      headers: {
        'X-Request-ID': components['headers']['RequestId'];
        'Retry-After': components['headers']['RetryAfter'];
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['ErrorResponse'];
      };
    };
    /** @description TEMPORARILY_UNAVAILABLE / TRANSACTION_RETRY */
    Error503: {
      headers: {
        'X-Request-ID': components['headers']['RequestId'];
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['ErrorResponse'];
      };
    };
  };
  parameters: {
    Id: components['schemas']['Id'];
    /** @description 缺少返回428；版本不匹配返回409。 */
    IfMatch: string;
    /** @description 首次提交可省略；NEEDS_INFO重提或LEFT重新申请必须提供，否则428。 */
    ResubmissionVersion: string;
    /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
    IdempotencyKey: string;
    CsrfToken: string;
    /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
    Origin: string;
    Page: number;
    PageSize: 20 | 50;
    DirectoryPageSize: 20;
    Query: string;
  };
  requestBodies: never;
  headers: {
    /** @description 本人资料禁止缓存 */
    NoStore: 'no-store';
    /** @description 本次请求跟踪号 */
    RequestId: string;
    /** @description 资源版本，格式为双引号包围的非负整数 */
    ETag: string;
    /** @description 仅幂等重放时返回 true */
    Replayed: boolean;
    /** @description 再次请求前等待秒数 */
    RetryAfter: number;
  };
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  getAdminRecapDraftPhoto: {
    parameters: {
      query: {
        draftVersion: number;
      };
      header?: never;
      path: {
        id: components['parameters']['Id'];
        assetId: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 草稿图片原始字节，仅image/jpeg、image/png或image/webp */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'image/jpeg': string;
          'image/png': string;
          'image/webp': string;
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      503: components['responses']['Error503'];
    };
  };
  getAppHomeSummary: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 首页个性化摘要 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AppHomeSummaryResponse'];
        };
      };
      401: components['responses']['Error401'];
      503: components['responses']['Error503'];
    };
  };
  getAppNextGathering: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 最近一场相聚或null */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['NextGatheringView'] | null;
            requestId: string;
            /** Format: date-time */
            serverTime: string;
          };
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      503: components['responses']['Error503'];
    };
  };
  getHomeCarousel: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 当前轮播照片，无照片返回空数组 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['HomeCarouselPhoto'][];
            /** Format: uuid */
            requestId: string;
            /** Format: date-time */
            serverTime: string;
          };
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      503: components['responses']['Error503'];
    };
  };
  wechatLogin: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['WechatLoginInput'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['WechatLoginResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      428: components['responses']['Error428'];
      429: components['responses']['Error429'];
      503: components['responses']['Error503'];
    };
  };
  appLogout: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['EmptyResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      428: components['responses']['Error428'];
      429: components['responses']['Error429'];
      503: components['responses']['Error503'];
    };
  };
  listRegions: {
    parameters: {
      query?: {
        parentCode?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DictionaryResponse'];
        };
      };
      400: components['responses']['Error400'];
      503: components['responses']['Error503'];
    };
  };
  listIndustries: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DictionaryResponse'];
        };
      };
      503: components['responses']['Error503'];
    };
  };
  getMe: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['MeResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      428: components['responses']['Error428'];
      429: components['responses']['Error429'];
      503: components['responses']['Error503'];
    };
  };
  getMyApplication: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          'Cache-Control': components['headers']['NoStore'];
          ETag: components['headers']['ETag'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['MyApplicationResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      428: components['responses']['Error428'];
      429: components['responses']['Error429'];
      503: components['responses']['Error503'];
    };
  };
  updateMyProfile: {
    parameters: {
      query?: never;
      header: {
        'If-Match': string;
      };
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateMyProfileInput'];
      };
    };
    responses: {
      /** @description 更新后的本人资料 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          'Cache-Control': components['headers']['NoStore'];
          ETag: components['headers']['ETag'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PrivateProfileResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      428: components['responses']['Error428'];
      503: components['responses']['Error503'];
    };
  };
  leaveMembership: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
      };
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['MembershipExitInput'];
      };
    };
    responses: {
      /** @description 成员资格已退出或返回相同幂等结果 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          ETag: components['headers']['ETag'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['MembershipExitResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      409: components['responses']['Error409'];
      428: components['responses']['Error428'];
      503: components['responses']['Error503'];
    };
  };
  requestAccountClosure: {
    parameters: {
      query?: never;
      header: {
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
      };
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AccountClosureInput'];
      };
    };
    responses: {
      /** @description 账号已冻结，清理任务已排队 */
      202: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AccountClosureResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      409: components['responses']['Error409'];
      503: components['responses']['Error503'];
    };
  };
  submitApplication: {
    parameters: {
      query?: never;
      header: {
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
        /** @description 首次提交可省略；NEEDS_INFO重提或LEFT重新申请必须提供，否则428。 */
        'If-Match'?: components['parameters']['ResubmissionVersion'];
      };
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ApplicationInput'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          ETag: components['headers']['ETag'];
          'Idempotency-Replayed': components['headers']['Replayed'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['SubmissionResponse'];
        };
      };
      /** @description 成功 */
      201: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          ETag: components['headers']['ETag'];
          'Idempotency-Replayed': components['headers']['Replayed'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['SubmissionResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      428: components['responses']['Error428'];
      429: components['responses']['Error429'];
      503: components['responses']['Error503'];
    };
  };
  listApplications: {
    parameters: {
      query?: {
        page?: components['parameters']['Page'];
        pageSize?: components['parameters']['PageSize'];
        query?: components['parameters']['Query'];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminApplicationPageResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      428: components['responses']['Error428'];
      429: components['responses']['Error429'];
      503: components['responses']['Error503'];
    };
  };
  getAdminApplication: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminApplicationDetailResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      503: components['responses']['Error503'];
    };
  };
  getAdminApplicationHistory: {
    parameters: {
      query?: {
        page?: components['parameters']['Page'];
        pageSize?: components['parameters']['PageSize'];
      };
      header?: never;
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 申请资料修订和审核记录 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ApplicationHistoryResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      422: components['responses']['Error422'];
      503: components['responses']['Error503'];
    };
  };
  getAdminApplicationInternalNote: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 申请内部备注 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          ETag: components['headers']['ETag'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ApplicationInternalNoteResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      503: components['responses']['Error503'];
    };
  };
  updateAdminApplicationInternalNote: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          text: string;
        };
      };
    };
    responses: {
      /** @description 备注已更新 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          ETag: components['headers']['ETag'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ApplicationInternalNoteResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      428: components['responses']['Error428'];
      503: components['responses']['Error503'];
    };
  };
  revealApplicationPhone: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['PhoneAccessInput'];
      };
    };
    responses: {
      /** @description 已审计的完整联系电话 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminPhoneAccessResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      422: components['responses']['Error422'];
      503: components['responses']['Error503'];
    };
  };
  reviewApplication: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ReviewInput'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          ETag: components['headers']['ETag'];
          'Idempotency-Replayed': components['headers']['Replayed'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ReviewResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      428: components['responses']['Error428'];
      429: components['responses']['Error429'];
      503: components['responses']['Error503'];
    };
  };
  listAdminMembers: {
    parameters: {
      query?: {
        page?: components['parameters']['Page'];
        pageSize?: components['parameters']['PageSize'];
        query?: components['parameters']['Query'];
        qualification?: 'ACTIVE' | 'DISABLED' | 'LEFT';
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminMemberPageResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      503: components['responses']['Error503'];
    };
  };
  getAdminMember: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          'Cache-Control': components['headers']['NoStore'];
          ETag: components['headers']['ETag'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminMemberResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      503: components['responses']['Error503'];
    };
  };
  revealMemberPhone: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['PhoneAccessInput'];
      };
    };
    responses: {
      /** @description 已审计的完整联系电话 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminPhoneAccessResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      422: components['responses']['Error422'];
      503: components['responses']['Error503'];
    };
  };
  changeAdminMemberQualification: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          /** @enum {string} */
          qualification: 'ACTIVE' | 'DISABLED' | 'LEFT';
          reason: string;
        };
      };
    };
    responses: {
      /** @description 资格更新或幂等重放 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          'Cache-Control': components['headers']['NoStore'];
          ETag: components['headers']['ETag'];
          'Idempotency-Replayed'?: boolean;
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data?: {
              memberId: string;
              qualification: string;
              /** Format: int64 */
              version: number;
              replayed: boolean;
            };
          };
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      428: components['responses']['Error428'];
      429: components['responses']['Error429'];
      503: components['responses']['Error503'];
    };
  };
  getAdminMemberQualificationHistory: {
    parameters: {
      query?: {
        page?: components['parameters']['Page'];
        pageSize?: components['parameters']['PageSize'];
      };
      header?: never;
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成员资格历史 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['MemberQualificationHistoryResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      422: components['responses']['Error422'];
      503: components['responses']['Error503'];
    };
  };
  getMemberManagementNote: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 当前备注、独立版本及可用标签 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          ETag: components['headers']['ETag'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['MemberManagementResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      503: components['responses']['Error503'];
    };
  };
  updateMemberManagementNote: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          note: string;
          tagIds: number[];
        };
      };
    };
    responses: {
      /** @description 已更新 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          ETag: components['headers']['ETag'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['MemberManagementResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      428: components['responses']['Error428'];
      503: components['responses']['Error503'];
    };
  };
  submitAppFeedback: {
    parameters: {
      query?: never;
      header: {
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
      };
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['FeedbackSubmitInput'];
      };
    };
    responses: {
      /** @description 已提交或幂等重放 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['FeedbackCreatedResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
    };
  };
  listAdminFeedback: {
    parameters: {
      query?: {
        page?: components['parameters']['Page'];
        pageSize?: components['parameters']['PageSize'];
        status?: 'OPEN' | 'PROCESSING' | 'RESOLVED' | 'CLOSED';
        type?: 'SUGGESTION' | 'ISSUE' | 'REPORT';
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 当前反馈范围内的脱敏分页 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminFeedbackPageResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      503: components['responses']['Error503'];
    };
  };
  getAdminFeedback: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 反馈详情和处理历史 */
      200: {
        headers: {
          ETag: components['headers']['ETag'];
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminFeedbackDetailResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      503: components['responses']['Error503'];
    };
  };
  claimAdminFeedback: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
      };
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody?: {
      content: {
        'application/json': Record<string, never>;
      };
    };
    responses: {
      /** @description 已认领或安全幂等重放 */
      200: {
        headers: {
          ETag: components['headers']['ETag'];
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['FeedbackMutationResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      428: components['responses']['Error428'];
      503: components['responses']['Error503'];
    };
  };
  resolveAdminFeedback: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
      };
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['FeedbackResolveInput'];
      };
    };
    responses: {
      /** @description 已处理或安全幂等重放 */
      200: {
        headers: {
          ETag: components['headers']['ETag'];
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['FeedbackMutationResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      428: components['responses']['Error428'];
      503: components['responses']['Error503'];
    };
  };
  revealFeedbackContactPhone: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['FeedbackPhoneAccessInput'];
      };
    };
    responses: {
      /** @description 已审计的完整联系电话 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['FeedbackPhoneResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      422: components['responses']['Error422'];
      503: components['responses']['Error503'];
    };
  };
  listMyFeedback: {
    parameters: {
      query?: {
        page?: number;
        pageSize?: 20 | 50;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 本人反馈分页 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['FeedbackPageResponse'];
        };
      };
      401: components['responses']['Error401'];
    };
  };
  getMyFeedback: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 本人反馈内容和公开处理结果 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['FeedbackViewResponse'];
        };
      };
      401: components['responses']['Error401'];
      404: components['responses']['Error404'];
    };
  };
  listAppAnnouncements: {
    parameters: {
      query?: {
        page?: number;
        pageSize?: 20 | 50;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 当前有效公告分页 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AnnouncementPageResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
    };
  };
  getAppAnnouncement: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 公告详情 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AnnouncementViewResponse'];
        };
      };
      401: components['responses']['Error401'];
      404: components['responses']['Error404'];
    };
  };
  listAppActivities: {
    parameters: {
      query?: {
        lifecycle?: 'UPCOMING' | 'ONGOING' | 'ENDED' | 'CANCELLED';
        page?: number;
        pageSize?: 20 | 50;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 当前可见活动分页 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ActivityPageResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      503: components['responses']['Error503'];
    };
  };
  getAppActivity: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 活动详情 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ActivityViewResponse'];
        };
      };
      401: components['responses']['Error401'];
      404: components['responses']['Error404'];
      503: components['responses']['Error503'];
    };
  };
  getAppActivityRecap: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 回顾发布快照或整理中状态 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ActivityRecapResponse'];
        };
      };
      401: components['responses']['Error401'];
      404: components['responses']['Error404'];
      503: components['responses']['Error503'];
    };
  };
  createAppMediaAccessTickets: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['MediaAccessTicketInput'];
      };
    };
    responses: {
      /** @description 私有媒体网关链接 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['MediaAccessTicketResponse'];
        };
      };
      401: components['responses']['Error401'];
      404: components['responses']['Error404'];
      503: components['responses']['Error503'];
    };
  };
  createAdminMediaAccessTickets: {
    parameters: {
      query?: never;
      header: {
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AdminMediaAccessTicketInput'];
      };
    };
    responses: {
      /** @description 私有媒体网关链接 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['MediaAccessTicketResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      503: components['responses']['Error503'];
    };
  };
  readPrivateMediaAsset: {
    parameters: {
      query: {
        ticket: string;
      };
      header?: never;
      path: {
        id: components['schemas']['Id'];
        variant: 'THUMBNAIL' | 'DISPLAY';
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 图片字节（以实际Content-Type和Content-Length为准） */
      200: {
        headers: {
          'Cache-Control'?: 'private, no-store';
          'X-Content-Type-Options'?: 'nosniff';
          [name: string]: unknown;
        };
        content: {
          'image/jpeg': string;
          'image/png': string;
          'image/webp': string;
        };
      };
      /** @description 图片、票据或当前访问权限无效 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      503: components['responses']['Error503'];
    };
  };
  createAppActivityRegistration: {
    parameters: {
      query?: never;
      header: {
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
      };
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ActivityRegistrationInput'];
      };
    };
    responses: {
      /** @description 重新报名或幂等重放 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RegistrationResponse'];
        };
      };
      /** @description 首次报名成功 */
      201: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RegistrationResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      503: components['responses']['Error503'];
    };
  };
  listMyActivityRegistrations: {
    parameters: {
      query?: {
        status?: 'ACTIVE' | 'CANCELLED' | 'EVENT_CANCELLED';
        page?: number;
        pageSize?: 20 | 50;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 本人报名分页 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RegistrationPageResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      503: components['responses']['Error503'];
    };
  };
  getMyActivityRegistration: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 报名详情 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RegistrationResponse'];
        };
      };
      401: components['responses']['Error401'];
      404: components['responses']['Error404'];
      503: components['responses']['Error503'];
    };
  };
  cancelMyActivityRegistration: {
    parameters: {
      query?: never;
      header: {
        'If-Match': string;
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
      };
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['RegistrationCancellationInput'];
      };
    };
    responses: {
      /** @description 已取消或幂等重放 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          ETag: components['headers']['ETag'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RegistrationResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      428: components['responses']['Error428'];
      503: components['responses']['Error503'];
    };
  };
  createMyRegistrationCheckinToken: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 签到码已签发 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['CheckinTokenResponse'];
        };
      };
      401: components['responses']['Error401'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      503: components['responses']['Error503'];
    };
  };
  listMembers: {
    parameters: {
      query?: {
        page?: components['parameters']['Page'];
        pageSize?: components['parameters']['DirectoryPageSize'];
        query?: components['parameters']['Query'];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['MemberPageResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      428: components['responses']['Error428'];
      429: components['responses']['Error429'];
      503: components['responses']['Error503'];
    };
  };
  getMember: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          'Cache-Control': components['headers']['NoStore'];
          ETag: components['headers']['ETag'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['MemberResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      428: components['responses']['Error428'];
      429: components['responses']['Error429'];
      503: components['responses']['Error503'];
    };
  };
  getCsrf: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['CsrfResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      428: components['responses']['Error428'];
      429: components['responses']['Error429'];
      503: components['responses']['Error503'];
    };
  };
  adminLogin: {
    parameters: {
      query?: never;
      header: {
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AdminLoginInput'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminAuthResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      428: components['responses']['Error428'];
      429: components['responses']['Error429'];
      503: components['responses']['Error503'];
    };
  };
  activateAdmin: {
    parameters: {
      query?: never;
      header: {
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ActivationInput'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminAuthResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      428: components['responses']['Error428'];
      429: components['responses']['Error429'];
      503: components['responses']['Error503'];
    };
  };
  recoverAdminPassword: {
    parameters: {
      query?: never;
      header: {
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AdminPasswordRecoveryInput'];
      };
    };
    responses: {
      /** @description 密码已重设，需重新登录 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['EmptyResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      422: components['responses']['Error422'];
      429: components['responses']['Error429'];
      503: components['responses']['Error503'];
    };
  };
  listAdminAccounts: {
    parameters: {
      query?: {
        page?: number;
        pageSize?: 20 | 50;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 管理员账号页 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminAccountPageResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      503: components['responses']['Error503'];
    };
  };
  inviteAdminAccount: {
    parameters: {
      query?: never;
      header: {
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AdminInvitationInput'];
      };
    };
    responses: {
      /** @description 待激活账号及一次性邀请凭证 */
      201: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminInvitationResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      409: components['responses']['Error409'];
      503: components['responses']['Error503'];
    };
  };
  disableAdminAccount: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 已停用账号及新版本 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminAccountMutationResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      428: components['responses']['Error428'];
      503: components['responses']['Error503'];
    };
  };
  updateAdminAccess: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AdminAccessUpdateInput'];
      };
    };
    responses: {
      /** @description 更新后的账号状态和版本 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminAccountMutationResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      428: components['responses']['Error428'];
      503: components['responses']['Error503'];
    };
  };
  listAdminRecapTasks: {
    parameters: {
      query?: {
        page?: number;
        pageSize?: 20 | 50;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 回顾待办分页 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminRecapTaskPageResponse'];
        };
      };
      401: components['responses']['Error401'];
    };
  };
  listAdminAuditLogs: {
    parameters: {
      query?: {
        actorId?: number;
        action?: string;
        objectType?:
          | 'ADMIN'
          | 'APPLICATION'
          | 'MEMBER_PROFILE'
          | 'ACTIVITY'
          | 'REGISTRATION'
          | 'ACTIVITY_REGISTRATION'
          | 'ANNOUNCEMENT'
          | 'ACTIVITY_RECAP'
          | 'FEEDBACK'
          | 'MEDIA_ASSET'
          | 'SCOPE_SET';
        objectId?: number;
        result?: 'SUCCESS' | 'DENIED' | 'FAILED';
        from?: string;
        to?: string;
        page?: number;
        pageSize?: 20 | 50;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 分页审计日志 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminAuditLogPageResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      503: components['responses']['Error503'];
    };
  };
  getAdminDashboard: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 工作台数据；每一指标保留独立授权和查询状态 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminWorkbenchViewResponse'];
        };
      };
      401: components['responses']['Error401'];
    };
  };
  listAdminAnnouncements: {
    parameters: {
      query?: {
        page?: number;
        pageSize?: 20 | 50;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 公告目录分页 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminAnnouncementPageResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
    };
  };
  createAdminAnnouncement: {
    parameters: {
      query?: never;
      header: {
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
      };
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 草稿已创建或幂等重放 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AnnouncementCreatedResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      409: components['responses']['Error409'];
    };
  };
  getAdminAnnouncementDraft: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 草稿和版本信息 */
      200: {
        headers: {
          ETag: components['headers']['ETag'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AnnouncementDraftViewResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
    };
  };
  updateAdminAnnouncementDraft: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
      };
      path: {
        id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AnnouncementDraftInput'];
      };
    };
    responses: {
      /** @description 草稿已保存 */
      200: {
        headers: {
          ETag: components['headers']['ETag'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AnnouncementDraftViewResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      428: components['responses']['Error428'];
    };
  };
  previewAdminAnnouncement: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AnnouncementPreviewInput'];
      };
    };
    responses: {
      /** @description 管理端草稿预览 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AnnouncementPreviewResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
    };
  };
  publishAdminAnnouncement: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
      };
      path: {
        id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AnnouncementPublishInput'];
      };
    };
    responses: {
      /** @description 发布成功或幂等重放 */
      200: {
        headers: {
          ETag: components['headers']['ETag'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AnnouncementMutationResultResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      409: components['responses']['Error409'];
      428: components['responses']['Error428'];
    };
  };
  withdrawAdminAnnouncement: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
      };
      path: {
        id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AnnouncementWithdrawInput'];
      };
    };
    responses: {
      /** @description 撤下成功或幂等重放 */
      200: {
        headers: {
          ETag: components['headers']['ETag'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AnnouncementMutationResultResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      409: components['responses']['Error409'];
      428: components['responses']['Error428'];
    };
  };
  listAdminActivities: {
    parameters: {
      query?: {
        page?: number;
        pageSize?: 20 | 50;
        publicationState?: 'DRAFT' | 'PUBLISHED';
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 当前授权范围内的活动分页 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminActivityPageResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      503: components['responses']['Error503'];
    };
  };
  createAdminActivityDraft: {
    parameters: {
      query?: never;
      header: {
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path?: never;
      cookie?: never;
    };
    requestBody?: {
      content: {
        'application/json': components['schemas']['ActivityDraftInput'];
      };
    };
    responses: {
      /** @description 已创建活动及其个人活动范围 */
      201: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminActivityCreatedResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      409: components['responses']['Error409'];
      503: components['responses']['Error503'];
    };
  };
  getAdminActivity: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 管理活动详情 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          ETag?: string;
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminActivityViewResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      503: components['responses']['Error503'];
    };
  };
  previewAdminActivityRecap: {
    parameters: {
      query?: never;
      header: {
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ActivityRecapPreviewInput'];
      };
    };
    responses: {
      /** @description 管理员私有预览 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ActivityRecapPreviewResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      503: components['responses']['Error503'];
    };
  };
  publishAdminActivityRecap: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ActivityRecapPublishInput'];
      };
    };
    responses: {
      /** @description 回顾已发布 */
      200: {
        headers: {
          ETag?: string;
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ActivityRecapMutationResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      428: components['responses']['Error428'];
      503: components['responses']['Error503'];
    };
  };
  withdrawAdminActivityRecap: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ActivityRecapWithdrawInput'];
      };
    };
    responses: {
      /** @description 回顾已撤下 */
      200: {
        headers: {
          ETag?: string;
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ActivityRecapMutationResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      428: components['responses']['Error428'];
      503: components['responses']['Error503'];
    };
  };
  getAdminActivityRecapDraft: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 当前线上状态与回顾草稿 */
      200: {
        headers: {
          ETag?: string;
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ActivityRecapDraftResponse'];
        };
      };
      401: components['responses']['Error401'];
      404: components['responses']['Error404'];
      503: components['responses']['Error503'];
    };
  };
  updateAdminActivityRecapDraft: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ActivityRecapDraftInput'];
      };
    };
    responses: {
      /** @description 草稿已保存 */
      200: {
        headers: {
          ETag?: string;
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ActivityRecapDraftResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      428: components['responses']['Error428'];
      503: components['responses']['Error503'];
    };
  };
  getAdminActivityDraft: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 活动草稿及当前版本 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          ETag?: string;
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminActivityDraftResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      503: components['responses']['Error503'];
    };
  };
  updateAdminActivityDraft: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ActivityDraftInput'];
      };
    };
    responses: {
      /** @description 已保存草稿和新版本 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          ETag?: string;
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminActivityDraftResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      428: components['responses']['Error428'];
      503: components['responses']['Error503'];
    };
  };
  publishAdminActivity: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ActivityPublishInput'];
      };
    };
    responses: {
      /** @description 活动已发布 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          ETag?: string;
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ActivityPublishedResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      503: components['responses']['Error503'];
    };
  };
  cancelAdminActivity: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ActivityCancellationInput'];
      };
    };
    responses: {
      /** @description 活动及其有效报名已取消 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          ETag: components['headers']['ETag'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ActivityCancelledResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      428: components['responses']['Error428'];
      503: components['responses']['Error503'];
    };
  };
  previewAdminActivityPublish: {
    parameters: {
      query?: never;
      header: {
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ActivityPublishPreviewInput'];
      };
    };
    responses: {
      /** @description 草稿通过发布前校验及确认摘要 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ActivityPublishPreviewResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      503: components['responses']['Error503'];
    };
  };
  previewActivityCheckin: {
    parameters: {
      query?: never;
      header: {
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['CheckinTokenInput'];
      };
    };
    responses: {
      /** @description 签到核对摘要 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['CheckinPreviewResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      404: components['responses']['Error404'];
      503: components['responses']['Error503'];
    };
  };
  confirmActivityCheckin: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['CheckinConfirmationInput'];
      };
    };
    responses: {
      /** @description 已签到、已签到结果或幂等重放 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['CheckinMutationResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      428: components['responses']['Error428'];
      503: components['responses']['Error503'];
    };
  };
  manuallyCheckinActivityRegistration: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ManualCheckinInput'];
      };
    };
    responses: {
      /** @description 已补签、此前已签到或幂等重放 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['CheckinMutationResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      428: components['responses']['Error428'];
      503: components['responses']['Error503'];
    };
  };
  listAdminActivityRegistrations: {
    parameters: {
      query?: {
        status?: 'ACTIVE' | 'CANCELLED' | 'EVENT_CANCELLED';
        query?: string;
        page?: number;
        pageSize?: 20 | 50;
      };
      header?: never;
      path: {
        activityId: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 报名分页、有效人数和签到人数 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminRegistrationPageResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      404: components['responses']['Error404'];
      503: components['responses']['Error503'];
    };
  };
  getAdminActivityRegistration: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        activityId: components['schemas']['Id'];
        registrationId: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 报名及历史详情 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminRegistrationDetailResponse'];
        };
      };
      401: components['responses']['Error401'];
      404: components['responses']['Error404'];
      503: components['responses']['Error503'];
    };
  };
  revealRegistrationPhone: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        activityId: components['schemas']['Id'];
        registrationId: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['PhoneAccessInput'];
      };
    };
    responses: {
      /** @description 已审计的完整联系电话 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminPhoneAccessResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      422: components['responses']['Error422'];
      503: components['responses']['Error503'];
    };
  };
  cancelAdminActivityRegistration: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        activityId: components['schemas']['Id'];
        registrationId: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AdminRegistrationCancellationInput'];
      };
    };
    responses: {
      /** @description 报名已取消及最新活动统计 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          ETag: components['headers']['ETag'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminRegistrationCancelledResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      428: components['responses']['Error428'];
      503: components['responses']['Error503'];
    };
  };
  listAdminScopes: {
    parameters: {
      query: {
        domain: 'MEMBERSHIP' | 'FEEDBACK';
        page?: number;
        pageSize?: 20 | 50;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 范围集分页 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminScopeSetPageResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      503: components['responses']['Error503'];
    };
  };
  createAdminScope: {
    parameters: {
      query?: never;
      header: {
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AdminScopeCreateInput'];
      };
    };
    responses: {
      /** @description 已创建的成员区域范围集 */
      201: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminScopeSetResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      503: components['responses']['Error503'];
    };
  };
  updateAdminScope: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AdminScopeUpdateInput'];
      };
    };
    responses: {
      /** @description 已更新范围集及新版本 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          ETag?: string;
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminScopeSetResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      428: components['responses']['Error428'];
      503: components['responses']['Error503'];
    };
  };
  disableAdminScope: {
    parameters: {
      query?: never;
      header: {
        /** @description 缺少返回428；版本不匹配返回409。 */
        'If-Match': components['parameters']['IfMatch'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 已停用范围集 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          ETag?: string;
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminScopeSetResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      428: components['responses']['Error428'];
      503: components['responses']['Error503'];
    };
  };
  issueAdminPasswordReset: {
    parameters: {
      query?: never;
      header: {
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 已签发，凭证有效30分钟 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['PasswordResetCredentialResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      503: components['responses']['Error503'];
    };
  };
  livenessProbe: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['HealthResponse'];
        };
      };
      /** @description 依赖不可用 */
      503: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['HealthResponse'];
        };
      };
    };
  };
  readinessProbe: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['HealthResponse'];
        };
      };
      /** @description 依赖不可用 */
      503: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['HealthResponse'];
        };
      };
    };
  };
  adminLogout: {
    parameters: {
      query?: never;
      header: {
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['EmptyResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      428: components['responses']['Error428'];
      429: components['responses']['Error429'];
      503: components['responses']['Error503'];
    };
  };
  getAdminMe: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          'X-Request-ID': components['headers']['RequestId'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminMeResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      428: components['responses']['Error428'];
      429: components['responses']['Error429'];
      503: components['responses']['Error503'];
    };
  };
  createAppMediaUpload: {
    parameters: {
      query?: never;
      header: {
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
      };
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AppMediaUploadInput'];
      };
    };
    responses: {
      /** @description 上传资产已预留 */
      201: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminMediaUploadResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      /** @description 声明文件大小超过5MiB */
      413: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 文件类型不支持 */
      415: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      429: components['responses']['Error429'];
      503: components['responses']['Error503'];
    };
  };
  getAppMediaStatus: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 当前处理状态 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminMediaStatusResponse'];
        };
      };
      401: components['responses']['Error401'];
      404: components['responses']['Error404'];
      503: components['responses']['Error503'];
    };
  };
  createAppMediaUploadCredential: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 短时上传指令 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminMediaUploadCredentialResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      503: components['responses']['Error503'];
    };
  };
  completeAppMediaUpload: {
    parameters: {
      query?: never;
      header: {
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
      };
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 对象元数据已验证并排入异步处理，或返回此前相同请求结果 */
      202: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminMediaUploadCompleteResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      /** @description 服务端观察到的对象大小或Content-Type与预约不符 */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminMediaUploadCompleteResponse'];
        };
      };
      503: components['responses']['Error503'];
    };
  };
  createAdminMediaUpload: {
    parameters: {
      query?: never;
      header: {
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AdminMediaUploadInput'];
      };
    };
    responses: {
      /** @description 上传资产已预留 */
      201: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminMediaUploadResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      /** @description 声明文件大小超过10MiB */
      413: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description 文件类型不支持 */
      415: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      429: components['responses']['Error429'];
      503: components['responses']['Error503'];
    };
  };
  getAdminMediaStatus: {
    parameters: {
      query?: never;
      header: {
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 当前处理状态 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminMediaStatusResponse'];
        };
      };
      401: components['responses']['Error401'];
      404: components['responses']['Error404'];
      503: components['responses']['Error503'];
    };
  };
  createAdminMediaUploadCredential: {
    parameters: {
      query?: never;
      header: {
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 短时上传指令 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminMediaUploadCredentialResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      503: components['responses']['Error503'];
    };
  };
  completeAdminMediaUpload: {
    parameters: {
      query?: never;
      header: {
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['schemas']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 上传对象已登记为READY，或返回此前相同请求结果；保留202响应以兼容既有客户端 */
      202: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminMediaUploadCompleteResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      /** @description 服务端观察到的对象大小或Content-Type与预约不符 */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminMediaUploadCompleteResponse'];
        };
      };
      503: components['responses']['Error503'];
    };
  };
  previewAdminExport: {
    parameters: {
      query?: never;
      header: {
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AdminExportRequest'];
      };
    };
    responses: {
      /** @description 不创建任务的范围过滤预览 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminExportPreviewResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      422: components['responses']['Error422'];
      503: components['responses']['Error503'];
    };
  };
  listAdminExports: {
    parameters: {
      query?: {
        page?: number;
        pageSize?: 20 | 50;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 不含筛选明细或COS对象键 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminExportTaskPageResponse'];
        };
      };
      401: components['responses']['Error401'];
      503: components['responses']['Error503'];
    };
  };
  createAdminExport: {
    parameters: {
      query?: never;
      header: {
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AdminExportRequest'];
      };
    };
    responses: {
      /** @description 已排队或返回相同幂等请求任务 */
      202: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminExportTaskResponse'];
        };
      };
      400: components['responses']['Error400'];
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      409: components['responses']['Error409'];
      422: components['responses']['Error422'];
      503: components['responses']['Error503'];
    };
  };
  getAdminExport: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 任务摘要不暴露文件地址、对象键或导出筛选明细 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminExportTaskResponse'];
        };
      };
      401: components['responses']['Error401'];
      404: components['responses']['Error404'];
      503: components['responses']['Error503'];
    };
  };
  retryAdminExport: {
    parameters: {
      query?: never;
      header: {
        /** @description 同键异参409；有效期7天；重放响应提示重新读取资源。 */
        'Idempotency-Key': components['parameters']['IdempotencyKey'];
        'X-CSRF-Token': components['parameters']['CsrfToken'];
        /** @description 必须与配置的后台 HTTPS Origin 完全相同。 */
        Origin: components['parameters']['Origin'];
      };
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 已重新排队；当前管理员、原授权范围和完整电话授权会重新校验 */
      202: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AdminExportTaskResponse'];
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      503: components['responses']['Error503'];
    };
  };
  downloadAdminExport: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['Id'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 私有XLSX文件流 */
      200: {
        headers: {
          'Cache-Control': components['headers']['NoStore'];
          'X-Content-Type-Options'?: 'nosniff';
          'Content-Disposition'?: string;
          [name: string]: unknown;
        };
        content: {
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': string;
        };
      };
      401: components['responses']['Error401'];
      403: components['responses']['Error403'];
      404: components['responses']['Error404'];
      409: components['responses']['Error409'];
      503: components['responses']['Error503'];
    };
  };
}

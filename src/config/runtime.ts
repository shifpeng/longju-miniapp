// 仅公开配置，绝不能放 AppSecret、COS 密钥或数据库凭据。
// 正式构建前填写已备案 HTTPS 域名。协议未发布时版本/正文留空，不阻碍申请。
// 发布协议时同步配置后端 agreement-version，再填写完整正文与相同版本。
declare const __LONGJU_API_ORIGIN__: string | undefined;

export const runtime = {
  apiOrigin:
    typeof __LONGJU_API_ORIGIN__ === 'string'
      ? __LONGJU_API_ORIGIN__
      : 'https://admin.datrixtech.com',
  agreement: { version: '', title: '加入须知与隐私说明', body: '' },
};

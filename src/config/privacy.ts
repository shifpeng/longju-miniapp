/**
 * Publication facts confirmed by the operator and configured for this release.
 */
export const privacyPublication = {
  status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
  version: '1.0',
  effectiveDate: '2026-10-27',
  controllerName: '石福鹏',
  contact: 'shifpeng@163.com',
  retention: {
    applications: '账号注销前持续保存；注销后按账号清理流程删除或去标识化',
    memberProfiles: '账号注销前持续保存；注销后按账号清理流程删除或去标识化',
    registrationsAndCheckins: '账号注销前持续保存；注销后清除身份关联，必要活动历史去标识化保留',
    feedback: '账号注销前持续保存；注销后按账号清理流程删除或去标识化',
    operationLogs: '运行日志和安全审计日志自生成之日起保存1年，期满后删除',
  },
};

export function privacyPublicationMissing() {
  const fields: [string, string][] = [
    ['版本号', privacyPublication.version],
    ['生效日期', privacyPublication.effectiveDate],
    ['微信认证主体全称', privacyPublication.controllerName],
    ['隐私联系渠道', privacyPublication.contact],
    ['申请资料保存期限', privacyPublication.retention.applications],
    ['成员资料保存期限', privacyPublication.retention.memberProfiles],
    ['报名与签到记录保存期限', privacyPublication.retention.registrationsAndCheckins],
    ['反馈内容保存期限', privacyPublication.retention.feedback],
    ['安全与运行日志保存期限', privacyPublication.retention.operationLogs],
  ];
  return fields.filter(([, value]) => !value.trim()).map(([label]) => label);
}

export function isPrivacyPublicationReady() {
  return privacyPublication.status === 'PUBLISHED' && privacyPublicationMissing().length === 0;
}

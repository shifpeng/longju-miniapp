import assert from 'node:assert/strict';
import { readFile, readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const json = async (file) => JSON.parse(await readFile(file, 'utf8'));
const project = await json('project.config.json');
const app = await json('dist/app.json');
const contract = await json('docs/contract-version.json');
const { runtime } = require('../dist/config/runtime.js');
const { privacyPublication, isPrivacyPublicationReady } = require('../dist/config/privacy.js');
assert.match(project.appid, /^wx[0-9a-f]{16}$/i, '请配置正式小程序AppID');
assert.equal(project.setting.urlCheck, true, '请开启合法域名校验');
try {
  const privateProject = await json('project.private.config.json');
  assert.notEqual(privateProject.setting?.urlCheck, false, '本机开发者工具仍关闭了合法域名校验');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
assert.equal(runtime.apiOrigin, 'https://admin.datrixtech.com', '构建产物未使用正式API域名');
assert.ok(isPrivacyPublicationReady(), '隐私指引尚未完成发布配置');
assert.ok(app.pages.includes('pages/privacy/index'), '代码包缺少隐私指引页面');
assert.ok(app.pages.includes('pages/account/index'), '代码包缺少账号注销页面');
assert.equal(app.tabBar.list.length, 4, '底部导航必须为四项');

async function files(folder) {
  return (
    await Promise.all(
      (await readdir(folder, { withFileTypes: true })).map((entry) => {
        const file = join(folder, entry.name);
        return entry.isDirectory() ? files(file) : [file];
      }),
    )
  ).flat();
}
const packageFiles = await files('dist');
let packageBytes = 0;
for (const file of packageFiles) {
  assert.ok(
    !/(?:^|\/)(?:\.env(?:\.[^/]*)?|application-[^/]*\.ya?ml)$|\.(?:pem|key|p12|ts)$|\.test\./i.test(
      file,
    ),
    `代码包含非发布文件：${file}`,
  );
  packageBytes += (await stat(file)).size;
  if (/\.(?:js|json|wxml|wxss)$/.test(file)) {
    const content = await readFile(file, 'utf8');
    assert.ok(
      !/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bAKID[A-Za-z0-9]{20,}\b/.test(content),
      `代码包疑似包含私有凭据：${file}`,
    );
  }
}
assert.ok(packageBytes < 2 * 1024 * 1024, '代码包超过2MiB');
const report = {
  checkedAt: new Date().toISOString(),
  scope: 'local-package-only',
  appId: project.appid,
  apiOrigin: runtime.apiOrigin,
  privacyNoticeVersion: privacyPublication.version,
  contractVersion: contract.version,
  pages: app.pages.length,
  packageBytes,
  wechatPlatformAndAuthenticatedProductionFlowsVerified: false,
};
await mkdir('artifacts', { recursive: true });
await writeFile('artifacts/release-check.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));

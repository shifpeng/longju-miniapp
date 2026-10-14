import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const app = JSON.parse(readFileSync('dist/app.json', 'utf8'));
test('all declared native pages/components are built and four tabs have readable labels/icons', () => {
  assert.equal(app.tabBar.list.length, 4);
  assert.deepEqual(
    app.tabBar.list.map((x: any) => x.text),
    ['首页', '老乡录', '活动', '我的'],
  );
  for (const page of app.pages) {
    for (const ext of ['.js', '.wxml', '.json'])
      assert.ok(existsSync('dist/' + page + ext), page + ext);
  }
  for (const component of Object.values(app.usingComponents)) {
    for (const ext of ['.js', '.wxml', '.json'])
      assert.ok(existsSync('dist' + component + ext), String(component) + ext);
  }
  for (const tab of app.tabBar.list) {
    assert.ok(existsSync('dist/' + tab.iconPath));
    assert.ok(existsSync('dist/' + tab.selectedIconPath));
  }
});
test('package remains below 2 MiB and excludes test/config secrets', () => {
  function files(path: string): string[] {
    return readdirSync(path).flatMap((p) =>
      statSync(join(path, p)).isDirectory() ? files(join(path, p)) : [join(path, p)],
    );
  }
  const all = files('dist');
  const size = all.reduce((sum, p) => sum + statSync(p).size, 0);
  assert.ok(size < 2 * 1024 * 1024, `package ${size} bytes`);
  assert.ok(all.every((p) => !p.includes('.test.') && !p.includes('.env') && !p.endsWith('.ts')));
});

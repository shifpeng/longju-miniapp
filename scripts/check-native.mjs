import { readdir, access, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve, join } from 'node:path';
const bin =
  process.env.WECHAT_COMPILER_DIR ||
  '/Applications/wechatwebdevtools.app/Contents/Resources/package.nw/node_modules/wcc-exec';
async function files(dir) {
  return (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map((e) =>
        e.isDirectory() ? files(join(dir, e.name)) : join(dir, e.name),
      ),
    )
  ).flat();
}
await mkdir('artifacts/native', { recursive: true });
for (const [tool, extension] of [
  ['wcc', '.wxml'],
  ['wcsc', '.wxss'],
]) {
  await access(join(bin, tool));
  const inputs = (await files('dist')).filter((p) => p.endsWith(extension)).map((p) => p.slice(5));
  const result = spawnSync(
    join(bin, tool),
    ['-o', resolve(`artifacts/native/${tool}.js`), ...inputs],
    { cwd: 'dist', encoding: 'utf8' },
  );
  if (result.status !== 0) throw new Error(`${tool}: ${result.stderr || result.stdout}`);
  console.log(`${tool}: ${inputs.length} files compiled`);
}

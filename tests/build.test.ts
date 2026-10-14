import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';

test('rebuilding keeps declared pages readable and does not rewrite unchanged assets', async () => {
  const manifest = JSON.parse(readFileSync('dist/app.json', 'utf8'));
  const paths = [
    'dist/app.json',
    ...manifest.pages.flatMap((page: string) =>
      ['.js', '.json', '.wxml'].map((extension) => `dist/${page}${extension}`),
    ),
  ];
  const timestamps = paths.map((path) => statSync(path).mtimeMs);
  const missing = new Set<string>();
  writeFileSync('dist/obsolete-build-test.js', '// obsolete output');
  const sample = setInterval(() => {
    for (const path of paths) if (!existsSync(path)) missing.add(path);
  }, 1);
  try {
    await new Promise<void>((resolve, reject) => {
      const process = spawn('node', ['scripts/build.mjs'], { stdio: 'pipe' });
      let error = '';
      process.stderr.on('data', (chunk) => {
        error += chunk;
      });
      process.on('error', reject);
      process.on('close', (code) => (code === 0 ? resolve() : reject(new Error(error))));
    });
  } finally {
    clearInterval(sample);
  }
  assert.deepEqual([...missing], [], 'IDE must not observe missing pages during a rebuild');
  assert.deepEqual(
    paths.map((path) => statSync(path).mtimeMs),
    timestamps,
  );
  assert.equal(existsSync('dist/obsolete-build-test.js'), false);
});

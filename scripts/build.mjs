import { build, context } from 'esbuild';
import { mkdir, readdir, readFile, rename, rm, watch, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
const watching = process.argv.includes('--watch');
const release = process.argv.includes('--release');
const productionOrigin = 'https://admin.datrixtech.com';
const apiOrigin = process.env.LONGJU_API_ORIGIN || productionOrigin;
if (release && apiOrigin !== productionOrigin)
  throw new Error('提审构建仅允许正式API域名，请清除LONGJU_API_ORIGIN后重新构建。');
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) => (e.isDirectory() ? files(join(dir, e.name)) : join(dir, e.name))),
    )
  ).flat();
}
// Keep the previous package readable while the IDE watches dist. Rename complete
// files into place, and publish app.json only after every page is available.
async function replaceFile(path, contents) {
  try {
    if ((await readFile(path)).equals(Buffer.from(contents))) return;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  await mkdir(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.tmp`;
  await writeFile(temporary, contents);
  await rename(temporary, path);
}
const all = await files('src');
const vendor = await build({
  entryPoints: ['node_modules/qrcode-generator/dist/qrcode.js'],
  outfile: 'dist/vendor/qrcode.js',
  bundle: true,
  platform: 'neutral',
  format: 'cjs',
  write: false,
});
let publication = Promise.resolve();
let javascript = [];
function publish() {
  publication = publication.then(async () => {
    const assets = (await files('src')).filter((file) => !file.endsWith('.ts'));
    const outputs = [...vendor.outputFiles, ...javascript];
    for (const output of outputs) await replaceFile(output.path, output.contents);
    for (const file of assets.filter((file) => file !== 'src/app.json'))
      await replaceFile(file.replace(/^src/, 'dist'), await readFile(file));
    await replaceFile('dist/app.json', await readFile('src/app.json'));
    // Remove obsolete files after publishing the new manifest, never before.
    const expected = new Set([
      ...outputs.map((output) => relative(resolve('dist'), output.path)),
      ...assets.map((file) => relative('src', file)),
    ]);
    for (const file of await files('dist'))
      if (!file.endsWith('.tmp') && !expected.has(relative('dist', file)))
        await rm(file, { force: true });
  });
  return publication;
}
const entryPoints = all.filter((f) => f.endsWith('.ts') && !f.endsWith('.d.ts'));
const options = {
  entryPoints,
  outdir: 'dist',
  outbase: 'src',
  bundle: false,
  platform: 'neutral',
  format: 'cjs',
  target: 'es2020',
  logLevel: 'info',
  write: false,
  plugins: [
    {
      name: 'publish-complete-files',
      setup(builder) {
        builder.onEnd(async (result) => {
          if (result.errors.length) return;
          javascript = result.outputFiles;
          await publish();
        });
      },
    },
  ],
  define: {
    __LONGJU_API_ORIGIN__: JSON.stringify(apiOrigin),
  },
};
if (watching) {
  const ctx = await context(options);
  await ctx.rebuild();
  await ctx.watch();
  for await (const event of watch('src', { recursive: true }))
    if (event.filename && !event.filename.endsWith('.ts')) await publish();
} else await build(options);

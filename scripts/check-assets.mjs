import { readdir, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';

// Match the installed WeChat DevTools IMAGE_AND_AUDIO_LIMIT check: total bytes,
// including subdirectories, must be strictly below 200 KiB.
const extensions = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.svg',
  '.webp',
  '.gif',
  '.flac',
  '.m4a',
  '.ogg',
  '.ape',
  '.amr',
  '.wma',
  '.wav',
  '.mp3',
  '.mp4',
  '.aac',
  '.aiff',
  '.caf',
]);
async function mediaFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return mediaFiles(path);
      return extensions.has(extname(path).toLowerCase())
        ? [{ path, size: (await stat(path)).size }]
        : [];
    }),
  );
  return files.flat();
}
for (const root of ['src', 'dist']) {
  const files = await mediaFiles(root);
  const total = files.reduce((sum, file) => sum + file.size, 0);
  console.log(`${root}: ${files.length} media files, ${(total / 1024).toFixed(2)} / 200 KiB`);
  if (total >= 200 * 1024) {
    for (const file of files.sort((a, b) => b.size - a.size))
      console.error(`${file.path}: ${(file.size / 1024).toFixed(2)} KiB`);
    process.exitCode = 1;
  }
}

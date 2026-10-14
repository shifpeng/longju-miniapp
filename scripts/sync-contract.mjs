import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import openapiTS, { astToString } from 'openapi-typescript';
import { parse } from 'yaml';
const path = process.argv[2];
if (!path) throw new Error('用法: npm run contract:sync -- /绝对路径/openapi.yaml');
const source = await readFile(path, 'utf8');
const contract = parse(source);
await writeFile('src/api/schema.d.ts', astToString(await openapiTS(contract)));
await writeFile(
  'docs/contract-version.json',
  JSON.stringify(
    { version: contract.info.version, sha256: createHash('sha256').update(source).digest('hex') },
    null,
    2,
  ) + '\n',
);

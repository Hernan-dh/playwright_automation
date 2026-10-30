import fs from 'node:fs/promises';
import path from 'node:path';

export default async function globalTeardown() {
  await fs.rm(path.resolve('storage-state', 'run-metadata.json'), { force: true });
}

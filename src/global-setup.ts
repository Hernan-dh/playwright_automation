import fs from 'node:fs/promises';
import path from 'node:path';

export default async function globalSetup() {
  const directory = path.resolve('storage-state');
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, 'run-metadata.json'), JSON.stringify({ startedBy: 'playwright', ci: !!process.env.CI }));
}

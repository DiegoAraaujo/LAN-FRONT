import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const frontend = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const backend = resolve(frontend, '../lan-back');
const checking = process.argv.includes('--check');
const projects = [frontend, backend];

for (const project of projects) {
  if (!existsSync(resolve(project, 'node_modules/prettier/bin/prettier.cjs'))) {
    console.error(`Instale as dependências antes de formatar: ${project}`);
    process.exit(1);
  }
}

function run(project, executable, args) {
  const result = spawnSync(process.execPath, [resolve(project, executable), ...args], {
    cwd: project,
    stdio: 'inherit',
  });
  if (result.error) console.error(result.error.message);
  if (result.status !== 0) process.exit(result.status ?? 1);
}

for (const project of projects) {
  console.log(`\n${checking ? 'Verificando' : 'Formatando'} ${project}`);
  run(project, 'node_modules/prettier/bin/prettier.cjs', [checking ? '--check' : '--write', '.']);
}

if (!checking) {
  run(backend, 'node_modules/prisma/build/index.js', [
    'format',
    '--schema',
    'prisma/schema.prisma',
  ]);
}

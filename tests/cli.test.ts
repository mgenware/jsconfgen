import * as assert from 'assert';
import tempy from 'tempy';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';

const execAsync = promisify(exec);

export async function t(fileName: string, format: string): Promise<void> {
  const tmpFile = tempy.file();
  const cmd = `node "./dist/cli.js" ${format} "./tests/data/src/${fileName}.js" "${tmpFile}"`;
  const expected = `./tests/data/dest/${fileName}.${format}`;
  await execAsync(cmd);
  assert.strictEqual(
    (await readFile(tmpFile, 'utf8')).trim(),
    (await readFile(expected, 'utf8')).trim(),
  );
}

it('JSON', async () => {
  await t('common', 'json');
});

it('YAML', async () => {
  await t('common', 'yaml');
});

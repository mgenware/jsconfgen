import * as assert from 'assert';
import tempy from 'tempy';
import { readFile } from 'fs/promises';
import jsconfgen, { Options } from '../dist/main.js';

export async function t(fileName: string, format: string, opt?: Options): Promise<void> {
  const tmpFile = tempy.file();
  const expected = `./tests/data/dest/${fileName}.${format}`;
  await jsconfgen(format, `./tests/data/src/${fileName}.js`, tmpFile, opt);
  assert.strictEqual(
    (await readFile(tmpFile, 'utf8')).trim(),
    (await readFile(expected, 'utf8')).trim(),
  );
}

it('JSON (API)', async () => {
  await t('common', 'json');
});

it('YAML (API)', async () => {
  await t('common', 'yaml');
});

it('Header and footer', async () => {
  await t('headerFooter', 'yaml', { header: '# header\n', footer: '# footer\n' });
});

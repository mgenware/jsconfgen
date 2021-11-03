import * as yaml from 'js-yaml';
import { writeFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import nodePath from 'path';

const dirname = nodePath.dirname(fileURLToPath(import.meta.url));

function normalizeImport(path: string): string {
  // eslint-disable-next-line no-param-reassign
  path = nodePath.relative(dirname, path);
  if (process.platform === 'win32') {
    return path.split(nodePath.sep).join(nodePath.posix.sep);
  }
  return path;
}

export interface Options {
  header?: string;
  footer?: string;
}

export default async function convert(format: string, src: string, dest: string, opt?: Options) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const srcData = (await import(normalizeImport(src)))?.default ?? '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let destText = '';
  switch (format.toLowerCase()) {
    case 'json':
      destText = JSON.stringify(srcData, null, 2);
      break;

    case 'yaml':
      destText = yaml.dump(srcData);
      break;

    default:
      throw new Error(`Unsupported format "${format}"`);
  }
  await mkdir(nodePath.dirname(dest), { recursive: true });
  // eslint-disable-next-line no-param-reassign
  opt ??= {};
  if (opt.header) {
    destText = opt.header + destText;
  }
  if (opt.footer) {
    destText += opt.footer;
  }
  await writeFile(dest, destText);
}

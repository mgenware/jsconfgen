#!/usr/bin/env node
import { readFile } from 'fs/promises';
import nodePath from 'path';
import { fileURLToPath } from 'url';
import errMsg from 'catch-err-msg';
import convert from './main.js';

const dirname = nodePath.dirname(fileURLToPath(import.meta.url));
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const pkg = JSON.parse(await readFile(nodePath.join(dirname, '../package.json'), 'utf8'));

const args = process.argv.slice(2);

function printUsage() {
  // eslint-disable-next-line no-console
  console.log(`
    Usage
      $ ${pkg.name} [options] <format> <src> <dest>
    Format
      JSON or YAML
    Options
      --version, -v  Print version information
      
  `);
}

if (args[0] === '--help') {
  printUsage();
  process.exit(0);
}

if (args[0] === '-v' || args[0] === '--version') {
  // eslint-disable-next-line no-console
  console.log(pkg.version);
  process.exit(0);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    const [format, src, dest] = args;
    if (!format || !src || !dest) {
      printUsage();
      throw new Error('Invalid arguments');
    }
    await convert(format, src, dest);
  } catch (err) {
    console.error(`Error: ${errMsg(err)}`);
    process.exit(1);
  }
})();

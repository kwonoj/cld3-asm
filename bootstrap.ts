/*tslint:disable:no-console*/

/**
 * Script to download cld3 wasm binary from https://github.com/kwonoj/docker-cld3-wasm.
 */

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { exec, mkdir, rm } from 'shelljs';
import { promisify } from 'util';
//tslint:disable-next-line: no-require-imports no-var-requires
const { config } = require('./package.json');

// Package.json defines `cld3-version` under `config` section to find corresponding release version
const version = config['cld3-version'];
const readFile = promisify(fs.readFile);
const asyncExec = promisify(exec);

/**
 * Generate sha512 checksum from given file.
 */
const calculateChecksumFromFile = async (filePath: string) =>
  crypto
    .createHash('sha512')
    .update(await readFile(filePath))
    .digest('hex');

/**
 * Get remote release checksum.
 */
const getRemoteChecksum = (url: string) => {
  const { stdout } = exec(`wget -qO- ${url}.sha512`, { silent: true });
  return (stdout as string).slice(0, (stdout as string).indexOf(' '));
};

/**
 * Main script execution
 */
(async () => {
  const libPath = path.resolve('./src/lib');
  const fileNames = ['cld3.js', 'cld3.wasm'];

  for (const fileName of fileNames) {
    const localBinarypath = path.join(libPath, fileName);

    const url = `https://github.com/kwonoj/docker-cld3-wasm/releases/download/${version}/${fileName}`;

    //Create checksum validator
    const remoteChecksum = getRemoteChecksum(url);
    const validateBinary = async () => (await calculateChecksumFromFile(localBinarypath)) === remoteChecksum;
    const isBinaryExists = () => fs.existsSync(localBinarypath);

    if (isBinaryExists() && (await validateBinary())) {
      continue;
    }

    console.log(`Downloading '${url}'`);

    mkdir('-p', libPath);
    rm('-rf', localBinarypath);

    await asyncExec(`wget -q --directory-prefix=${libPath} ${url}`);
    if (!isBinaryExists() || !await validateBinary()) {
      throw new Error(`Downloaded binary checksum mismatch, cannot complete bootstrap`);
    }
  }
})();

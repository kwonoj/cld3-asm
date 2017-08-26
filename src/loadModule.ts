import { CldFactory } from './cldFactory';
import { cldLoader } from './cldLoader';
import { isNode } from './util/isNode';
import { isWasmEnabled } from './util/isWasmEnabled';
import { log } from './util/logger';

/**
 * Asynchronously load and initialize asm module.
 *
 * @param {string} [binaryEndpoint] Provides endpoint to server to download binary module
 * (.wasm, .mem) via fetch when initialize module in a browser environment.
 *
 * @returns {CldFactory} Factory function manages lifecycle of cld3 language identifier.
 */
export const loadModule = async (binaryEndpoint?: string): Promise<CldFactory> => {
  const asmType = isWasmEnabled() ? 'wasm' : 'asm';
  log(`loadModule: load cld3 module loader from `, asmType);

  //tslint:disable-next-line:no-require-imports
  const moduleLoader = require(`./lib/${asmType}/cld3`);
  log(`loadModule: moduleLoader imported`);

  const asmModule = !!binaryEndpoint
    ? moduleLoader({
        locateFile: (fileName: string) =>
          isNode()
            ? //tslint:disable-next-line:no-require-imports
              require('path').join(binaryEndpoint, fileName)
            : `${binaryEndpoint}/${fileName}`
      })
    : moduleLoader();

  await asmModule.initializeRuntime();
  log(`loadModule: initialized cld3 Runtime`);

  return cldLoader(asmModule);
};

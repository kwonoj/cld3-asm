import { CldFactory } from './cldFactory';
import { cldLoader } from './cldLoader';
import { ENVIRONMENT } from './environment';
import { isNode } from './util/isNode';
import { isWasmEnabled } from './util/isWasmEnabled';
import { log } from './util/logger';

/**
 * Asynchronously load and initialize asm module.
 *
 * @param {string} [binaryEndpoint] Provides endpoint to server to download binary module
 * (.wasm, .mem) via fetch when initialize module in a browser environment.
 * @param {ENVIRONMENT} [environment] Override running environment to load binary module.
 * This option is mostly for Electron's renderer process, which is detected as node.js env by default
 * but in case of would like to use fetch to download binary module.
 *
 * @returns {CldFactory} Factory function manages lifecycle of cld3 language identifier.
 */
export const loadModule = async (binaryEndpoint?: string, environment?: ENVIRONMENT): Promise<CldFactory> => {
  const asmType = isWasmEnabled() ? 'wasm' : 'asm';
  log(`loadModule: load cld3 module loader from `, asmType);

  //tslint:disable-next-line:no-require-imports
  const moduleLoader = require(`./lib/${asmType}/cld3`);
  log(`loadModule: moduleLoader imported`);

  const env = environment ? environment : isNode() ? ENVIRONMENT.NODE : ENVIRONMENT.BROWSER;
  log(`loadModule: ${environment ? `using environment override ${environment}` : `running environment is ${env}`}`);

  if (!binaryEndpoint && env === ENVIRONMENT.BROWSER) {
    throw new Error('Cannot download binary module without endpoint on browser');
  }

  const module = { ENVIRONMENT: env };

  const asmModule = !!binaryEndpoint
    ? moduleLoader({
        ...module,
        locateFile: (fileName: string) =>
          env === ENVIRONMENT.NODE
            ? //tslint:disable-next-line:no-require-imports
              require('path').join(binaryEndpoint, fileName)
            : `${binaryEndpoint}/${fileName}`
      })
    : moduleLoader(module);

  await asmModule.initializeRuntime();
  log(`loadModule: initialized cld3 Runtime`);

  return cldLoader(asmModule);
};

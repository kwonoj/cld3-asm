import { ENVIRONMENT, isWasmEnabled } from 'emscripten-wasm-loader';
import { CldFactory } from './cldFactory';
import { getLoader } from './getLoader';
import { log } from './util/logger';

/**
 * Load, initialize wasm / asm.js binary to use actual cld wasm instances.
 *
 * @param {binaryEndpoint} [string] For overring path to wasm binary on node.js or browser.
 * @param {environment} [ENVIRONMENT] For overriding running environment
 *
 * @returns {Promise<CldFactory>} Factory function of cld to allow create instance of cld.
 */
const loadModule: (binaryEndpoint?: string, environment?: ENVIRONMENT) => Promise<CldFactory> = async (
  binaryEndpoint?: string,
  environment?: ENVIRONMENT
) => {
  const binaryPath = `./lib/${isWasmEnabled() ? 'wasm' : 'asm'}`;

  try {
    return await getLoader(binaryPath, binaryEndpoint, environment);
  } catch (e) {
    log(`loadModule: cannot load module from `, binaryPath);

    if (!isWasmEnabled()) {
      throw e;
    } else {
      log(`loadModule: try to fallback to asm.js runtime`);
      return await getLoader(`./lib/asm`, binaryEndpoint, environment);
    }
  }
};

export { loadModule };

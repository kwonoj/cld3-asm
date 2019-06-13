import { getModuleLoader } from 'emscripten-wasm-loader';
import { CldAsmModule } from './cldAsmModule';
import { CldFactory } from './cldFactory';
import { cldLoader } from './cldLoader';
import { log } from './util/logger';

//imports MODULARIZED emscripten preamble
import * as runtime from './lib/node/cld3';

/**
 * Load, initialize wasm binary to use actual cld wasm instances.
 *
 * @param [InitOptions] Options to initialize cld3 wasm binary.
 * @param {number} [InitOptions.timeout] - timeout to wait wasm binary compilation & load.
 * @param {string | object} [InitOptions.locateBinary] - custom resolution logic for wasm binary. (not supported)
 * It could be either remote endpoint url, or loader-returned object for bundler. Check examples/browser_* for references.
 *
 * @returns {() => Promise<CldFactory>} Function to load module
 */
const loadModule = async (
  initOptions: Partial<{
    timeout: number;
  }> = {}
) => {
  const { timeout } = initOptions;

  log(`loadModule: loading cld3 wasm binary`, { initOptions });

  const moduleLoader = await getModuleLoader<CldFactory, CldAsmModule>(
    (runtime: CldAsmModule) => cldLoader(runtime),
    runtime,
    undefined,
    { timeout }
  );

  return moduleLoader();
};

export { loadModule };

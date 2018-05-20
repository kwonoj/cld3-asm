import { ENVIRONMENT, getModuleLoader, isNode } from 'emscripten-wasm-loader';
import { CldAsmModule } from './cldAsmModule';
import { CldFactory } from './cldFactory';
import { cldLoader } from './cldLoader';
import * as runtimeModule from './lib/cld3'; //imports MODULARIZED emscripten preamble
import { log } from './util/logger';
import { wasmVersion } from './wasmVersion';

/**
 * Load, initialize wasm / asm.js binary to use actual cld wasm instances.
 *
 * @param {environment} [ENVIRONMENT] For overriding running environment
 *
 * @returns {(environment?: ENVIRONMENT) => Promise<CldFactory>} Function to load module
 */
const loadModule = async (environment?: ENVIRONMENT, binaryMetadata: Partial<{ filename: string, locationPath: string, endpoint: string }> = {}) => {
  log(`loadModule: loading cld3 module`);

  const binaryPath = `./lib/cld3`;
  //imports MODULARIZED emscripten preamble
  //const runtimeModule = require(binaryPath); //tslint:disable-line:no-require-imports no-var-requires

  const moduleLoader = await getModuleLoader<CldFactory, CldAsmModule>(
    (runtime: CldAsmModule, env: ENVIRONMENT) => cldLoader(runtime, env),
    runtimeModule
  );

  const env = environment ? environment : isNode() ? ENVIRONMENT.NODE : ENVIRONMENT.WEB;
  const { filename, locationPath, endpoint } = binaryMetadata;

  return moduleLoader(environment, {
    ...wasmVersion,
    filename: filename || `${wasmVersion.name}.wasm`,
    //tslint:disable-next-line:no-require-imports no-var-requires
    locationPath: locationPath || (env === ENVIRONMENT.NODE ? require('path').dirname(require.resolve(binaryPath)) : null),
    endpoint
  });
};

export { loadModule };

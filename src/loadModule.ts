import { ENVIRONMENT, getModuleLoader } from 'emscripten-wasm-loader';
import { CldAsmModule } from './cldAsmModule';
import { CldFactory } from './cldFactory';
import { cldLoader } from './cldLoader';
import { log } from './util/logger';

/**
 * Load, initialize wasm / asm.js binary to use actual cld wasm instances.
 *
 * @param {environment} [ENVIRONMENT] For overriding running environment
 *
 * @returns {(environment?: ENVIRONMENT) => Promise<CldFactory>} Function to load module
 */
const loadModule = async (environment?: ENVIRONMENT) => {
  log(`loadModule: loading cld3 module`);

  //imports MODULARIZED emscripten preamble
  const runtimeModule = require(`./lib/cld3`); //tslint:disable-line:no-require-imports no-var-requires

  const moduleLoader = await getModuleLoader<CldFactory, CldAsmModule>(
    (runtime: CldAsmModule, env: ENVIRONMENT) => cldLoader(runtime, env),
    runtimeModule
  );

  return moduleLoader(environment);
};

export { loadModule };

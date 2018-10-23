import { getModuleLoader, isNode } from 'emscripten-wasm-loader';
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
const loadModule = async () => {
  log(`loadModule: loading cld3 module`);

  //imports MODULARIZED emscripten preamble
  const runtimeModule = isNode() ? require(`./lib/cld3_node`) : require(`./lib/cld3_web`); //tslint:disable-line:no-require-imports no-var-requires

  const moduleLoader = await getModuleLoader<CldFactory, CldAsmModule>(
    (runtime: CldAsmModule) => cldLoader(runtime),
    runtimeModule
  );

  return moduleLoader();
};

export { loadModule };

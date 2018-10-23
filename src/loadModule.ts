import { getModuleLoader, isNode } from 'emscripten-wasm-loader';
import { ModuleInitOption } from 'emscripten-wasm-loader/dist/types/getModuleLoader';
import { CldAsmModule } from './cldAsmModule';
import { CldFactory } from './cldFactory';
import { cldLoader } from './cldLoader';
import { log } from './util/logger';

/**
 * Load, initialize wasm / asm.js binary to use actual cld wasm instances.
 *
 * @param {moduleInitOption} [ModuleInitOption] additional option to configure module loader
 *
 * @returns {() => Promise<CldFactory>} Function to load module
 */
const loadModule = async (moduleInitOption?: ModuleInitOption) => {
  log(`loadModule: loading cld3 module`);

  //imports MODULARIZED emscripten preamble
  const runtimeModule = isNode() ? require(`./lib/cld3_node`) : require(`./lib/cld3_web`); //tslint:disable-line:no-require-imports no-var-requires

  const moduleLoader = await getModuleLoader<CldFactory, CldAsmModule>(
    (runtime: CldAsmModule) => cldLoader(runtime),
    runtimeModule,
    undefined,
    moduleInitOption
  );

  return moduleLoader();
};

export { loadModule };

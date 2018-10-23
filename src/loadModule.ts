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
const loadModule = async (moduleInitOption?: Partial<ModuleInitOption>) => {
  log(`loadModule: loading cld3 module`);

  //imports MODULARIZED emscripten preamble
  const runtimeModule = isNode() ? require(`./lib/cld3_node`) : require(`./lib/cld3_web`); //tslint:disable-line:no-require-imports no-var-requires

  // in Browser environment if remote endpoint is not specified cld3-asm overrides preamble's locateFile to provide wasm binary
  // instead of preamble triggers fetch to file:// resource paths.
  // Bundler (i.e webpack) should configure proper loader settings for this.
  const isPathOverrideRequired = !isNode() && (!moduleInitOption || !moduleInitOption.binaryRemoteEndpoint);
  const overriddenModule = !isPathOverrideRequired
    ? undefined
    : {
        locateFile: (filePath: string) =>
          filePath.endsWith('.wasm')
            ? require('./lib/cld3_web.wasm') //tslint:disable-line:no-require-imports no-var-requires
            : filePath
      };

  const moduleLoader = await getModuleLoader<CldFactory, CldAsmModule>(
    (runtime: CldAsmModule) => cldLoader(runtime),
    runtimeModule,
    overriddenModule,
    moduleInitOption
  );

  return moduleLoader();
};

export { loadModule };

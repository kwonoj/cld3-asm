import { ENVIRONMENT, getModuleLoader, isNode } from 'emscripten-wasm-loader';
import { CldAsmModule } from './cldAsmModule';
import { CldFactory } from './cldFactory';
import { cldLoader } from './cldLoader';
import { log } from './util/logger';

/**
 * @internal
 * Creates loadModule function.
 *
 * @param {binaryPath} string Path to import wasm / asm.js binary via `require`
 * @param {binaryEndpoint} [string] For overring path to wasm binary on node.js or browser.
 * @param {environment} [ENVIRONMENT] For overriding running environment
 *
 * @returns {(binaryEndpoint?: string, environment?: ENVIRONMENT) => Promise<CldFactory>} Function to load module
 */
const getLoader = async (binaryPath: string, binaryEndpoint?: string, environment?: ENVIRONMENT) => {
  log(`loadModule: load cld3 module loader from `, binaryPath);

  //imports MODULARIZED emscripten preamble
  //tslint:disable-next-line:no-require-imports no-var-requires
  const runtimeModule = require(`${binaryPath}/cld3`);
  //do not supply this into moduleLoader, emscripten-wasm-loader does its own job to get environment
  const env = environment ? environment : isNode() ? ENVIRONMENT.NODE : ENVIRONMENT.WEB;

  const moduleLoader = await getModuleLoader<CldFactory, CldAsmModule>(
    (runtime: CldAsmModule, env: ENVIRONMENT) => cldLoader(runtime, env),
    {
      //tslint:disable-next-line:no-require-imports
      dir: env === ENVIRONMENT.NODE ? require('path').dirname(require.resolve(`${binaryPath}/cld3`)) : null,
      runtimeModule
    }
  );

  return moduleLoader(binaryEndpoint, environment);
};

export { getLoader };

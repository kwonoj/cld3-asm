import { ENVIRONMENT, getModuleLoader, isNode } from 'emscripten-wasm-loader';
import { CldAsmModule } from './cldAsmModule';
import { CldFactory } from './cldFactory';
import { cldLoader } from './cldLoader';
import { log } from './util/logger';

/**
 * Load, initialize wasm binary to use actual cld wasm instances.
 *
 * @param [InitOptions] Options to initialize cld3 wasm binary.
 * @param {number} [InitOptions.timeout] - timeout to wait wasm binary compilation & load.
 * @param {string | object} [InitOptions.locateBinary] - custom resolution logic for wasm binary. (not supported)
 * @param {ENVIRONMENT} [InitOptions.environment] For overriding running environment
 * It could be either remote endpoint url, or loader-returned object for bundler. Check examples/browser_* for references.
 *
 * @returns {() => Promise<CldFactory>} Function to load module
 */
const loadModule = async (
  initOptions: Partial<{
    timeout: number;
    environment?: ENVIRONMENT;
  }> = {}
) => {
  //imports MODULARIZED emscripten preamble
  //tslint:disable-next-line:no-require-imports no-var-requires
  const runtime = require(`./lib/cld3-asm`);

  const { environment, timeout } = initOptions;
  const env = environment ? environment : isNode() ? ENVIRONMENT.NODE : ENVIRONMENT.WEB;

  log(`loadModule: loading cld3 wasm binary`, { initOptions });

  //https://github.com/kwonoj/docker-hunspell-wasm/issues/63
  //Build module object to construct wasm binary module via emscripten preamble.
  //apply overridden environment values to custom patched hunspell preamble.
  const overriddenModule = { ENVIRONMENT: env };

  const moduleLoader = await getModuleLoader<CldFactory, CldAsmModule>(
    (runtime: CldAsmModule) => cldLoader(runtime, env),
    runtime,
    overriddenModule,
    { timeout }
  );

  return moduleLoader();
};

export { loadModule };

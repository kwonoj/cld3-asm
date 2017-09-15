import { ENVIRONMENT, getModuleLoader, isNode, isWasmEnabled } from 'emscripten-wasm-loader';
import { CldAsmModule } from './cldAsmModule';
import { CldFactory } from './cldFactory';
import { cldLoader } from './cldLoader';
import { log } from './util/logger';

const asmPath = `./lib/${isWasmEnabled() ? 'wasm' : 'asm'}`;
log(`loadModule: load cld3 module loader from `, asmPath);

//imports MODULARIZED emscripten preamble
//tslint:disable-next-line:no-require-imports no-var-requires
const runtimeModule = require(`${asmPath}/cld3`);

export const loadModule: (binaryEndpoint?: string, environment?: ENVIRONMENT) => Promise<CldFactory> = getModuleLoader<
  CldFactory,
  CldAsmModule
>((runtime: CldAsmModule) => cldLoader(runtime), {
  //tslint:disable-next-line:no-require-imports
  dir: isNode() ? require('path').dirname(require.resolve(`${asmPath}/cld3`)) : null,
  runtimeModule
});

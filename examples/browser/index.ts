//tslint:disable:no-console
import { isWasmEnabled } from 'emscripten-wasm-loader';
import { loadModule } from '../../src/index';
import { enableLogger } from '../../src/util/logger';
import { runCld } from '../runCld';

enableLogger(console.log.bind(console));

const runBrowserCld = async () => {
  const cldFactory = await loadModule(`../../src/lib/${isWasmEnabled() ? 'wasm' : 'asm'}`);

  runCld(cldFactory);
};

runBrowserCld();

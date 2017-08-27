//tslint:disable:no-console
import { loadModule } from '../../src/index';
import { isWasmEnabled } from '../../src/util/isWasmEnabled';
import { enableLogger } from '../../src/util/logger';
import { runCld } from '../runCld';

enableLogger(console.log.bind(console));

const runBrowserCld = async () => {
  const cldFactory = await loadModule(`../../src/lib/${isWasmEnabled() ? 'wasm' : 'asm'}`);

  runCld(cldFactory);
};

runBrowserCld();

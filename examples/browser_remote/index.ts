//tslint:disable:no-console no-require-imports
import { loadModule } from '../../src/index';
import { enableLogger } from '../../src/util/logger';
import { runCld } from '../runCld';

enableLogger(console.log.bind(console));

const runBrowserCld = async () => {
  const cldFactory = await loadModule({
    //let file-loader resolves wasm binary when bundling
    locateBinary: (_wasmPath: string) => require('../../src/lib/cld3_web.wasm')
  });

  runCld(cldFactory);
};

runBrowserCld();
